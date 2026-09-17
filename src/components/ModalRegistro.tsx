import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import Icon, { type IconName } from './Icon';
import Modal from './Modal';
import { Boton, Manuscrita } from './Piezas';
import { DISPONIBILIDADES, ESPECIALIDADES, MODAL_REGISTRO, PROVINCIAS, REGIONES, SEXOS, SITIO, TRATAMIENTOS } from '../data/textos';
import { enviarRegistro } from '../utils/envio';

/*
  Registro de medico radiologo en tres pasos: cada uno muestra solo su bloque
  y un boton "Siguiente" que valida lo rellenado antes de avanzar. Los tres
  bloques siguen en el mismo formulario (los ocultos se esconden, no se
  desmontan) para que al volver atras no se pierda nada y el envio final
  lleve todos los campos.
*/

const MAX_ARCHIVO = 5 * 1024 * 1024;
const MAX_COMENTARIO = 500;
const ACEPTA = '.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png';

function Campo({ etiqueta, obligatorio, children, ancho }: { etiqueta: string; obligatorio?: boolean; children: React.ReactNode; ancho?: 2 | 3 }) {
  return (
    <label className={`campo${ancho ? ` campo--${ancho}` : ''}`}>
      <span className="campo__etiqueta">
        {etiqueta}
        {obligatorio && <em aria-hidden="true">*</em>}
      </span>
      {children}
    </label>
  );
}

function Seleccion({ name, opciones, placeholder, required, defaultValue }: { name: string; opciones: string[]; placeholder?: string; required?: boolean; defaultValue?: string }) {
  return (
    <span className="seleccion">
      <select name={name} required={required} defaultValue={defaultValue ?? ''}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {opciones.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" size={16} strokeWidth={2.2} />
    </span>
  );
}

/** Zona de subida de un archivo (o varios) con la lista de lo elegido. */
function Archivos({ name, titulo, nota, multiple, required, onChange }: { name: string; titulo: string; nota: string; multiple?: boolean; required?: boolean; onChange?: (f: File[]) => void }) {
  const [lista, setLista] = useState<File[]>([]);
  const [error, setError] = useState('');
  const entrada = useRef<HTMLInputElement>(null);

  const elegir = (e: ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files ?? []);
    const grande = archivos.find((a) => a.size > MAX_ARCHIVO);
    if (grande) {
      setError(`«${grande.name}» supera los 5 MB.`);
      e.target.value = '';
      setLista([]);
      onChange?.([]);
      return;
    }
    setError('');
    setLista(archivos);
    onChange?.(archivos);
  };

  return (
    <div className={`archivos${error ? ' is-error' : ''}`}>
      <input ref={entrada} type="file" name={name} accept={ACEPTA} multiple={multiple} required={required} onChange={elegir} hidden />
      <button type="button" className="archivos__zona" onClick={() => entrada.current?.click()}>
        <Icon name="upload" size={26} strokeWidth={1.7} />
        <b>{titulo}</b>
        <small>{nota}</small>
      </button>
      {lista.length > 0 && (
        <ul className="archivos__lista">
          {lista.map((a) => (
            <li key={a.name + a.size}>
              <Icon name="file-text" size={15} strokeWidth={2} />
              {a.name} <small>({(a.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB)</small>
            </li>
          ))}
        </ul>
      )}
      {error && <span className="campo__error">{error}</span>}
    </div>
  );
}

export default function ModalRegistro({ onClose, onExito }: { onClose: () => void; onExito: (correo: string) => void }) {
  const M = MODAL_REGISTRO;
  const [paso, setPaso] = useState(0);
  /** Hasta que paso ha llegado: los anteriores se pueden revisar pulsandolos. */
  const [alcanzado, setAlcanzado] = useState(0);
  const [comentario, setComentario] = useState('');
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const cuerpo = useRef<HTMLDivElement>(null);
  const bloques = useRef<(HTMLElement | null)[]>([]);
  const pasosRef = useRef<HTMLOListElement>(null);

  /** Comprueba los campos de un bloque; muestra el primer aviso del navegador. */
  const bloqueValido = (i: number): boolean => {
    const bloque = bloques.current[i];
    if (!bloque) return true;
    const campos = bloque.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea');
    for (const c of campos) {
      if (!c.checkValidity()) {
        c.reportValidity();
        return false;
      }
    }
    if (i === 1 && !especialidades.length) {
      setError('Selecciona al menos una especialidad de lectura.');
      return false;
    }
    return true;
  };

  const mostrarPaso = (i: number) => {
    setPaso(i);
    setAlcanzado((a) => Math.max(a, i));
    setError('');
    // el indicador de pasos queda arriba y el bloque nuevo justo debajo
    window.requestAnimationFrame(() => pasosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const siguiente = () => {
    if (!bloqueValido(paso)) return;
    mostrarPaso(Math.min(2, paso + 1));
  };
  const atras = () => mostrarPaso(Math.max(0, paso - 1));
  /** Desde el indicador solo se puede ir a pasos ya alcanzados. */
  const irAPaso = (i: number) => {
    if (i <= alcanzado) mostrarPaso(i);
  };

  const alternarEspecialidad = (e: string) => {
    if (e === 'Todas') {
      setEspecialidades((s) => (s.length === ESPECIALIDADES.length ? [] : [...ESPECIALIDADES]));
      return;
    }
    setEspecialidades((s) => (s.includes(e) ? s.filter((x) => x !== e) : [...s, e]));
  };
  const todas = especialidades.length === ESPECIALIDADES.length;

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    for (const i of [0, 1, 2]) {
      if (!bloqueValido(i)) {
        if (i !== paso) mostrarPaso(i);
        return;
      }
    }
    const form = new FormData(e.currentTarget);
    form.set('especialidades', especialidades.join(', '));
    const correo = String(form.get('correo') ?? '').trim();
    setEnviando(true);
    const r = await enviarRegistro(form);
    setEnviando(false);
    if (r.ok) {
      onExito(correo);
    } else {
      setError(r.error ?? 'No se pudo enviar el registro.');
      cuerpo.current?.scrollTo({ top: cuerpo.current.scrollHeight, behavior: 'smooth' });
    }
  };

  const lateral: { icon: IconName; titulo: string; texto: string }[] = M.lateral;

  return (
    <Modal titulo={M.titulo} onClose={onClose} ancho="1120px" className="modal--registro">
      <form className="reg" onSubmit={enviar} noValidate>
        <div className="reg__cuerpo" ref={cuerpo}>
          {/* ---------- cabecera con foto ---------- */}
          <header className="reg__cabeza">
            <img className="reg__foto" src="/img/registro.webp" alt="" aria-hidden="true" width={1600} height={600} />
            <div className="reg__cabeza-texto">
              <img className="reg__logo" src="/brand/logo.webp" alt={SITIO.nombre} width={1200} height={447} />
              <h2>{M.titulo}</h2>
              <p>{M.subtitulo}</p>
            </div>
            <ol className="reg__pasos" aria-label="Pasos del registro" ref={pasosRef}>
              {M.pasos.map((p, i) => (
                <li key={p} className={i === paso ? 'is-activo' : i < paso ? 'is-hecho' : ''}>
                  <button type="button" onClick={() => irAPaso(i)} disabled={i > alcanzado} aria-current={i === paso ? 'step' : undefined}>
                    <span className="reg__paso-num">{i + 1}</span>
                    <span className="reg__paso-nombre">{p}</span>
                  </button>
                </li>
              ))}
            </ol>
          </header>

          <div className="reg__dos">
            <div className="reg__formulario">
              {/* ---------- 1. datos personales ---------- */}
              <section className="bloque" ref={(el) => { bloques.current[0] = el; }} hidden={paso !== 0}>
                <h3>
                  <Icon name="user-round" size={22} strokeWidth={1.8} />
                  1. Datos personales
                </h3>
                <div className="rejilla">
                  <Campo etiqueta="Tratamiento" obligatorio>
                    <Seleccion name="tratamiento" opciones={TRATAMIENTOS} defaultValue="Dr." required />
                  </Campo>
                  <Campo etiqueta="Sexo">
                    <Seleccion name="sexo" opciones={SEXOS} placeholder="Selecciona" />
                  </Campo>
                  <Campo etiqueta="Nombre(s)" obligatorio>
                    <input name="nombre" type="text" required placeholder="Ej. Juan Carlos" autoComplete="given-name" />
                  </Campo>
                  <Campo etiqueta="Apellido(s)" obligatorio>
                    <input name="apellido" type="text" required placeholder="Ej. Pérez Gómez" autoComplete="family-name" />
                  </Campo>
                  <Campo etiqueta="Cédula de identidad" obligatorio>
                    <input name="cedula" type="text" required placeholder="Ej. 001-1234567-8" inputMode="numeric" />
                  </Campo>
                  <Campo etiqueta="Número de teléfono" obligatorio>
                    <span className="telefono">
                      <span className="telefono__pais" aria-hidden="true">
                        <svg width="18" height="12" viewBox="0 0 32 20"><rect width="14" height="8.5" fill="#002d62" /><rect x="18" width="14" height="8.5" fill="#ce1126" /><rect y="11.5" width="14" height="8.5" fill="#ce1126" /><rect x="18" y="11.5" width="14" height="8.5" fill="#002d62" /><rect x="14" width="4" height="20" fill="#fff" /><rect y="8.5" width="32" height="3" fill="#fff" /></svg>
                        +1
                      </span>
                      <input name="telefono" type="tel" required placeholder="Ej. 809 123 4567" autoComplete="tel-national" />
                    </span>
                  </Campo>
                  <Campo etiqueta="Correo electrónico" obligatorio>
                    <input name="correo" type="email" required placeholder="Ej. juan.perez@email.com" autoComplete="email" />
                  </Campo>
                  <Campo etiqueta="Dirección actual" obligatorio>
                    <input name="direccion" type="text" required placeholder="Ej. Av. Independencia #123" autoComplete="street-address" />
                  </Campo>
                  <Campo etiqueta="Ciudad / Municipio" obligatorio>
                    <input name="ciudad" type="text" required placeholder="Ej. Santo Domingo Este" autoComplete="address-level2" />
                  </Campo>
                  <Campo etiqueta="Provincia" obligatorio>
                    <Seleccion name="provincia" opciones={PROVINCIAS} placeholder="Selecciona tu provincia" required />
                  </Campo>
                  <Campo etiqueta="Región de interés" obligatorio>
                    <Seleccion name="region" opciones={REGIONES} placeholder="Selecciona tu región" required />
                  </Campo>
                </div>
              </section>

              {/* ---------- 2. informacion profesional ---------- */}
              <section className="bloque" ref={(el) => { bloques.current[1] = el; }} hidden={paso !== 1}>
                <h3>
                  <Icon name="briefcase" size={22} strokeWidth={1.8} />
                  2. Información profesional
                </h3>
                <div className="rejilla">
                  <Campo etiqueta="No. de Exequátur" obligatorio>
                    <input name="exequatur" type="text" required placeholder="Ej. 12345" />
                  </Campo>
                  <Campo etiqueta="Universidad o casa de estudios" obligatorio ancho={2}>
                    <input name="universidad" type="text" required placeholder="Ej. Universidad Autónoma de Santo Domingo" />
                  </Campo>
                  <Campo etiqueta="Año de graduación">
                    <input name="graduacion" type="number" min={1950} max={new Date().getFullYear()} placeholder="Ej. 2018" inputMode="numeric" />
                  </Campo>
                </div>
                <p className="campo__etiqueta reg__rotulo">
                  Especialidades de lectura <small>(puedes seleccionar varias)</small>
                  <em aria-hidden="true">*</em>
                </p>
                <ul className="casillas" role="group" aria-label="Especialidades de lectura">
                  {[...ESPECIALIDADES, 'Todas'].map((e) => {
                    const marcada = e === 'Todas' ? todas : especialidades.includes(e);
                    return (
                      <li key={e}>
                        <label className={`casilla${marcada ? ' is-marcada' : ''}`}>
                          <input type="checkbox" checked={marcada} onChange={() => alternarEspecialidad(e)} />
                          <span className="casilla__cuadro" aria-hidden="true">
                            {marcada && <Icon name="check" size={12} strokeWidth={3} />}
                          </span>
                          {e}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* ---------- 3. disponibilidad y documentos ---------- */}
              <section className="bloque" ref={(el) => { bloques.current[2] = el; }} hidden={paso !== 2}>
                <h3>
                  <Icon name="clock" size={22} strokeWidth={1.8} />
                  3. Disponibilidad y documentos
                </h3>
                <div className="rejilla rejilla--dos">
                  <Campo etiqueta="Disponibilidad para lectura de estudios" obligatorio>
                    <Seleccion name="disponibilidad" opciones={DISPONIBILIDADES} placeholder="Selecciona tu disponibilidad" required />
                  </Campo>
                  <Campo etiqueta="Comentario / Presentación profesional" obligatorio>
                    <span className="area">
                      <textarea
                        name="comentario"
                        required
                        rows={3}
                        maxLength={MAX_COMENTARIO}
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        placeholder="Cuéntanos brevemente sobre tu experiencia, áreas de interés y por qué deseas formar parte de Radiologo Nacional…"
                      />
                      <small>
                        {comentario.length}/{MAX_COMENTARIO}
                      </small>
                    </span>
                  </Campo>
                </div>
                <div className="rejilla rejilla--dos">
                  <div className="campo">
                    <span className="campo__etiqueta">
                      Certificado de graduación<em aria-hidden="true">*</em>
                    </span>
                    <Archivos name="certificado" titulo="Haz clic para subir tu certificado" nota="PDF, JPG o PNG (máx. 5 MB)" required />
                  </div>
                  <div className="campo">
                    <span className="campo__etiqueta">Documentos adicionales (opcional)</span>
                    <Archivos name="documentos[]" titulo="Puedes subir tu CV u otros documentos" nota="PDF, JPG o PNG (máx. 5 MB cada uno)" multiple />
                  </div>
                </div>
              </section>

              {/* trampa para robots */}
              <input className="trampa" type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            </div>

            {/* ---------- lateral ---------- */}
            <aside className="reg__lateral" aria-label="Por qué registrarte">
              {lateral.map((l) => (
                <div key={l.titulo} className="reg__ventaja">
                  <Icon name={l.icon} size={34} strokeWidth={1.5} />
                  <b>{l.titulo}</b>
                  <span>{l.texto}</span>
                </div>
              ))}
              <Manuscrita className="reg__manuscrita">{SITIO.lema}</Manuscrita>
            </aside>
          </div>
        </div>

        {/* ---------- pie fijo ---------- */}
        <footer className="reg__pie">
          <p className="reg__privacidad">
            <Icon name="shield" size={22} strokeWidth={1.8} />
            {M.privacidad}
          </p>
          {error && (
            <p className="reg__error" role="alert">
              <Icon name="alert" size={18} strokeWidth={2} />
              {error}
            </p>
          )}
          <div className="reg__acciones">
            {paso === 0 ? (
              <button type="button" className="btn btn--borde" onClick={onClose} disabled={enviando}>
                <span>{M.cancelar}</span>
              </button>
            ) : (
              <button type="button" className="btn btn--borde" onClick={atras} disabled={enviando}>
                <Icon name="chevron-left" size={16} strokeWidth={2.4} />
                <span>{M.atras}</span>
              </button>
            )}
            {paso < 2 ? (
              <Boton onClick={siguiente}>
                {M.siguiente}
              </Boton>
            ) : (
              <Boton tipo="submit" cargando={enviando}>
                {M.enviar}
              </Boton>
            )}
            <span className="reg__contador" aria-hidden="true">
              Paso {paso + 1} de {M.pasos.length}
            </span>
          </div>
        </footer>
      </form>
    </Modal>
  );
}
