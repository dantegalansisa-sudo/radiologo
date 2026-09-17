-- ============================================================
--  Radiologo Nacional · tabla de registros de medicos radiologos
--
--  Ejecutar UNA vez en phpMyAdmin (cPanel > phpMyAdmin > la base de datos
--  creada para el sitio > pestana SQL). Crea la tabla `registros`; si en
--  la configuracion se usa otro nombre ('table'), cambiarlo aqui tambien.
--
--  Cada registro del formulario es una fila. Los documentos NO se guardan
--  en la base: van a la carpeta privada del servidor y aqui queda la ruta.
--    documentos_carpeta  carpeta absoluta del registro en el servidor
--    certificado         nombre del archivo del certificado dentro de ella
--    documentos          JSON con todos los archivos:
--                        [{campo, archivo, nombre_original, tamano, tipo}]
--    ruta completa de un archivo = documentos_carpeta + '/' + archivo
--
--  estado y notas los usa el equipo desde su propio sistema (el sitio solo
--  inserta filas con estado 'nuevo').
-- ============================================================

CREATE TABLE IF NOT EXISTS `registros` (
  `id`                 INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `fecha_registro`     DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora en que se recibio el formulario',

  -- datos personales
  `tratamiento`        VARCHAR(10)      NOT NULL DEFAULT '' COMMENT 'Dr. / Dra.',
  `sexo`               VARCHAR(20)      NOT NULL DEFAULT '',
  `nombre`             VARCHAR(80)      NOT NULL,
  `apellido`           VARCHAR(80)      NOT NULL,
  `cedula`             VARCHAR(30)      NOT NULL,
  `telefono`           VARCHAR(30)      NOT NULL,
  `correo`             VARCHAR(160)     NOT NULL,
  `direccion`          VARCHAR(200)     NOT NULL,
  `ciudad`             VARCHAR(80)      NOT NULL COMMENT 'Ciudad / Municipio',
  `provincia`          VARCHAR(60)      NOT NULL,
  `region`             VARCHAR(120)     NOT NULL COMMENT 'Region de interes',

  -- datos profesionales
  `exequatur`          VARCHAR(40)      NOT NULL,
  `universidad`        VARCHAR(160)     NOT NULL,
  `graduacion`         SMALLINT UNSIGNED NULL COMMENT 'Anio de graduacion',
  `especialidades`     VARCHAR(600)     NOT NULL COMMENT 'Especialidades de lectura, separadas por coma',
  `disponibilidad`     VARCHAR(80)      NOT NULL,
  `comentario`         TEXT             NOT NULL COMMENT 'Comentario / presentacion profesional',

  -- documentos (archivos en la carpeta privada del servidor, no en la base)
  `documentos_carpeta` VARCHAR(255)     NULL COMMENT 'Carpeta absoluta del registro en el servidor',
  `certificado`        VARCHAR(255)     NULL COMMENT 'Archivo del certificado dentro de la carpeta',
  `documentos`         TEXT             NULL COMMENT 'JSON: [{campo, archivo, nombre_original, tamano, tipo}]',

  -- seguimiento
  `correo_equipo`      DATETIME         NULL COMMENT 'Cuando se envio el aviso al equipo (NULL si fallo)',
  `correo_bienvenida`  DATETIME         NULL COMMENT 'Cuando se envio la bienvenida al medico (NULL si fallo)',
  `ip`                 VARCHAR(45)      NOT NULL DEFAULT '',
  `navegador`          VARCHAR(255)     NOT NULL DEFAULT '',
  `estado`             ENUM('nuevo', 'en_revision', 'aprobado', 'rechazado') NOT NULL DEFAULT 'nuevo' COMMENT 'Lo gestiona el equipo',
  `notas`              TEXT             NULL COMMENT 'Notas internas del equipo',

  PRIMARY KEY (`id`),
  KEY `idx_fecha`  (`fecha_registro`),
  KEY `idx_correo` (`correo`),
  KEY `idx_cedula` (`cedula`),
  KEY `idx_estado` (`estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Registros del formulario de radiologonacional.com';
