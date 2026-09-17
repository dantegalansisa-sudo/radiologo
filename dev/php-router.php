<?php
/*
  Servidor PHP de desarrollo para los formularios:
    php -S 127.0.0.1:8091 dev/php-router.php
  Vite (npm run dev) reenvia /api a este servidor.
*/
$raiz = dirname(__DIR__);
// sin SMTP local: los formularios responden ok sin enviar nada
putenv('RN_SIMULAR=1');
// configuracion local opcional (ignorada por git): una base de datos de
// pruebas en 'db' para ver los registros guardados. Los documentos van a
// <repositorio>/radiologonacional-documentos/ (tambien ignorada).
if (is_file(__DIR__ . '/config-local.php')) {
    putenv('RN_SMTP_CONFIG=' . __DIR__ . '/config-local.php');
}
$ruta = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
if (preg_match('#^/api/(registro|contacto)/?$#', $ruta, $m)) {
    chdir($raiz . '/public/api');
    require $raiz . '/public/api/' . $m[1] . '.php';
    return true;
}
http_response_code(404);
return true;
