<?php
/*
  Registro de medico radiologo: recibe el formulario (multipart, con los
  documentos adjuntos) y, por este orden:
    1. guarda los documentos en la carpeta privada del servidor;
    2. guarda el registro en la base de datos (ANTES del correo: si el
       correo falla, el registro no se pierde);
    3. lo manda al equipo con los archivos (aunque la base de datos haya
       fallado, el correo sale igual);
    4. envia al medico el correo de bienvenida con la plantilla del diseno.
  Solo responde error si ni la base de datos ni el correo funcionaron.
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fallo(405, 'Método no permitido.');
}

// trampa para robots
if (!empty($_POST['web'])) {
    responder(200, ['ok' => true]);
}

const MAX_ARCHIVO = 5 * 1024 * 1024;
const MIME_ADMITIDOS = ['application/pdf', 'image/jpeg', 'image/png'];

/* ---------- campos ---------- */
$campos = [
    ['tratamiento', 'Tratamiento', true, 10],
    ['sexo', 'Sexo', false, 20],
    ['nombre', 'Nombre(s)', true, 80],
    ['apellido', 'Apellido(s)', true, 80],
    ['cedula', 'Cédula de identidad', true, 30],
    ['telefono', 'Teléfono', true, 30],
    ['correo', 'Correo electrónico', true, 160],
    ['direccion', 'Dirección actual', true, 200],
    ['ciudad', 'Ciudad / Municipio', true, 80],
    ['provincia', 'Provincia', true, 60],
    ['region', 'Región de interés', true, 120],
    ['exequatur', 'No. de Exequátur', true, 40],
    ['universidad', 'Universidad o casa de estudios', true, 160],
    ['graduacion', 'Año de graduación', false, 4],
    ['especialidades', 'Especialidades de lectura', true, 600],
    ['disponibilidad', 'Disponibilidad', true, 80],
    ['comentario', 'Comentario / Presentación profesional', true, 500],
];

$datos = [];
$faltan = [];
foreach ($campos as [$clave, $etiqueta, $obligatorio, $maximo]) {
    $datos[$clave] = texto($_POST[$clave] ?? '', $maximo);
    if ($obligatorio && $datos[$clave] === '') {
        $faltan[] = $etiqueta;
    }
}
if ($faltan !== []) {
    fallo(400, 'Faltan campos: ' . implode(', ', $faltan) . '.');
}
if (!preg_match(CORREO_VALIDO, $datos['correo'])) {
    fallo(400, 'El correo electrónico no es válido.');
}

/* ---------- archivos ---------- */
function archivosDe(string $campo): array
{
    if (!isset($_FILES[$campo])) {
        return [];
    }
    $f = $_FILES[$campo];
    $lista = [];
    if (is_array($f['name'])) {
        foreach ($f['name'] as $i => $nombre) {
            $lista[] = ['name' => $nombre, 'tmp_name' => $f['tmp_name'][$i], 'error' => $f['error'][$i], 'size' => $f['size'][$i]];
        }
    } else {
        $lista[] = $f;
    }
    return array_values(array_filter($lista, function ($a) {
        return ($a['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
    }));
}

/** Comprueba un archivo subido y devuelve su tipo MIME real. */
function comprobarArchivo(array $a, string $etiqueta): string
{
    if ((int) $a['error'] !== UPLOAD_ERR_OK) {
        fallo(400, "No se pudo recibir el archivo de $etiqueta.");
    }
    if ((int) $a['size'] > MAX_ARCHIVO) {
        fallo(413, "El archivo «{$a['name']}» supera los 5 MB.");
    }
    if (!is_uploaded_file($a['tmp_name'])) {
        fallo(400, 'Archivo no válido.');
    }
    $mime = '';
    if (function_exists('finfo_open')) {
        $fi = finfo_open(FILEINFO_MIME_TYPE);
        if ($fi) {
            $mime = (string) finfo_file($fi, $a['tmp_name']);
            finfo_close($fi);
        }
    }
    $ext = strtolower(pathinfo((string) $a['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['pdf', 'jpg', 'jpeg', 'png'], true) || ($mime !== '' && !in_array($mime, MIME_ADMITIDOS, true))) {
        fallo(400, "El archivo «{$a['name']}» debe ser PDF, JPG o PNG.");
    }
    if ($mime === '') {
        $mime = $ext === 'pdf' ? 'application/pdf' : ($ext === 'png' ? 'image/png' : 'image/jpeg');
    }
    return $mime;
}

$certificados = archivosDe('certificado');
if ($certificados === []) {
    fallo(400, 'Falta el certificado de graduación.');
}
$archivos = [];
foreach ($certificados as $c) {
    $mime = comprobarArchivo($c, 'certificado');
    $archivos[] = ['campo' => 'certificado', 'tmp' => $c['tmp_name'], 'nombre' => (string) $c['name'], 'tamano' => (int) $c['size'], 'tipo' => $mime];
}
foreach (archivosDe('documentos') as $d) {
    $mime = comprobarArchivo($d, 'documentos');
    $archivos[] = ['campo' => 'documento', 'tmp' => $d['tmp_name'], 'nombre' => (string) $d['name'], 'tamano' => (int) $d['size'], 'tipo' => $mime];
}
if (count($archivos) > 8) {
    fallo(400, 'Puedes adjuntar como máximo 8 archivos.');
}

$simular = simulado();
$configSmtp = $simular ? null : leerConfiguracion();
$configBD = leerConfiguracionBD();
if (!$simular && $configSmtp === null && $configBD === null) {
    fallo(503, 'El envío todavía no está configurado en el servidor.');
}

$nombreCompleto = trim($datos['tratamiento'] . ' ' . $datos['nombre'] . ' ' . $datos['apellido']);

/* ---------- 1. documentos a la carpeta privada del servidor ---------- */
$docs = guardarDocumentos($datos, $archivos);

/* ---------- 2. base de datos (antes del correo) ---------- */
$bd = null;
$tabla = TABLA_REGISTROS;
$idRegistro = null;
if ($configBD !== null) {
    try {
        $bd = conectarBD($configBD);
        $tabla = tablaRegistros($configBD);
        $idRegistro = guardarRegistro($bd, $tabla, $datos, $docs);
    } catch (Throwable $e) {
        // no se pierde nada: el correo sale igual y el fallo queda en el log
        error_log('registro.php (base de datos): ' . $e->getMessage());
        $bd = null;
    }
}

if ($simular) {
    responder(200, ['ok' => true, 'simulado' => true, 'registro' => $idRegistro, 'carpeta' => $docs['carpeta']]);
}

/* ---------- 3. al equipo, con los documentos ---------- */
$correoEquipo = false;
if ($configSmtp !== null) {
    try {
        $correo = nuevoCorreo($configSmtp);
        $correo->addAddress($configSmtp['to'] ?? DESTINO_POR_DEFECTO);
        $correo->addReplyTo($datos['correo'], $nombreCompleto);
        $correo->Subject = 'Radiologo Nacional · Nuevo registro · ' . $nombreCompleto;
        $filas = [];
        foreach ($campos as [$clave, $etiqueta]) {
            $filas[] = [$etiqueta, $datos[$clave]];
        }
        $filas[] = ['Documentos adjuntos', implode("\n", array_map(function ($a) {
            return $a['adjunto'];
        }, $docs['archivos']))];
        if ($idRegistro !== null) {
            $filas[] = ['Registro en la base de datos', 'No. ' . $idRegistro];
        }
        if ($docs['carpeta'] !== null) {
            $filas[] = ['Carpeta de documentos en el servidor', $docs['carpeta']];
        }
        $correo->Body = correoInterno(
            'Nuevo registro de médico radiólogo',
            'Se ha recibido un registro desde radiologonacional.com. Los documentos van adjuntos.',
            tablaDatos($filas),
        );
        $texto = "Nuevo registro de médico radiólogo\n\n";
        foreach ($campos as [$clave, $etiqueta]) {
            $texto .= "$etiqueta: {$datos[$clave]}\n";
        }
        $correo->AltBody = $texto;
        foreach ($docs['archivos'] as $a) {
            $correo->addAttachment($a['ruta'], $a['adjunto']);
        }
        $correo->send();
        $correoEquipo = true;
    } catch (Throwable $e) {
        error_log('registro.php (equipo): ' . $e->getMessage());
    }
}
if (!$correoEquipo && $idRegistro === null) {
    // ni se guardo ni se envio: el medico debe volver a intentarlo
    fallo(502, 'No se pudo enviar el registro. Inténtalo de nuevo en unos minutos.');
}
if ($correoEquipo && $bd !== null && $idRegistro !== null) {
    anotarCorreo($bd, $tabla, $idRegistro, 'correo_equipo');
}

/* ---------- 4. al medico: bienvenida ---------- */
if ($configSmtp !== null) {
    try {
        $bienvenida = nuevoCorreo($configSmtp);
        $bienvenida->addAddress($datos['correo'], $nombreCompleto);
        $bienvenida->Subject = 'Bienvenido a Radiologo Nacional';
        $bienvenida->Body = correoBienvenida($datos['tratamiento'], $datos['nombre']);
        $bienvenida->AltBody = "Hola {$datos['tratamiento']} {$datos['nombre']},\n\n¡Gracias por registrarte en Radiologo Nacional!\n\n"
            . "Hemos recibido tu información correctamente y tu solicitud se encuentra en proceso de registro y revisión por nuestro equipo.\n\n"
            . "Te estaremos notificando por este mismo correo una vez que tus datos hayan sido validados y aprobados. Entonces recibirás tu usuario y contraseña para acceder a la plataforma, junto a un video instructivo que te guiará en su uso.\n\n"
            . "Este es un mensaje automático, por favor no respondas a este correo.\n© " . date('Y') . ' Radiologo Nacional. República Dominicana.';
        $bienvenida->send();
        if ($bd !== null && $idRegistro !== null) {
            anotarCorreo($bd, $tabla, $idRegistro, 'correo_bienvenida');
        }
    } catch (Throwable $e) {
        // el registro ya esta guardado o enviado: la bienvenida fallida no lo invalida
        error_log('registro.php (bienvenida): ' . $e->getMessage());
    }
}

responder(200, ['ok' => true]);

/* ---------- documentos ---------- */

/**
 * Mueve los archivos subidos a la carpeta privada de documentos, en una
 * subcarpeta por registro: anio/mes/fecha-hora-apellido-nombre-xxxx/.
 * Devuelve la fecha del registro, la carpeta (null si no se pudo crear) y
 * la lista de archivos; el que no se haya podido guardar conserva su ruta
 * temporal para que, al menos, vaya adjunto en el correo.
 */
function guardarDocumentos(array $datos, array $archivos): array
{
    $base = carpetaDocumentos();
    $ahora = time();
    $carpeta = $base . '/' . date('Y/m', $ahora) . '/' . date('Ymd-His', $ahora) . '-' . slug($datos['apellido'] . ' ' . $datos['nombre']) . '-' . bin2hex(random_bytes(2));
    $listo = (prepararCarpetaDocumentos($base) && @mkdir($carpeta, 0750, true));
    if (!$listo) {
        error_log('registro.php (documentos): no se pudo crear la carpeta ' . $carpeta);
    }
    $guardados = [];
    $n = 0;
    foreach ($archivos as $a) {
        $n++;
        $ext = strtolower(pathinfo($a['nombre'], PATHINFO_EXTENSION));
        $archivo = sprintf('%02d-%s-%s.%s', $n, $a['campo'], slug(pathinfo($a['nombre'], PATHINFO_FILENAME), 40), $ext === 'jpeg' ? 'jpg' : $ext);
        $destino = $carpeta . '/' . $archivo;
        $ok = $listo && @move_uploaded_file($a['tmp'], $destino);
        if ($ok) {
            @chmod($destino, 0640);
        } elseif ($listo) {
            error_log('registro.php (documentos): no se pudo guardar ' . $destino);
        }
        $guardados[] = [
            'campo' => $a['campo'],
            'archivo' => $ok ? $archivo : null,
            'nombre_original' => $a['nombre'],
            'tamano' => $a['tamano'],
            'tipo' => $a['tipo'],
            'guardado' => $ok,
            // ruta real del archivo (guardado o temporal) para adjuntarlo
            'ruta' => $ok ? $destino : $a['tmp'],
            // nombre con el que va en el correo
            'adjunto' => ($a['campo'] === 'certificado' ? 'Certificado - ' : '') . $a['nombre'],
        ];
    }
    return ['fecha' => date('Y-m-d H:i:s', $ahora), 'carpeta' => $listo ? $carpeta : null, 'archivos' => $guardados];
}

/** Crea la carpeta base y, por si acabara dentro de la web, la cierra al navegador. */
function prepararCarpetaDocumentos(string $base): bool
{
    if (!is_dir($base) && !@mkdir($base, 0750, true)) {
        return false;
    }
    if (!is_file($base . '/.htaccess')) {
        @file_put_contents($base . '/.htaccess', "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
    }
    if (!is_file($base . '/index.html')) {
        @file_put_contents($base . '/index.html', '');
    }
    return is_writable($base);
}

/* ---------- base de datos ---------- */

/** Inserta el registro y devuelve su id. */
function guardarRegistro(PDO $bd, string $tabla, array $datos, array $docs): int
{
    $certificado = null;
    $documentos = [];
    foreach ($docs['archivos'] as $a) {
        if (!$a['guardado']) {
            continue;
        }
        if ($certificado === null && $a['campo'] === 'certificado') {
            $certificado = $a['archivo'];
        }
        $documentos[] = [
            'campo' => $a['campo'],
            'archivo' => $a['archivo'],
            'nombre_original' => $a['nombre_original'],
            'tamano' => $a['tamano'],
            'tipo' => $a['tipo'],
        ];
    }
    $fila = ['fecha_registro' => $docs['fecha']] + $datos;
    $fila['graduacion'] = $datos['graduacion'] !== '' ? (int) $datos['graduacion'] : null;
    $fila['documentos_carpeta'] = $docs['carpeta'];
    $fila['certificado'] = $certificado;
    $fila['documentos'] = $documentos !== [] ? json_encode($documentos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE) : null;
    $fila['ip'] = substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
    $fila['navegador'] = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);

    $columnas = array_keys($fila);
    $sql = "INSERT INTO `$tabla` (`" . implode('`, `', $columnas) . "`) VALUES (:" . implode(', :', $columnas) . ')';
    $bd->prepare($sql)->execute($fila);
    return (int) $bd->lastInsertId();
}

/** Anota la fecha de envio de un correo en el registro (sin que un fallo importe). */
function anotarCorreo(PDO $bd, string $tabla, int $id, string $columna): void
{
    try {
        $bd->prepare("UPDATE `$tabla` SET `$columna` = NOW() WHERE `id` = :id")->execute(['id' => $id]);
    } catch (Throwable $e) {
        error_log("registro.php ($columna): " . $e->getMessage());
    }
}

/* ---------- plantilla de bienvenida (diseno del cliente) ---------- */
function correoBienvenida(string $tratamiento, string $nombre): string
{
    $u = URL_SITIO;
    $saludo = escapar(trim("$tratamiento $nombre"));
    $anio = date('Y');
    $beneficios = [
        ['Sé parte de una red nacional de especialistas'],
        ['Conecta con hospitales y centros de salud'],
        ['Accede a oportunidades profesionales'],
        ['Contribuye a una mejor salud para todos'],
    ];
    $celdas = '';
    foreach ($beneficios as [$b]) {
        $celdas .= '<td style="width:25%;padding:6px 8px;vertical-align:top;font-size:13px;line-height:1.35;color:#3c4a66">'
            . '<div style="width:34px;height:34px;border-radius:17px;background:#e7effc;margin-bottom:8px;text-align:center;line-height:34px;color:#1257d5;font-weight:700;font-size:16px">&#10003;</div>'
            . escapar($b) . '</td>';
    }

    return <<<HTML
<!doctype html>
<html lang="es">
<body style="margin:0;padding:20px 12px;background:#eef2f9;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:660px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dde5f2">
  <tr><td style="padding:0"><img src="$u/img/correo/cabecera.jpg" width="660" alt="Radiologo Nacional — Conectando especialistas por una mejor salud" style="display:block;width:100%;height:auto"></td></tr>
  <tr><td style="padding:26px 30px 8px">
    <div style="font-size:30px;font-weight:800;color:#0a1e4a;letter-spacing:-0.5px">Hola $saludo,</div>
    <div style="font-size:19px;font-weight:700;color:#1257d5;margin-top:6px">¡Gracias por registrarte en Radiologo Nacional!</div>
    <p style="font-size:16px;line-height:1.55;color:#3c4a66;margin:18px 0 0">Hemos recibido tu información correctamente y tu solicitud se encuentra en proceso de registro y revisión por nuestro equipo.</p>
    <p style="font-size:16px;line-height:1.55;color:#3c4a66;margin:14px 0 0">Te estaremos notificando por este mismo correo una vez que tus datos hayan sido validados y aprobados. Entonces recibirás tu usuario y contraseña para acceder a la plataforma, junto a un video instructivo que te guiará en su uso.</p>
  </td></tr>
  <tr><td style="padding:18px 30px 6px">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:#e9f0fb;border-radius:14px">
      <tr>
        <td style="width:84px;padding:18px 0 18px 20px;vertical-align:middle"><div style="width:64px;height:64px;border-radius:32px;background:#d5e3fa;text-align:center;line-height:64px;font-size:28px;color:#1257d5">&#9993;</div></td>
        <td style="padding:18px 20px 18px 12px;vertical-align:middle">
          <div style="font-size:17px;font-weight:700;color:#1257d5">Mantente atento a tu correo electrónico</div>
          <div style="font-size:14px;line-height:1.5;color:#3c4a66;margin-top:4px">En los próximos días recibirás un mensaje con la confirmación de tu registro, tus datos de acceso y recursos útiles para comenzar.</div>
        </td>
      </tr>
    </table>
  </td></tr>
  <tr><td style="padding:14px 22px 20px"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%"><tr>$celdas</tr></table></td></tr>
  <tr><td style="padding:0"><img src="$u/img/correo/pie.jpg" width="660" alt="Radiologo Nacional — Potenciado con tecnología dominicana — LINKDICOM" style="display:block;width:100%;height:auto"></td></tr>
  <tr><td style="padding:14px 20px 18px;text-align:center;font-size:12px;line-height:1.6;color:#6b7891">Este es un mensaje automático, por favor no respondas a este correo.<br>© $anio Radiologo Nacional. República Dominicana.</td></tr>
</table>
</body>
</html>
HTML;
}
