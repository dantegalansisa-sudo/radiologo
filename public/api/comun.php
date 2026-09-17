<?php
/*
  Radiologo Nacional: funciones comunes de los formularios (registro y
  contacto). Envia por SMTP con PHPMailer.

  La configuracion SMTP NO va en el repositorio. Se lee, por este orden:
    1. Variables de entorno RN_SMTP_HOST, _PORT, _SECURE, _USER, _PASS,
       _FROM, _FROM_NAME, _TO.
    2. Un archivo PHP que devuelve un array, fuera de public_html:
       - la ruta de RN_SMTP_CONFIG, si existe, o
       - <carpeta padre de public_html>/radiologonacional-smtp.php

  Campos del archivo (ver radiologonacional-smtp.example.php):
    host, port, secure ('ssl' o 'tls'), user, pass, from, from_name,
    to (adonde llegan los registros y mensajes).
*/

declare(strict_types=1);

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\Exception as CorreoException;
use PHPMailer\PHPMailer\PHPMailer;

const DESTINO_POR_DEFECTO = 'info@link-dicom.com';
const REMITE_POR_DEFECTO = 'noreply@radiologonacional.com';
const REMITE_NOMBRE = 'Radiologo Nacional';
const CORREO_VALIDO = '/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/';
const URL_SITIO = 'https://radiologonacional.com';

function responder(int $codigo, array $cuerpo): void
{
    http_response_code($codigo);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fallo(int $codigo, string $mensaje): void
{
    responder($codigo, ['ok' => false, 'error' => $mensaje]);
}

function escapar(string $texto): string
{
    return htmlspecialchars($texto, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function texto($valor, int $maximo = 500): string
{
    if (!is_scalar($valor)) {
        return '';
    }
    $t = trim((string) $valor);
    return function_exists('mb_substr') ? mb_substr($t, 0, $maximo) : substr($t, 0, $maximo);
}

/** En desarrollo (dev/php-router.php) los envios se dan por hechos sin SMTP. */
function simulado(): bool
{
    return getenv('RN_SIMULAR') === '1';
}

function leerConfiguracion(): ?array
{
    $claves = ['host', 'port', 'secure', 'user', 'pass', 'from', 'from_name', 'to'];
    $entorno = [];
    foreach ($claves as $clave) {
        $valor = getenv('RN_SMTP_' . strtoupper($clave));
        if ($valor !== false && $valor !== '') {
            $entorno[$clave] = $valor;
        }
    }
    if (isset($entorno['host'], $entorno['user'], $entorno['pass'])) {
        return $entorno;
    }

    $candidatas = [];
    $ruta = getenv('RN_SMTP_CONFIG');
    if ($ruta !== false && $ruta !== '') {
        $candidatas[] = $ruta;
    }
    // public_html/api/comun.php -> la carpeta padre de public_html
    $candidatas[] = dirname(__DIR__, 2) . '/radiologonacional-smtp.php';
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $candidatas[] = dirname($_SERVER['DOCUMENT_ROOT']) . '/radiologonacional-smtp.php';
    }
    foreach ($candidatas as $archivo) {
        if (is_readable($archivo)) {
            $config = include $archivo;
            if (is_array($config) && isset($config['host'], $config['user'], $config['pass'])) {
                return $config;
            }
        }
    }
    return null;
}

/** Un PHPMailer listo con la conexion SMTP configurada. */
function nuevoCorreo(array $config): PHPMailer
{
    $puerto = (int) ($config['port'] ?? 465);
    $seguridad = strtolower((string) ($config['secure'] ?? ($puerto === 587 ? 'tls' : 'ssl')));
    $correo = new PHPMailer(true);
    $correo->CharSet = PHPMailer::CHARSET_UTF8;
    $correo->isSMTP();
    $correo->Host = $config['host'];
    $correo->Port = $puerto;
    $correo->SMTPAuth = true;
    $correo->Username = $config['user'];
    $correo->Password = $config['pass'];
    $correo->SMTPSecure = $seguridad === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $correo->Timeout = 20;
    $correo->setFrom($config['from'] ?? $config['user'] ?? REMITE_POR_DEFECTO, $config['from_name'] ?? REMITE_NOMBRE);
    $correo->isHTML(true);
    return $correo;
}

/** Tabla etiqueta/valor para los correos internos. */
function tablaDatos(array $filas): string
{
    $html = '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#182238">';
    foreach ($filas as [$etiqueta, $valor]) {
        if ($valor === '' || $valor === null) {
            continue;
        }
        $html .= '<tr><td style="padding:8px 10px;border-bottom:1px solid #e3e9f3;color:#6b7891;width:38%;vertical-align:top">' . escapar($etiqueta) . '</td>'
            . '<td style="padding:8px 10px;border-bottom:1px solid #e3e9f3;font-weight:600;vertical-align:top">' . nl2br(escapar((string) $valor)) . '</td></tr>';
    }
    return $html . '</table>';
}

/** Envoltura azul de los correos que llegan al equipo. */
function correoInterno(string $titulo, string $descripcion, string $cuerpo): string
{
    return '<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#eef2f9;font-family:Arial,Helvetica,sans-serif">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #dde5f2">'
        . '<tr><td style="background:#0a1e4a;padding:22px 26px;color:#fff">'
        . '<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.7">Radiologo Nacional</div>'
        . '<div style="font-size:22px;font-weight:700;margin-top:6px">' . escapar($titulo) . '</div>'
        . '<div style="font-size:14px;opacity:.85;margin-top:6px">' . escapar($descripcion) . '</div></td></tr>'
        . '<tr><td style="padding:22px 26px">' . $cuerpo . '</td></tr>'
        . '<tr><td style="padding:14px 26px;background:#f5f7fb;color:#6b7891;font-size:12px">Mensaje automático de ' . URL_SITIO . '. Al responder, el correo llega directamente a la persona que escribió.</td></tr>'
        . '</table></body></html>';
}
