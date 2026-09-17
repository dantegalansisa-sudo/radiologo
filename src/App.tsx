import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AvisoDemo, BarraSuperior, Cabecera, Cifras, Hero, Pie, Proceso, RedProyecto } from './components/Secciones';
import { ModalDemo, ModalProyecto, ModalRed } from './components/ModalesInfo';
import ModalRegistro from './components/ModalRegistro';
import { ModalContacto, ModalExito } from './components/ModalesContacto';

/*
  Radiologo Nacional: una sola pagina y sus modales.

  Cada boton de la pagina dispara una "accion": abrir un modal o volver al
  inicio. Las secciones que solo existen en la plataforma completa
  (convocatorias, preguntas frecuentes, iniciar sesion, legales) abren un
  aviso de demostracion.
*/

export type Accion =
  | 'inicio'
  | 'proyecto'
  | 'registro'
  | 'red'
  | 'contacto'
  | 'convocatorias'
  | 'faq'
  | 'sesion'
  | 'terminos'
  | 'privacidad';

type ModalAbierto = { tipo: Exclude<Accion, 'inicio'> } | { tipo: 'exito'; correo: string } | null;

export default function App() {
  const [modal, setModal] = useState<ModalAbierto>(null);

  const abrir = useCallback((accion: Accion) => {
    if (accion === 'inicio') {
      setModal(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setModal({ tipo: accion });
  }, []);

  const cerrar = useCallback(() => setModal(null), []);

  return (
    <>
      <BarraSuperior abrir={abrir} />
      <Cabecera abrir={abrir} />
      <AvisoDemo abrir={abrir} />

      <main id="contenido">
        <Hero abrir={abrir} />
        <Cifras />
        <Proceso />
        <RedProyecto abrir={abrir} />
      </main>

      <Pie abrir={abrir} />

      <AnimatePresence>
        {modal?.tipo === 'proyecto' && <ModalProyecto key="proyecto" onClose={cerrar} />}
        {modal?.tipo === 'red' && <ModalRed key="red" onClose={cerrar} />}
        {modal?.tipo === 'registro' && <ModalRegistro key="registro" onClose={cerrar} onExito={(correo) => setModal({ tipo: 'exito', correo })} />}
        {modal?.tipo === 'exito' && <ModalExito key="exito" correo={modal.correo} onClose={cerrar} />}
        {modal?.tipo === 'contacto' && <ModalContacto key="contacto" onClose={cerrar} />}
        {(modal?.tipo === 'convocatorias' || modal?.tipo === 'faq' || modal?.tipo === 'sesion' || modal?.tipo === 'terminos' || modal?.tipo === 'privacidad') && (
          <ModalDemo key={modal.tipo} clave={modal.tipo} onClose={cerrar} abrir={abrir} />
        )}
      </AnimatePresence>
    </>
  );
}
