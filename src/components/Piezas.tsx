import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import Icon, { type IconName } from './Icon';
import { EASINGS } from '../utils/easings';

/* ============================================================
   Piezas pequenas que se repiten por toda la pagina
   ============================================================ */

/** Icono del sistema, o la silueta del mapa del pais cuando toca. */
export function Icono({ name, size = 22, strokeWidth = 1.7, className }: { name: IconName | 'mapa'; size?: number; strokeWidth?: number; className?: string }) {
  if (name === 'mapa') {
    return <img src="/img/mapa-silueta.png" alt="" aria-hidden="true" width={size} height={size} className={`icono-mapa ${className ?? ''}`.trim()} style={{ width: size * 1.35, height: 'auto' }} />;
  }
  return <Icon name={name} size={size} strokeWidth={strokeWidth} className={className} />;
}

/** Bandera dominicana, simplificada: cuatro cuarteles y la cruz blanca. */
export function Bandera({ alto = 14 }: { alto?: number }) {
  const ancho = Math.round(alto * 1.6);
  return (
    <svg className="bandera" width={ancho} height={alto} viewBox="0 0 32 20" aria-label="Bandera de la República Dominicana" role="img">
      <rect width="14" height="8.5" fill="#002d62" />
      <rect x="18" width="14" height="8.5" fill="#ce1126" />
      <rect y="11.5" width="14" height="8.5" fill="#ce1126" />
      <rect x="18" y="11.5" width="14" height="8.5" fill="#002d62" />
      <rect x="14" width="4" height="20" fill="#fff" />
      <rect y="8.5" width="32" height="3" fill="#fff" />
      <circle cx="16" cy="10" r="1.6" fill="#0a7f3f" />
    </svg>
  );
}

/** Aparece al entrar en pantalla. */
export function Reveal({ children, className, y = 22, delay = 0, tag = 'div' }: { children: ReactNode; className?: string; y?: number; delay?: number; tag?: 'div' | 'section' | 'li' | 'p' }) {
  const Tag = motion[tag];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASINGS.premium }}
    >
      {children}
    </Tag>
  );
}

/** Cuenta desde cero hasta el valor cuando la cifra entra en pantalla. */
export function Contador({ valor, prefijo = '' }: { valor: number; prefijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, margin: '-40px' });
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActual(valor);
      return;
    }
    const inicio = performance.now();
    const duracion = 1400;
    let raf = 0;
    const paso = (ahora: number) => {
      const t = Math.min(1, (ahora - inicio) / duracion);
      const suave = 1 - Math.pow(1 - t, 3);
      setActual(Math.round(valor * suave));
      if (t < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [visible, valor]);

  return (
    <span ref={ref}>
      {prefijo}
      {actual.toLocaleString('en-US')}
    </span>
  );
}

/** Boton azul principal con flecha. */
export function Boton({
  children,
  onClick,
  icono,
  variante = 'primario',
  tipo = 'button',
  className = '',
  cargando,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  icono?: IconName;
  variante?: 'primario' | 'oscuro' | 'blanco' | 'borde';
  tipo?: 'button' | 'submit';
  className?: string;
  cargando?: boolean;
  disabled?: boolean;
}) {
  return (
    <button type={tipo} className={`btn btn--${variante} ${className}`.trim()} onClick={onClick} disabled={disabled || cargando}>
      {cargando ? <span className="btn__girando" aria-hidden="true" /> : icono && <Icon name={icono} size={18} strokeWidth={2} />}
      <span>{children}</span>
      <Icon name="chevron-right" size={16} strokeWidth={2.4} className="btn__flecha" />
    </button>
  );
}

/** Frase manuscrita, como en el diseno. */
export function Manuscrita({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`manuscrita ${className}`.trim()}>{children}</span>;
}
