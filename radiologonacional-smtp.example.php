<?php
/*
  Configuracion de Radiologo Nacional: correo (SMTP) y base de datos (MySQL).

  Copia este archivo como radiologonacional-smtp.php en la carpeta PADRE de
  public_html (nunca dentro de public_html ni en el repositorio) y rellena
  los datos. La parte 'db' puede ir tambien en un archivo aparte, al lado,
  llamado radiologonacional-bd.php que devuelva solo ese array.
*/
return [
    // ---- correo: cuenta noreply@radiologonacional.com creada en cPanel ----
    'host' => 'mail.radiologonacional.com',
    'port' => 465,               // 465 con 'ssl' o 587 con 'tls'
    'secure' => 'ssl',
    'user' => 'noreply@radiologonacional.com',
    'pass' => 'LA-CONTRASENA-DEL-BUZON',
    'from' => 'noreply@radiologonacional.com',
    'from_name' => 'Radiologo Nacional',
    // adonde llegan los registros (con los documentos) y los mensajes de contacto
    'to' => 'info@link-dicom.com',

    // ---- base de datos: cPanel > Bases de datos MySQL ----
    // Los registros se guardan en esta tabla ademas de enviarse por correo.
    // La tabla se crea ejecutando bd/registros.sql en phpMyAdmin.
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'usuariocpanel_radiologo',   // nombre completo de la base de datos
        'user' => 'usuariocpanel_rn',          // usuario MySQL con permisos sobre ella
        'pass' => 'LA-CONTRASENA-DE-LA-BASE',
        'table' => 'registros',                // opcional; por defecto 'registros'
    ],

    // ---- documentos subidos (opcional) ----
    // Carpeta del servidor donde se guardan el certificado y los documentos
    // de cada registro, en subcarpetas anio/mes/fecha-apellido-nombre-xxxx/.
    // Por defecto: <carpeta padre de public_html>/radiologonacional-documentos
    // (fuera de la web: nadie puede descargarlos por URL).
    // 'documentos' => '/home/usuariocpanel/radiologonacional-documentos',
];
