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
public/api/registro.php    registro: correo al equipo con adjuntos + bienvenida al medico
public/api/contacto.php    contacto: correo al equipo
public/api/comun.php       SMTP (PHPMailer) y plantillas
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

## Publicación (cPanel de radiologonacional.com)

1. En el repositorio, `Settings → Secrets and variables → Actions`:
   `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` (cuenta FTP del cPanel de
   radiologonacional.com). Cada push a `main` compila y sube `dist/` a
   `public_html/`. Si el hosting bloquea el FTP (cada 28 días), el job falla
   con un aviso: desbloquear en el panel y relanzar.
2. Correo: copiar `radiologonacional-smtp.example.php` como
   `radiologonacional-smtp.php` en la carpeta **padre** de `public_html`
   con los datos del buzón `noreply@radiologonacional.com` y el destino
   (`to`) al que deben llegar los registros y mensajes. Sin ese archivo los
   formularios responden «El envío todavía no está configurado».

## Formularios

- **Registro** (`/api/registro`, multipart): valida los campos, admite el
  certificado (obligatorio) y documentos adicionales (PDF/JPG/PNG, 5 MB cada
  uno), manda todo al equipo y envía al médico el correo de bienvenida con la
  plantilla del diseño. El botón «Revisar mi correo» abre el webmail del
  proveedor del correo registrado (Gmail, Outlook, Yahoo, iCloud… o el
  dominio propio).
- **Contacto** (`/api/contacto`, JSON): al equipo, con Reply-To al remitente.

Ambos llevan un campo trampa para robots y responden `{ ok, error? }`.
