export const EASINGS = {
  premium: [0.76, 0, 0.24, 1],
  smooth: [0.25, 0.8, 0.25, 1],
  bounce: [0.34, 1.56, 0.64, 1],
  snappy: [0.4, 0, 0.2, 1],
  cinematic: [0.86, 0, 0.07, 1],
} as const;

/** Variants de contenedor para grids escalonados. */
export const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.095, delayChildren: 0.08 },
  },
};

/** Variants de item para cards dentro de un grid escalonado. */
export const cardVariants = {
  hidden: { opacity: 0, y: 58, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.72, ease: EASINGS.premium },
  },
};

/** Zoom de entrada para la foto dentro de una tarjeta que ya anima. */
export const mediaVariants = {
  hidden: { scale: 1.22 },
  visible: { scale: 1, transition: { duration: 1.1, ease: EASINGS.premium } },
};

/** Entrada simple hacia arriba. */
export const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASINGS.premium },
  },
};

/*
  once: true -> cada bloque entra una sola vez. Se probo repetirlo tambien al
  subir, pero al cambiar de direccion de golpe la salida y la entrada se pisan
  y produce un parpadeo. amount bajo para que arranque en cuanto el bloque asoma.
*/
export const VIEWPORT = { once: true, amount: 0.15 } as const;
