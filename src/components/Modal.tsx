import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon';
import { EASINGS } from '../utils/easings';

/**
 * Carcasa de los modales: velo, caja centrada con scroll propio, cierre con
 * Escape, con la aspa o pulsando fuera. Bloquea el scroll de la pagina y
 * mantiene el foco dentro.
 */
export default function Modal({
  titulo,
  onClose,
  ancho = '1040px',
  className = '',
  children,
}: {
  titulo: string;
  onClose: () => void;
  ancho?: string;
  className?: string;
  children: ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const antes = document.activeElement as HTMLElement | null;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    caja.current?.focus();

    const teclas = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !caja.current) return;
      const focos = caja.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!focos.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    window.addEventListener('keydown', teclas);
    return () => {
      window.removeEventListener('keydown', teclas);
      document.body.style.overflow = previo;
      antes?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        ref={caja}
        className={`modal__caja ${className}`.trim()}
        style={{ maxWidth: ancho }}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.2 } }}
        transition={{ duration: 0.45, ease: EASINGS.premium }}
      >
        <button type="button" className="modal__cerrar" onClick={onClose} aria-label="Cerrar">
          <Icon name="close" size={22} strokeWidth={2} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
