import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { Bandera, Boton, Contador, Icono, Manuscrita, Reveal } from './Piezas';
import { AVISO_DEMO, BARRA_SUPERIOR, CIFRAS, HERO, MENU, PIE, PROCESO, PROYECTO, RED, SITIO } from '../data/textos';
import { EASINGS } from '../utils/easings';
import type { Accion } from '../App';

/* ============================================================
   Secciones de la pagina, de arriba abajo
   ============================================================ */

type Props = { abrir: (accion: Accion) => void };

/* ---------- Barra superior (estilo institucional) ---------- */

const TAMANOS = [
  { clave: 'pequeno', label: 'A', titulo: 'Texto más pequeño', px: 15 },
  { clave: 'normal', label: 'A', titulo: 'Texto normal', px: 16 },
  { clave: 'grande', label: 'A', titulo: 'Texto más grande', px: 18 },
] as const;

export function BarraSuperior({ abrir }: Props) {
  const [tamano, setTamano] = useState<(typeof TAMANOS)[number]['clave']>('normal');

  // accesibilidad: el tamano del texto se aplica a toda la pagina
  useEffect(() => {
    const t = TAMANOS.find((x) => x.clave === tamano)!;
    document.documentElement.style.fontSize = `${t.px}px`;
  }, [tamano]);

  return (
    <div className="barra">
      <div className="contenedor barra__inner">
        <span className="barra__pais">
          <Bandera alto={13} />
          {BARRA_SUPERIOR.pais}
        </span>
        <ul className="barra__palabras" aria-hidden="true">
          {BARRA_SUPERIOR.palabras.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <span className="barra__hueco" />
        <div className="barra__acceso" role="group" aria-label="Tamaño del texto">
          <span>{BARRA_SUPERIOR.accesibilidad}</span>
          {TAMANOS.map((t, i) => (
            <button
              key={t.clave}
              type="button"
              className={`barra__a barra__a--${i}${tamano === t.clave ? ' is-activo' : ''}`}
              title={t.titulo}
              aria-pressed={tamano === t.clave}
              onClick={() => setTamano(t.clave)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="barra__sep" aria-hidden="true" />
        <button type="button" className="barra__sesion" onClick={() => abrir('sesion')}>
          <Icon name="user-round" size={16} strokeWidth={2} />
          {BARRA_SUPERIOR.sesion}
        </button>
      </div>
    </div>
  );
}

/* ---------- Cabecera con el logotipo y el menu ---------- */

export function Cabecera({ abrir }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState<string>('inicio');

  const ir = (accion: Accion) => {
    setAbierto(false);
    setActivo(accion);
    abrir(accion);
  };

  return (
    <header className="cabecera">
      <div className="contenedor cabecera__inner">
        <a className="cabecera__marca" href="#inicio" onClick={(e) => { e.preventDefault(); ir('inicio'); }} aria-label={`${SITIO.nombre} — inicio`}>
          <img src="/brand/logo.webp" alt={SITIO.nombre} width={1200} height={447} />
        </a>

        <nav className={`menu${abierto ? ' is-abierto' : ''}`} aria-label="Principal">
          {MENU.map((m) => (
            <button key={m.accion} type="button" className={`menu__enlace${activo === m.accion ? ' is-activo' : ''}`} onClick={() => ir(m.accion)}>
              {m.label}
            </button>
          ))}
          <button type="button" className="menu__enlace menu__enlace--sesion" onClick={() => ir('sesion')}>
            <Icon name="user-round" size={16} strokeWidth={2} />
            {BARRA_SUPERIOR.sesion}
          </button>
        </nav>

        <button type="button" className="cabecera__menu" onClick={() => setAbierto((a) => !a)} aria-expanded={abierto} aria-label="Menú">
          <Icon name={abierto ? 'close' : 'menu'} size={24} strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}

/* ---------- Aviso amarillo: pagina de demostracion ---------- */

export function AvisoDemo({ abrir }: Props) {
  return (
    <div className="aviso">
      <div className="contenedor aviso__inner">
        <Icon name="megaphone" size={26} strokeWidth={1.8} className="aviso__icono" />
        <p>
          {AVISO_DEMO.texto} <b>{AVISO_DEMO.destacado}</b> {AVISO_DEMO.resto}
        </p>
        <button type="button" className="aviso__boton" onClick={() => abrir('proyecto')}>
          {AVISO_DEMO.boton}
          <Icon name="chevron-right" size={16} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

/* ---------- Portada ---------- */

export function Hero({ abrir }: Props) {
  const bajar = () => document.getElementById('proceso')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <section className="hero" id="inicio">
      <div className="hero__media" aria-hidden="true">
        <motion.img
          src="/img/hero.webp"
          alt=""
          width={1800}
          height={850}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASINGS.premium }}
        />
        <span className="hero__velo" />
      </div>

      <div className="contenedor hero__inner">
        <div className="hero__texto">
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASINGS.premium }}>
            {HERO.eyebrow}
          </motion.span>
          <h1>
            {HERO.titulo.map((linea, i) => (
              <motion.span
                key={linea}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1 + i * 0.1, ease: EASINGS.premium }}
              >
                {linea}
              </motion.span>
            ))}
          </h1>
          <motion.p className="hero__parrafo" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease: EASINGS.premium }}>
            {HERO.texto}
          </motion.p>
          <motion.div className="hero__acciones" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease: EASINGS.premium }}>
            <Boton icono="user-round" onClick={() => abrir('registro')} className="btn--grande">
              {HERO.registro}
            </Boton>
            <button type="button" className="enlace-flecha" onClick={bajar}>
              {HERO.conoce}
              <Icon name="chevron-down" size={16} strokeWidth={2.4} />
            </button>
          </motion.div>
          <motion.ul className="hero__confianza" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease: EASINGS.premium }}>
            {HERO.confianza.map((c) => (
              <li key={c.label.join()}>
                <Icon name={c.icon} size={26} strokeWidth={1.6} />
                <span>
                  {c.label[0]}
                  <br />
                  {c.label[1]}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="hero__lado" aria-hidden="true">
          <Manuscrita className="hero__manuscrita">{SITIO.lema}</Manuscrita>
          <ul className="hero__frases">
            {HERO.frases.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Cifras ---------- */

export function Cifras() {
  return (
    <section className="cifras" aria-label="Cifras del sistema">
      <div className="contenedor">
        <ul className="cifras__lista">
          {CIFRAS.map((c, i) => (
            <Reveal tag="li" key={c.label} delay={i * 0.08}>
              <Icono name={c.icon} size={34} strokeWidth={1.5} />
              <b>
                <Contador valor={c.valor} prefijo={c.prefijo} />
              </b>
              <span>{c.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Como funciona ---------- */

export function Proceso() {
  return (
    <section className="proceso" id="proceso">
      <div className="contenedor">
        <Reveal className="proceso__cabeza">
          <div>
            <span className="eyebrow">{PROCESO.eyebrow}</span>
            <h2>{PROCESO.titulo}</h2>
          </div>
          <p>{PROCESO.texto}</p>
        </Reveal>
        <ol className="pasos">
          {PROCESO.pasos.map((p, i) => (
            <Reveal tag="li" key={p.titulo} delay={i * 0.1} className="paso">
              <span className="paso__numero">{i + 1}</span>
              <span className="paso__icono">
                <Icon name={p.icon} size={30} strokeWidth={1.5} />
              </span>
              <b>{p.titulo}</b>
              <span className="paso__texto">{p.texto}</span>
              {i < PROCESO.pasos.length - 1 && <Icon name="chevron-right" size={18} strokeWidth={2} className="paso__flecha" />}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- La red + sobre el proyecto ---------- */

export function RedProyecto({ abrir }: Props) {
  return (
    <section className="red-proyecto" id="red">
      <Reveal className="red">
        <div className="red__texto">
          <span className="eyebrow eyebrow--claro">{RED.eyebrow}</span>
          <h2>
            {RED.titulo.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </h2>
          <p>{RED.texto}</p>
          <Boton variante="blanco" onClick={() => abrir('red')}>
            {RED.boton}
          </Boton>
        </div>
        <div className="red__mapa" aria-hidden="true">
          <img src="/img/mapa-red.webp" alt="" width={1400} height={933} loading="lazy" />
          <ul className="red__frases">
            {RED.frases.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className="proyecto" delay={0.1}>
        <span className="eyebrow">{PROYECTO.eyebrow}</span>
        <h2>{PROYECTO.titulo}</h2>
        <p>{PROYECTO.texto}</p>
        <div className="proyecto__pie">
          <img className="proyecto__linkdicom" src="/img/linkdicom.webp" alt="LINKDICOM — Conecta y avanza" width={1000} height={156} loading="lazy" />
          <span className="proyecto__sello">
            <img src="/img/manos.webp" alt="" width={600} height={600} loading="lazy" />
            <span>
              {PROYECTO.sello.map((s) => (
                <i key={s}>{s}</i>
              ))}
            </span>
          </span>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Pie de pagina ---------- */

export function Pie({ abrir }: Props) {
  const redes: { icon: 'facebook' | 'instagram' | 'youtube' | 'linkedin'; label: string }[] = [
    { icon: 'facebook', label: 'Facebook' },
    { icon: 'instagram', label: 'Instagram' },
    { icon: 'youtube', label: 'YouTube' },
    { icon: 'linkedin', label: 'LinkedIn' },
  ];
  return (
    <footer className="pie">
      <div className="contenedor pie__inner">
        <div className="pie__marca">
          <img src="/brand/logo-blanco.webp" alt={SITIO.nombre} width={1200} height={447} loading="lazy" />
          <span className="pie__sep" aria-hidden="true" />
          <span className="pie__lema">
            <b>{PIE.pais}</b>
            {PIE.lema}
          </span>
        </div>
        <ul className="pie__enlaces">
          {PIE.enlaces.map((e) => (
            <li key={e.accion}>
              <button type="button" onClick={() => abrir(e.accion)}>
                {e.label}
              </button>
            </li>
          ))}
        </ul>
        <ul className="pie__redes" aria-label="Redes sociales">
          {redes.map((r) => (
            <li key={r.icon}>
              <button type="button" aria-label={r.label} title={`${r.label} (disponible en la plataforma completa)`} onClick={() => abrir('faq')}>
                <Icon name={r.icon} size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="contenedor pie__legal">
        <p>
          {PIE.copyright}
          <br />
          {PIE.desarrollado}
        </p>
        <span className="pie__pais">
          {PIE.pais}
          <Bandera alto={12} />
        </span>
      </div>
    </footer>
  );
}
