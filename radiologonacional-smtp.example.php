<?php
/*
  Configuracion SMTP de Radiologo Nacional.

  Copia este archivo como radiologonacional-smtp.php en la carpeta PADRE de
  public_html (nunca dentro de public_html ni en el repositorio) y rellena
  los datos de la cuenta noreply@radiologonacional.com creada en cPanel.
*/
return [
    'host' => 'mail.radiologonacional.com',
    'port' => 465,               // 465 con 'ssl' o 587 con 'tls'
    'secure' => 'ssl',
    'user' => 'noreply@radiologonacional.com',
    'pass' => 'LA-CONTRASENA-DEL-BUZON',
    'from' => 'noreply@radiologonacional.com',
    'from_name' => 'Radiologo Nacional',
    // adonde llegan los registros (con los documentos) y los mensajes de contacto
    'to' => 'info@link-dicom.com',
];
