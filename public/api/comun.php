<?php
/*
  Radiologo Nacional: funciones comunes de los formularios (registro y
  contacto). Envia por SMTP con PHPMailer y guarda los registros en MySQL.

  La configuracion NO va en el repositorio. Se lee, por este orden:
    1. Variables de entorno: RN_SMTP_HOST, _PORT, _SECURE, _USER, _PASS,
       _FROM, _FROM_NAME, _TO (correo); RN_DB_HOST, _PORT, _NAME, _USER,
       _PASS, _TABLE (base de datos); RN_DOCUMENTOS (carpeta de documentos).
    2. Un archivo PHP que devuelve un array, fuera de public_html:
       - la ruta de RN_SMTP_CONFIG, si existe, o
       - <carpeta padre de public_html>/radiologonacional-smtp.php
       La base de datos va en la clave 'db' de ese mismo archivo o, si se
       prefiere, en <carpeta padre>/radiologonacional-bd.php (solo el array
       de 'db').

  Campos del archivo (ver radiologonacional-smtp.example.php):
    host, port, secure ('ssl' o 'tls'), user, pass, from, from_name,
    to (adonde llegan los registros y mensajes),
    db => [host, port, name, user, pass, table],
    documentos (carpeta privada de los archivos subidos; opcional).
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
const TABLA_REGISTROS = 'registros';

// hora de la Republica Dominicana para fechas, carpetas y correos
date_default_timezone_set('America/Santo_Domingo');

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
    if (!function_exists('mb_substr')) {
        return substr($t, 0, $maximo);
    }
    // bytes que no son UTF-8 valido (no vienen de un navegador) se descartan
    if (!mb_check_encoding($t, 'UTF-8')) {
        $t = mb_convert_encoding($t, 'UTF-8', 'UTF-8');
    }
    return mb_substr($t, 0, $maximo);
}

/** Texto apto para nombres de carpeta y archivo: minusculas, sin acentos, con guiones. */
function slug(string $texto, int $maximo = 48): string
{
    $t = strtr($texto, [
        'á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', 'ü' => 'u', 'ñ' => 'n',
        'Á' => 'a', 'É' => 'e', 'Í' => 'i', 'Ó' => 'o', 'Ú' => 'u', 'Ü' => 'u', 'Ñ' => 'n',
    ]);
    $t = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', $t) ?? '');
    $t = trim(substr($t, 0, $maximo), '-');
    return $t !== '' ? $t : 'registro';
}

/** En desarrollo (dev/php-router.php) los envios se dan por hechos sin SMTP. */
function simulado(): bool
{
    return getenv('RN_SIMULAR') === '1';
}

/* ---------- configuracion (fuera de public_html) ---------- */

/** Carpetas privadas candidatas: la padre de public_html. */
function carpetasPrivadas(): array
{
    // public_html/api/comun.php -> la carpeta padre de public_html
    $lista = [dirname(__DIR__, 2)];
    if (!empty($_SERVER['DOCUMENT_ROOT'])) {
        $padre = dirname($_SERVER['DOCUMENT_ROOT']);
        if (!in_array($padre, $lista, true)) {
            $lista[] = $padre;
        }
    }
    return $lista;
}

/** Lee (una sola vez) el archivo de configuracion; array vacio si no existe. */
function archivoConfiguracion(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $config = [];
    $candidatas = [];
    $ruta = getenv('RN_SMTP_CONFIG');
    if ($ruta !== false && $ruta !== '') {
        $candidatas[] = $ruta;
    }
    foreach (carpetasPrivadas() as $carpeta) {
        $candidatas[] = $carpeta . '/radiologonacional-smtp.php';
    }
    foreach ($candidatas as $archivo) {
        if (is_readable($archivo)) {
            $leido = include $archivo;
            if (is_array($leido)) {
                $config = $leido;
                break;
            }
        }
    }
    // la base de datos puede ir en un archivo aparte, al lado del de SMTP
    if (!isset($config['db'])) {
        foreach (carpetasPrivadas() as $carpeta) {
            $archivo = $carpeta . '/radiologonacional-bd.php';
            if (is_readable($archivo)) {
                $leido = include $archivo;
                if (is_array($leido)) {
                    $config['db'] = $leido['db'] ?? $leido;
                    break;
                }
            }
        }
    }
    return $config;
}

/** Configuracion SMTP, o null si el correo no esta configurado. */
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
    $config = archivoConfiguracion();
    if (isset($config['host'], $config['user'], $config['pass'])) {
        return $config;
    }
    return null;
}

/** Configuracion de la base de datos, o null si no esta configurada. */
function leerConfiguracionBD(): ?array
{
    $claves = ['host', 'port', 'name', 'user', 'pass', 'table'];
    $entorno = [];
    foreach ($claves as $clave) {
        $valor = getenv('RN_DB_' . strtoupper($clave));
        if ($valor !== false && $valor !== '') {
            $entorno[$clave] = $valor;
        }
    }
    if (isset($entorno['name'], $entorno['user'])) {
        return $entorno;
    }
    $db = archivoConfiguracion()['db'] ?? null;
    if (is_array($db) && isset($db['name'], $db['user'])) {
        return $db;
    }
    return null;
}

/** Conexion PDO a MySQL/MariaDB. Lanza excepcion si no se puede conectar. */
function conectarBD(array $db): PDO
{
    $host = (string) ($db['host'] ?? 'localhost');
    $puerto = (int) ($db['port'] ?? 3306);
    $dsn = "mysql:host=$host;port=$puerto;dbname={$db['name']};charset=utf8mb4";
    return new PDO($dsn, (string) $db['user'], (string) ($db['pass'] ?? ''), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 5,
    ]);
}

/** Nombre de la tabla de registros (solo letras, numeros y guion bajo). */
function tablaRegistros(array $db): string
{
    $tabla = (string) ($db['table'] ?? TABLA_REGISTROS);
    return preg_match('/^[A-Za-z0-9_]{1,64}$/', $tabla) ? $tabla : TABLA_REGISTROS;
}

/** Carpeta privada (fuera de public_html) donde se guardan los documentos subidos. */
function carpetaDocumentos(): string
{
    $ruta = getenv('RN_DOCUMENTOS');
    if ($ruta === false || $ruta === '') {
        $ruta = (string) (archivoConfiguracion()['documentos'] ?? '');
    }
    if ($ruta === '') {
        $ruta = carpetasPrivadas()[0] . '/radiologonacional-documentos';
    }
    return rtrim($ruta, '/\\');
}

/* ---------- correo ---------- */

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
