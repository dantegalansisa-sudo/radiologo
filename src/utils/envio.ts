/*
  Envio de los formularios a la API PHP (/api/contacto y /api/registro).
  Ambos responden JSON { ok, error? }.
*/

export interface Resultado {
  ok: boolean;
  error?: string;
}

const GENERICO = 'No pudimos enviar tu información. Inténtalo de nuevo en unos minutos.';

async function leer(r: Response): Promise<Resultado> {
  const tipo = r.headers.get('content-type') ?? '';
  if (!tipo.includes('application/json')) return { ok: false, error: GENERICO };
  const cuerpo = (await r.json()) as Resultado;
  if (r.ok && cuerpo.ok) return { ok: true };
  return { ok: false, error: cuerpo.error || GENERICO };
}

export async function enviarContacto(datos: Record<string, string>): Promise<Resultado> {
  try {
    const r = await fetch('/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await leer(r);
  } catch {
    return { ok: false, error: GENERICO };
  }
}

/** El registro lleva archivos: va como multipart. */
export async function enviarRegistro(form: FormData): Promise<Resultado> {
  try {
    const r = await fetch('/api/registro', { method: 'POST', body: form });
    return await leer(r);
  } catch {
    return { ok: false, error: GENERICO };
  }
}

/** Direccion del webmail del proveedor del correo (gmail.com -> Gmail...). */
export function webmailDe(correo: string): string {
  const dominio = correo.split('@')[1]?.toLowerCase() ?? '';
  if (!dominio) return 'https://mail.google.com/';
  if (['gmail.com', 'googlemail.com'].includes(dominio)) return 'https://mail.google.com/';
  if (['outlook.com', 'hotmail.com', 'live.com', 'msn.com', 'hotmail.es', 'outlook.es'].includes(dominio)) return 'https://outlook.live.com/mail/';
  if (['yahoo.com', 'yahoo.es', 'ymail.com'].includes(dominio)) return 'https://mail.yahoo.com/';
  if (['icloud.com', 'me.com', 'mac.com'].includes(dominio)) return 'https://www.icloud.com/mail/';
  if (['aol.com'].includes(dominio)) return 'https://mail.aol.com/';
  if (['protonmail.com', 'proton.me', 'pm.me'].includes(dominio)) return 'https://mail.proton.me/';
  if (['zoho.com'].includes(dominio)) return 'https://mail.zoho.com/';
  // correo de empresa o institucion: su propio webmail suele estar en el dominio
  return `https://${dominio}`;
}
