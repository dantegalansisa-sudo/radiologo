<?php
/*
  Registro de medico radiologo: recibe el formulario (multipart, con los
  documentos adjuntos), lo manda al equipo con los archivos y envia al
  medico el correo de bienvenida con la plantilla del diseno.
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

function comprobarArchivo(array $a, string $etiqueta): void
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
}

$certificados = archivosDe('certificado');
if ($certificados === []) {
    fallo(400, 'Falta el certificado de graduación.');
}
$adjuntos = [];
foreach ($certificados as $c) {
    comprobarArchivo($c, 'certificado');
    $adjuntos[] = ['ruta' => $c['tmp_name'], 'nombre' => 'Certificado - ' . $c['name']];
}
foreach (archivosDe('documentos') as $d) {
    comprobarArchivo($d, 'documentos');
    $adjuntos[] = ['ruta' => $d['tmp_name'], 'nombre' => $d['name']];
}
if (count($adjuntos) > 8) {
    fallo(400, 'Puedes adjuntar como máximo 8 archivos.');
}

if (simulado()) {
    responder(200, ['ok' => true, 'simulado' => true]);
}
$config = leerConfiguracion();
if ($config === null) {
    fallo(503, 'El envío todavía no está configurado en el servidor.');
}

$nombreCompleto = trim($datos['tratamiento'] . ' ' . $datos['nombre'] . ' ' . $datos['apellido']);

/* ---------- 1. al equipo, con los documentos ---------- */
try {
    $correo = nuevoCorreo($config);
    $correo->addAddress($config['to'] ?? DESTINO_POR_DEFECTO);
    $correo->addReplyTo($datos['correo'], $nombreCompleto);
    $correo->Subject = 'Radiologo Nacional · Nuevo registro · ' . $nombreCompleto;
    $filas = [];
    foreach ($campos as [$clave, $etiqueta]) {
        $filas[] = [$etiqueta, $datos[$clave]];
    }
    $filas[] = ['Documentos adjuntos', implode("\n", array_map(function ($a) {
        return $a['nombre'];
    }, $adjuntos))];
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
    foreach ($adjuntos as $a) {
        $correo->addAttachment($a['ruta'], $a['nombre']);
    }
    $correo->send();
} catch (CorreoException $e) {
    error_log('registro.php (equipo): ' . $e->getMessage());
    fallo(502, 'No se pudo enviar el registro. Inténtalo de nuevo en unos minutos.');
} catch (Throwable $e) {
    error_log('registro.php (equipo): ' . $e->getMessage());
    fallo(500, 'No se pudo enviar el registro.');
}

/* ---------- 2. al medico: bienvenida ---------- */
try {
    $bienvenida = nuevoCorreo($config);
    $bienvenida->addAddress($datos['correo'], $nombreCompleto);
    $bienvenida->Subject = 'Bienvenido a Radiologo Nacional';
    $bienvenida->Body = correoBienvenida($datos['tratamiento'], $datos['nombre']);
    $bienvenida->AltBody = "Hola {$datos['tratamiento']} {$datos['nombre']},\n\n¡Gracias por registrarte en Radiologo Nacional!\n\n"
        . "Hemos recibido tu información correctamente y tu solicitud se encuentra en proceso de registro y revisión por nuestro equipo.\n\n"
        . "Te estaremos notificando por este mismo correo una vez que tus datos hayan sido validados y aprobados. Entonces recibirás tu usuario y contraseña para acceder a la plataforma, junto a un video instructivo que te guiará en su uso.\n\n"
        . "Este es un mensaje automático, por favor no respondas a este correo.\n© " . date('Y') . ' Radiologo Nacional. República Dominicana.';
    $bienvenida->send();
} catch (Throwable $e) {
    // el registro ya llego al equipo: la bienvenida fallida no invalida el envio
    error_log('registro.php (bienvenida): ' . $e->getMessage());
}

responder(200, ['ok' => true]);

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
