# Radiologo Nacional

Landing de demostración de **Radiologo Nacional** (registro nacional de
radiólogos y red hospitalaria interconectada), desarrollada por LINKDICOM
para presentar el proyecto. Dominio: `radiologonacional.com`.

React 18 + TypeScript + Vite + Framer Motion. Una sola página con sus modales
(sobre el proyecto, registro, registro recibido, conoce la red, contacto,
avisos de demostración) y dos formularios que se envían por correo con PHP.

## Estructura

```
index.html                 pagina
src/App.tsx                acciones y modales
src/components/            secciones y modales
src/data/textos.ts         TODOS los textos del diseno (cambiar aqui)
src/styles/                base, pagina y modales
public/brand/              logotipo (claro y blanco), favicon
public/img/                fotos del diseno, correo/ (cabecera y pie del email)
public/api/registro.php    registro: documentos a carpeta privada, fila en MySQL, correo al equipo + bienvenida
public/api/contacto.php    contacto: correo al equipo
public/api/comun.php       configuracion, SMTP (PHPMailer), MySQL (PDO) y plantillas
bd/registros.sql           tabla `registros` (ejecutar una vez en phpMyAdmin)
public/.htaccess           HTTPS, sin www, rutas de la API, cache
dev/php-router.php         API en desarrollo (los envios se simulan)
.github/workflows/         publicacion por FTP en cada push a main
```

## Desarrollo

```
npm install
npm run dev        # http://localhost:5181
npm run dev:api    # API PHP en 127.0.0.1:8091 (opcional; sin SMTP, simula los envios)
```

En desarrollo los correos se simulan, pero si existe `dev/config-local.php`
(ignorado por git) con una clave `db` de una base de pruebas, los registros
sí se insertan; los documentos van a `radiologonacional-documentos/` en la
raíz del repositorio (también ignorada).

## Publicación (cPanel de radiologonacional.com)

1. En el repositorio, `Settings → Secrets and variables → Actions`:
   `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (cuenta FTP del cPanel de
   radiologonacional.com). Cada push a `main` compila y sube `dist/` a
   `public_html/`. Si el hosting bloquea el FTP (cada 28 días), el job falla
   con un aviso: desbloquear en el panel y relanzar.
2. Configuración: copiar `radiologonacional-smtp.example.php` como
   `radiologonacional-smtp.php` en la carpeta **padre** de `public_html`
   (nunca en el repositorio) con:
   - el buzón `noreply@radiologonacional.com` y el destino (`to`) al que
     deben llegar los registros y mensajes;
   - en `db`, la base de datos MySQL creada en cPanel (nombre, usuario y
     contraseña; `host` suele ser `localhost`). Puede ir también en un
     archivo aparte `radiologonacional-bd.php` al lado.
   Sin correo ni base de datos los formularios responden «El envío todavía
   no está configurado».
3. Base de datos: en cPanel → *Bases de datos MySQL* crear la base y un
   usuario con todos los privilegios sobre ella; luego en phpMyAdmin,
   pestaña SQL, ejecutar `bd/registros.sql` (crea la tabla `registros`).
4. Documentos: el certificado y los documentos de cada registro se guardan
   en `<carpeta padre de public_html>/radiologonacional-documentos/`
   (se crea sola, fuera de la web) en una subcarpeta por registro
   `año/mes/fecha-hora-apellido-nombre-xxxx/`. Otra carpeta: clave
   `documentos` en la configuración.

## Formularios

- **Registro** (`/api/registro`, multipart): valida los campos, admite el
  certificado (obligatorio) y documentos adicionales (PDF/JPG/PNG, 5 MB cada
  uno) y, por este orden: guarda los documentos en la carpeta privada,
  inserta la fila en `registros` (con la carpeta y los nombres de archivo),
  manda todo al equipo con los adjuntos y envía al médico el correo de
  bienvenida con la plantilla del diseño. Si el correo falla el registro
  queda en la base (`correo_equipo` en NULL); si la base falla el correo sale
  igual; solo responde error si fallan las dos cosas. El botón «Revisar mi
  correo» abre el webmail del proveedor del correo registrado (Gmail,
  Outlook, Yahoo, iCloud… o el dominio propio).
- **Contacto** (`/api/contacto`, JSON): al equipo, con Reply-To al remitente.

Ambos llevan un campo trampa para robots y responden `{ ok, error? }`.
