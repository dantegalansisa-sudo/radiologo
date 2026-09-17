<?php
/*
  Formulario de contacto: recibe JSON, valida y manda el mensaje por correo
  al equipo, con Reply-To a quien escribio.
*/

declare(strict_types=1);

require __DIR__ . '/comun.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fallo(405, 'Método no permitido.');
}

$bruto = file_get_contents('php://input');
$cuerpo = json_decode($bruto ?: '', true);
if (!is_array($cuerpo)) {
    fallo(400, 'Datos incorrectos.');
}

// trampa para robots
if (!empty($cuerpo['web'])) {
    responder(200, ['ok' => true]);
}

$nombre = texto($cuerpo['nombre'] ?? '', 120);
$ocupacion = texto($cuerpo['ocupacion'] ?? '', 120);
$correoVisitante = texto($cuerpo['correo'] ?? '', 160);
$telefono = texto($cuerpo['telefono'] ?? '', 40);
$motivo = texto($cuerpo['motivo'] ?? '', 80);
$mensaje = texto($cuerpo['mensaje'] ?? '', 1000);

if ($nombre === '' || $ocupacion === '' || $correoVisitante === '' || $mensaje === '') {
    fallo(400, 'Completa el nombre, la ocupación, el correo y el mensaje.');
}
if (!preg_match(CORREO_VALIDO, $correoVisitante)) {
    fallo(400, 'El correo electrónico no es válido.');
}

if (simulado()) {
    responder(200, ['ok' => true, 'simulado' => true]);
}
$config = leerConfiguracion();
if ($config === null) {
    fallo(503, 'El envío todavía no está configurado en el servidor.');
}

try {
    $correo = nuevoCorreo($config);
    $correo->addAddress($config['to'] ?? DESTINO_POR_DEFECTO);
    $correo->addReplyTo($correoVisitante, $nombre);
    $correo->Subject = 'Radiologo Nacional · Contacto · ' . $nombre;
    $correo->Body = correoInterno(
        'Nuevo mensaje de contacto',
        'Alguien escribió desde el formulario de contacto de radiologonacional.com.',
        tablaDatos([
            ['Nombre', $nombre],
            ['Ocupación / Profesión', $ocupacion],
            ['Correo', $correoVisitante],
            ['Teléfono', $telefono],
            ['Motivo', $motivo],
            ['Mensaje', $mensaje],
        ]),
    );
    $correo->AltBody = "Nuevo mensaje de contacto\n\nNombre: $nombre\nOcupación: $ocupacion\nCorreo: $correoVisitante\nTeléfono: $telefono\nMotivo: $motivo\n\n$mensaje";
    $correo->send();
} catch (CorreoException $e) {
    error_log('contacto.php: ' . $e->getMessage());
    fallo(502, 'No se pudo enviar el mensaje.');
} catch (Throwable $e) {
    error_log('contacto.php: ' . $e->getMessage());
    fallo(500, 'No se pudo enviar el mensaje.');
}

responder(200, ['ok' => true]);
