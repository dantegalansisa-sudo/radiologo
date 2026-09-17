import { useState, type FormEvent } from 'react';
import Icon from './Icon';
import Modal from './Modal';
import { Boton } from './Piezas';
import { MODAL_CONTACTO, MODAL_EXITO, OCUPACIONES, SITIO } from '../data/textos';
import { enviarContacto, webmailDe } from '../utils/envio';

/* ============================================================
   Registro recibido y contacto
   ============================================================ */

/* ---------- Registro recibido ---------- */

export function ModalExito({ correo, onClose }: { correo: string; onClose: () => void }) {
  const M = MODAL_EXITO;
  return (
    <Modal titulo={M.titulo} onClose={onClose} ancho="720px" className="modal--exito">
      <img className="me__logo" src="/brand/logo.webp" alt={SITIO.nombre} width={1200} height={447} />
      <span className="me__check" aria-hidden="true">
        <i className="me__rayo me__rayo--1" />
        <i className="me__rayo me__rayo--2" />
        <i className="me__rayo me__rayo--3" />
        <i className="me__rayo me__rayo--4" />
        <span>
          <Icon name="check" size={44} strokeWidth={3} />
        </span>
      </span>
      <h2>{M.titulo}</h2>
      <p className="me__sub">{M.subtitulo}</p>
      <p className="me__texto">{M.texto}</p>

      <div className="me__correo">
        <span className="me__sobre" aria-hidden="true">
          <Icon name="mail" size={44} strokeWidth={1.6} />
        </span>
        <div>
          <b>{M.correoTitulo}</b>
          <p>{M.correoTexto}</p>
          <p className="me__spam">
            <Icon name="info" size={20} strokeWidth={2} />
            {M.spam}
          </p>
        </div>
      </div>

      {/* el boton lleva al webmail del proveedor del correo con el que se registro */}
      <a className="btn btn--primario btn--grande me__boton" href={webmailDe(correo)} target="_blank" rel="noreferrer">
        <Icon name="mail" size={20} strokeWidth={2} />
        <span>{M.boton}</span>
      </a>
    </Modal>
  );
}

/* ---------- Contacto ---------- */

export function ModalContacto({ onClose }: { onClose: () => void }) {
  const M = MODAL_CONTACTO;
  const [mensaje, setMensaje] = useState('');
  const [motivo, setMotivo] = useState('');
  const [estado, setEstado] = useState<'listo' | 'enviando' | 'enviado' | 'error'>('listo');
  const [error, setError] = useState('');

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEstado('enviando');
    setError('');
    const datos: Record<string, string> = {};
    new FormData(e.currentTarget).forEach((v, k) => {
      if (typeof v === 'string') datos[k] = v.trim();
    });
    datos.motivo = motivo;
    const r = await enviarContacto(datos);
    if (r.ok) {
      setEstado('enviado');
    } else {
      setEstado('error');
      setError(r.error ?? '');
    }
  };

  return (
    <Modal titulo={M.titulo} onClose={onClose} ancho="1000px" className="modal--contacto">
      <div className="mc__cabeza">
        <img className="mc__logo" src="/brand/logo.webp" alt={SITIO.nombre} width={1200} height={447} />
        <img className="mc__edificio" src="/img/edificio.webp" alt="Sede de HDCO Health" width={952} height={462} />
      </div>

      <div className="mc__dos">
        <div className="mc__formulario">
          <h2>{M.titulo}</h2>
          <p className="mc__sub">
            {M.subtitulo[0]}
            <br />
            {M.subtitulo[1]}
          </p>
          <p className="mc__texto">{M.texto}</p>

          {estado === 'enviado' ? (
            <div className="mc__gracias">
              <span>
                <Icon name="check-circle" size={34} strokeWidth={1.8} />
              </span>
              <b>{M.gracias}</b>
              <p>{M.graciasTexto}</p>
              <Boton variante="oscuro" onClick={onClose}>
                {M.cerrar}
              </Boton>
            </div>
          ) : (
            <form onSubmit={enviar}>
              <input className="trampa" type="text" name="web" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label className="campo">
                <span className="campo__etiqueta">
                  Nombre completo<em aria-hidden="true">*</em>
                </span>
                <span className="con-icono">
                  <Icon name="user-round" size={18} strokeWidth={1.8} />
                  <input name="nombre" type="text" required placeholder="Ej. Juan Carlos Pérez Gómez" autoComplete="name" />
                </span>
              </label>
              <label className="campo">
                <span className="campo__etiqueta">
                  Ocupación / Profesión<em aria-hidden="true">*</em>
                </span>
                <span className="con-icono seleccion">
                  <Icon name="briefcase" size={18} strokeWidth={1.8} />
                  <select name="ocupacion" required defaultValue="">
                    <option value="" disabled>
                      Selecciona tu ocupación / profesión
                    </option>
                    {OCUPACIONES.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" size={16} strokeWidth={2.2} className="seleccion__flecha" />
                </span>
              </label>
              <label className="campo">
                <span className="campo__etiqueta">
                  Correo electrónico<em aria-hidden="true">*</em>
                </span>
                <span className="con-icono">
                  <Icon name="mail" size={18} strokeWidth={1.8} />
                  <input name="correo" type="email" required placeholder="Ej. juan.perez@correo.com" autoComplete="email" />
                </span>
              </label>
              <label className="campo">
                <span className="campo__etiqueta">Teléfono</span>
                <span className="con-icono">
                  <Icon name="phone" size={18} strokeWidth={1.8} />
                  <input name="telefono" type="tel" placeholder="Ej. 809 123 4567" autoComplete="tel" />
                </span>
              </label>
              <label className="campo">
                <span className="campo__etiqueta">
                  Mensaje<em aria-hidden="true">*</em>
                </span>
                <span className="con-icono area">
                  <Icon name="message" size={18} strokeWidth={1.8} />
                  <textarea name="mensaje" required rows={5} maxLength={1000} value={mensaje} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe aquí tu mensaje…" />
                  <small>{mensaje.length}/1000</small>
                </span>
              </label>

              {estado === 'error' && (
                <p className="reg__error" role="alert">
                  <Icon name="alert" size={18} strokeWidth={2} />
                  {error}
                </p>
              )}

              <Boton tipo="submit" icono="send" className="btn--grande mc__enviar" cargando={estado === 'enviando'}>
                {M.enviar}
              </Boton>
            </form>
          )}
        </div>

        <aside className="mc__lateral">
          <div className="mc__empresa">
            <img src="/img/hdco-health.webp" alt="HDCO Health" width={1112} height={476} />
            <div className="mc__empresa-datos">
              <div>
                <b>{M.empresa}</b>
                <span className="mc__empresa-lema">{M.empresaLema}</span>
                <p>
                  <Icon name="map-pin" size={17} strokeWidth={2} />
                  <span>
                    {M.direccion.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </span>
                </p>
                <p>
                  <Icon name="phone" size={17} strokeWidth={2} />
                  <a href={`tel:${M.telefonoEnlace}`}>{M.telefono}</a>
                </p>
                <p>
                  <Icon name="clock" size={17} strokeWidth={2} />
                  <span>
                    {M.horario.map((h) => (
                      <span key={h}>{h}</span>
                    ))}
                  </span>
                </p>
              </div>
              <span className="mc__mapa" aria-hidden="true">
                <img src="/img/mapa-contacto.webp" alt="" width={1000} height={667} />
              </span>
            </div>
          </div>

          <div className="mc__motivos">
            <b>{M.motivoTitulo}</b>
            <span>{M.motivoTexto}</span>
            <ul role="group" aria-label="Motivo de la consulta">
              {M.motivos.map((m) => (
                <li key={m.label}>
                  <button type="button" className={`mc__motivo${motivo === m.label ? ' is-activo' : ''}`} aria-pressed={motivo === m.label} onClick={() => setMotivo(motivo === m.label ? '' : m.label)}>
                    <Icon name={m.icon} size={30} strokeWidth={1.5} />
                    <span>
                      {m.label}
                      {m.nota && <small>{m.nota}</small>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <footer className="mc__pie">
        <p className="reg__privacidad">
          <Icon name="lock" size={22} strokeWidth={1.8} />
          {M.privacidad}
        </p>
        <button type="button" className="btn btn--borde" onClick={onClose}>
          <span>{M.cerrar}</span>
        </button>
      </footer>
    </Modal>
  );
}
