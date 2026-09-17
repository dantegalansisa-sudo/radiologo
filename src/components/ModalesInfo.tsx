import Icon from './Icon';
import Modal from './Modal';
import { Boton, Icono, Manuscrita } from './Piezas';
import { MODAL_DEMO, MODAL_PROYECTO, MODAL_RED, NOTA_DEMO, SITIO } from '../data/textos';
import type { Accion } from '../App';

/* ============================================================
   Modales informativos: sobre el proyecto, la red y las secciones
   que solo existen en la plataforma completa
   ============================================================ */

/* ---------- Sobre este proyecto ---------- */

export function ModalProyecto({ onClose }: { onClose: () => void }) {
  const M = MODAL_PROYECTO;
  return (
    <Modal titulo={M.titulo} onClose={onClose} ancho="1000px" className="modal--proyecto">
      <div className="mp__cabeza">
        <div className="mp__texto">
          <span className="eyebrow">{M.eyebrow}</span>
          <h2>{M.titulo}</h2>
          <p className="mp__sub">{M.subtitulo}</p>
          <p>{M.texto}</p>
        </div>
        <div className="mp__foto" aria-hidden="true">
          <img src="/img/proyecto.webp" alt="" width={1600} height={560} />
          <Manuscrita className="mp__frase">{M.frase}</Manuscrita>
        </div>
      </div>

      <ul className="mp__pilares">
        {M.pilares.map((p) => (
          <li key={p.titulo}>
            <Icono name={p.icon} size={34} strokeWidth={1.5} />
            <b>{p.titulo}</b>
            <span>{p.texto}</span>
          </li>
        ))}
      </ul>

      <div className="mp__iniciativa">
        <div>
          <span className="eyebrow">{M.iniciativaEyebrow}</span>
          <h3>{M.iniciativaTitulo}</h3>
          <p>{M.iniciativaTexto}</p>
        </div>
        <div className="mp__alianza" aria-hidden="true">
          <img src="/img/linkdicom.webp" alt="LINKDICOM" width={1000} height={156} />
          <span className="mp__mas">+</span>
          <span className="mp__hdco">
            <Icon name="users" size={40} strokeWidth={1.4} />
            <i className="mp__tricolor" />
            <span>{M.alianza}</span>
          </span>
        </div>
      </div>

      <div className="mp__pie">
        <p className="nota-demo">
          <Icon name="info" size={22} strokeWidth={1.8} />
          <span>{M.aviso}</span>
        </p>
        <Boton variante="oscuro" onClick={onClose}>
          {M.cerrar}
        </Boton>
      </div>
    </Modal>
  );
}

/* ---------- Conoce la red ---------- */

export function ModalRed({ onClose }: { onClose: () => void }) {
  const M = MODAL_RED;
  return (
    <Modal titulo={M.titulo} onClose={onClose} ancho="1100px" className="modal--red">
      <div className="mr__cabeza">
        <img className="mr__logo" src="/brand/logo.webp" alt={SITIO.nombre} width={1200} height={447} />
        <Manuscrita className="mr__lema">{SITIO.lema}</Manuscrita>
        <ul className="mr__frases" aria-hidden="true">
          {M.frasesLado.map((f) => (
            <li key={f}>{f}</li>
          ))}
          <li className="mr__tricolor" />
        </ul>
      </div>

      <div className="mr__intro">
        <div>
          <h2>{M.titulo}</h2>
          <p className="mr__sub">{M.subtitulo}</p>
          <p>{M.texto}</p>
        </div>
        <div className="mr__mapa">
          <span className="mr__punto mr__punto--n">Norte</span>
          <span className="mr__punto mr__punto--s">Sur</span>
          <span className="mr__punto mr__punto--e">Este</span>
          <span className="mr__punto mr__punto--o">Oeste</span>
          <img src="/img/mapa-red.webp" alt="Mapa de la red nacional" width={1400} height={933} />
          <ul className="mr__leyenda">
            {M.leyenda.map((l) => (
              <li key={l.label}>
                <Icon name={l.icon} size={16} strokeWidth={2} />
                {l.label}
              </li>
            ))}
          </ul>
          <Manuscrita className="mr__frase">{M.frase}</Manuscrita>
        </div>
      </div>

      <div className="mr__cifras">
        <ul>
          {M.cifras.map((c) => (
            <li key={c.label}>
              <Icon name={c.icon} size={32} strokeWidth={1.5} />
              <b>{c.valor}</b>
              <span>{c.label}</span>
            </li>
          ))}
        </ul>
        <div className="mr__repositorio">
          <Icon name="database" size={40} strokeWidth={1.4} />
          <span>
            <b>{M.repositorioTitulo}</b>
            {M.repositorioTexto}
          </span>
        </div>
      </div>

      <h3 className="mr__titulo">{M.beneficiosTitulo}</h3>
      <ul className="mr__beneficios">
        {M.beneficios.map((b) => (
          <li key={b.titulo}>
            <Icon name={b.icon} size={34} strokeWidth={1.5} />
            <span>
              <b>{b.titulo}</b>
              {b.texto}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mr__titulo">{M.funcionaTitulo}</h3>
      <ol className="mr__pasos">
        {M.pasos.map((p, i) => (
          <li key={p.titulo}>
            <span className="mr__numero">{i + 1}</span>
            <span className="mr__icono">
              <Icon name={p.icon} size={30} strokeWidth={1.5} />
            </span>
            <b>{p.titulo}</b>
            <span>{p.texto}</span>
            {i < M.pasos.length - 1 && <Icon name="chevron-right" size={18} strokeWidth={2} className="mr__flecha" />}
          </li>
        ))}
      </ol>

      <div className="mr__esfuerzo">
        <Icon name="handshake" size={44} strokeWidth={1.4} />
        <div>
          <b>{M.esfuerzoTitulo}</b>
          <p>{M.esfuerzoTexto}</p>
        </div>
        <span className="mr__sello">
          <img src="/img/linkdicom.webp" alt="LINKDICOM" width={1000} height={156} />
          <i>{M.esfuerzoSello}</i>
        </span>
      </div>

      <div className="mr__pie">
        <Boton variante="oscuro" onClick={onClose}>
          {M.cerrar}
        </Boton>
      </div>
    </Modal>
  );
}

/* ---------- Secciones de la plataforma completa ---------- */

export function ModalDemo({ clave, onClose, abrir }: { clave: keyof typeof MODAL_DEMO; onClose: () => void; abrir: (a: Accion) => void }) {
  const M = MODAL_DEMO[clave];
  return (
    <Modal titulo={M.titulo} onClose={onClose} ancho="560px" className="modal--demo">
      <span className="md__icono">
        <Icon name={M.icon} size={32} strokeWidth={1.5} />
      </span>
      <h2>{M.titulo}</h2>
      <p>{M.texto}</p>
      <p className="nota-demo nota-demo--compacta">
        <Icon name="info" size={18} strokeWidth={2} />
        <span>{NOTA_DEMO}</span>
      </p>
      <div className="md__acciones">
        {clave === 'sesion' || clave === 'convocatorias' ? (
          <Boton icono="user-round" onClick={() => abrir('registro')}>
            Regístrate gratis
          </Boton>
        ) : (
          <Boton onClick={() => abrir('contacto')}>Escríbenos</Boton>
        )}
        <button type="button" className="enlace-simple" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
