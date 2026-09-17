import type { IconName } from '../components/Icon';

/*
  Todos los textos de la pagina, tal como estan en el diseno del cliente.
  Si hay que cambiar una frase, se cambia aqui.
*/

export const SITIO = {
  nombre: 'Radiologo Nacional',
  dominio: 'radiologonacional.com',
  lema: 'Imágenes que salvan vidas',
  correoNoReply: 'noreply@radiologonacional.com',
};

export const BARRA_SUPERIOR = {
  pais: 'República Dominicana',
  palabras: ['Salud', 'Talento', 'Oportunidades'],
  accesibilidad: 'Accesibilidad',
  sesion: 'Iniciar sesión',
};

export const MENU = [
  { label: 'Inicio', accion: 'inicio' },
  { label: 'Sobre el sistema', accion: 'proyecto' },
  { label: 'Convocatorias', accion: 'convocatorias' },
  { label: 'Preguntas frecuentes', accion: 'faq' },
  { label: 'Contacto', accion: 'contacto' },
] as const;

export const AVISO_DEMO = {
  texto: 'Esta es una página de demostración',
  destacado: 'funcional de LINKDICOM',
  resto: 'para presentación del proyecto.',
  boton: 'Saber más de este proyecto',
};

export const HERO = {
  eyebrow: 'Registro Nacional de Radiólogos',
  titulo: ['Tu talento', 'al servicio de una', 'mejor salud para todos'],
  texto:
    'Plataforma oficial para el registro de médicos radiólogos en la República Dominicana. Participa en convocatorias para plazas en hospitales y centros de salud del país.',
  registro: 'Regístrate gratis',
  conoce: 'Conoce más',
  confianza: [
    { icon: 'shield' as IconName, label: ['Seguro', 'y confiable'] },
    { icon: 'users' as IconName, label: ['Oportunidades', 'en todo el país'] },
    { icon: 'file-text' as IconName, label: ['Transparencia', 'en los procesos'] },
  ],
  frases: ['Más salud', 'Más oportunidades', 'Un mejor país'],
};

export const CIFRAS = [
  { icon: 'users' as IconName, valor: 2500, prefijo: '+ ', label: 'Médicos registrados' },
  { icon: 'hospital' as IconName, valor: 120, prefijo: '+ ', label: 'Hospitales y centros de salud' },
  { icon: 'file-text' as IconName, valor: 35, prefijo: '+ ', label: 'Convocatorias publicadas' },
  { icon: 'mapa' as const, valor: 32, prefijo: '', label: 'Provincias' },
];

export const PROCESO = {
  eyebrow: '¿Cómo funciona?',
  titulo: 'Un proceso simple y transparente',
  texto: 'Regístrate y mantén tu información actualizada para participar en las convocatorias.',
  pasos: [
    { icon: 'file-text' as IconName, titulo: 'Regístrate', texto: 'Crea tu cuenta gratis en pocos minutos.' },
    { icon: 'user-round' as IconName, titulo: 'Completa tu perfil', texto: 'Incluye tu formación, experiencia y documentos.' },
    { icon: 'bell' as IconName, titulo: 'Participa en convocatorias', texto: 'Recibe notificaciones de nuevas oportunidades.' },
    { icon: 'check-circle' as IconName, titulo: 'Contribuye al país', texto: 'Lleva tu talento a donde más se necesita.' },
  ],
};

export const RED = {
  eyebrow: 'Una red que nos une',
  titulo: ['Una Red Hospitalaria', 'diseñada para', 'salvar vidas!'],
  texto:
    'Hospitales y centros de salud interconectados para ofrecer una atención más oportuna, eficiente y de calidad en toda la República Dominicana.',
  boton: 'Conoce la red',
  frases: ['Más conexión', 'Más diagnóstico', 'Más vida'],
};

export const PROYECTO = {
  eyebrow: 'Sobre este proyecto',
  titulo: 'Un Proyecto auspiciado por tecnología de empresas Dominicanas, lo nuestro al servicio de nuestra nación.',
  texto:
    'Radiologo Nacional es una iniciativa que cuenta con el respaldo tecnológico de LINKDICOM y HDCO, empresas dominicanas especializadas en soluciones de salud, que impulsan este proyecto aportando su experiencia, innovación y compromiso con el desarrollo del sistema de salud del país.',
  sello: ['Tecnología', 'dominicana', 'al servicio', 'de la salud'],
};

export const PIE = {
  pais: 'República Dominicana',
  lema: 'Más salud para todos',
  enlaces: [
    { label: 'Términos de uso', accion: 'terminos' },
    { label: 'Políticas de privacidad', accion: 'privacidad' },
    { label: 'Preguntas frecuentes', accion: 'faq' },
    { label: 'Contacto', accion: 'contacto' },
  ] as const,
  copyright: `© ${new Date().getFullYear()} Radiologo Nacional. Todos los derechos reservados.`,
  desarrollado: 'Desarrollado con tecnología dominicana por LINKDICOM.',
};

/* ---------------- Modal: sobre este proyecto ---------------- */

export const MODAL_PROYECTO = {
  eyebrow: 'Sobre este proyecto',
  titulo: 'Radiologo Nacional',
  subtitulo: 'Tecnología dominicana al servicio de una salud más conectada y equitativa.',
  texto:
    'Radiologo Nacional es una iniciativa que busca interconectar hospitales, centros diagnósticos y UNAP en todo el país, mediante una red nacional que permite el intercambio seguro de imágenes médicas e informes, y la gestión del talento de médicos radiólogos, contribuyendo a una atención más oportuna, eficiente y de mayor calidad para todos los dominicanos.',
  frase: 'Un país más conectado por la salud',
  pilares: [
    { icon: 'hospital' as IconName, titulo: 'Red nacional de salud', texto: 'Interconecta hospitales, centros diagnósticos y UNAP en todo el país.' },
    { icon: 'image' as IconName, titulo: 'Intercambio seguro de imágenes', texto: 'Acceso a estudios e informes desde cualquier centro autorizado.' },
    { icon: 'users' as IconName, titulo: 'Talento dominicano', texto: 'Base de datos de médicos radiólogos calificados, listos para aportar en todo el país.' },
    { icon: 'chart' as IconName, titulo: 'Mayor eficiencia', texto: 'Optimiza tiempos de lectura y entrega de resultados.' },
    { icon: 'mapa' as const, titulo: 'Más acceso, más equidad', texto: 'Llevamos diagnósticos de calidad a cada región del país.' },
  ],
  iniciativaEyebrow: 'Una iniciativa tecnológica dominicana',
  iniciativaTitulo: 'Impulsado por empresas dominicanas, para el bienestar de nuestra nación.',
  iniciativaTexto:
    'Radiologo Nacional es una iniciativa que cuenta con el respaldo tecnológico de LINKDICOM y HDCO, empresas dominicanas especializadas en soluciones de salud, que impulsan este proyecto aportando su experiencia, innovación y compromiso con el desarrollo del sistema de salud del país.',
  alianza: 'Alianza por una salud más fuerte',
  aviso:
    'Esta es una versión de demostración funcional desarrollada por LINKDICOM para fines de presentación del proyecto. Las funcionalidades mostradas son una emulación aproximada del resultado final y se encuentran en desarrollo.',
  cerrar: 'Cerrar',
};

/* ---------------- Modal: conoce la red ---------------- */

export const MODAL_RED = {
  titulo: 'Conoce la Red Nacional',
  subtitulo:
    'Una red hospitalaria interconectada para un acceso más oportuno, eficiente y de calidad a los estudios de imágenes en toda la República Dominicana.',
  texto:
    'Radiologo Nacional integra hospitales, centros diagnósticos y UNAP en una única red, permitiendo el intercambio seguro de imágenes e informes y facilitando el acceso al talento de médicos radiólogos calificados en todo el país.',
  frasesLado: ['Una república', 'más conectada', 'más salud', 'un mejor país'],
  frase: 'Todo el país conectado por una mejor salud',
  leyenda: [
    { icon: 'hospital' as IconName, label: 'Hospitales' },
    { icon: 'building' as IconName, label: 'Centros diagnósticos' },
    { icon: 'home' as IconName, label: 'UNAPs' },
    { icon: 'network' as IconName, label: 'Red interconectada' },
  ],
  cifras: [
    { icon: 'hospital' as IconName, valor: '+ 120', label: 'Hospitales y centros de salud' },
    { icon: 'building' as IconName, valor: '+ 350', label: 'Centros diagnósticos y UNAPs' },
    { icon: 'map-pin' as IconName, valor: '32', label: 'Provincias conectadas' },
    { icon: 'users' as IconName, valor: '+ 2,500', label: 'Médicos radiólogos registrados' },
  ],
  repositorioTitulo: 'Repositorio centralizado de imágenes e informes',
  repositorioTexto: 'Acceso seguro y en tiempo real desde cualquier centro autorizado en la red nacional.',
  beneficiosTitulo: 'Beneficios de una red nacional',
  beneficios: [
    { icon: 'users' as IconName, titulo: 'Mayor acceso', texto: 'Más dominicanos con acceso a servicios de imagenología de calidad.' },
    { icon: 'clock' as IconName, titulo: 'Resultados más rápidos', texto: 'Optimiza los tiempos de lectura y entrega de informes.' },
    { icon: 'shield' as IconName, titulo: 'Mejor calidad', texto: 'Lecturas realizadas por médicos radiólogos calificados y evaluados.' },
    { icon: 'network' as IconName, titulo: 'Uso eficiente de recursos', texto: 'Conecta capacidades en todo el país, evitando duplicidad de equipos y esfuerzos.' },
  ],
  funcionaTitulo: 'Así funciona la red',
  pasos: [
    { icon: 'hospital' as IconName, titulo: 'El centro de salud realiza el estudio', texto: 'Las imágenes se envían de forma segura a la red nacional.' },
    { icon: 'cloud' as IconName, titulo: 'El estudio se almacena en el repositorio central', texto: 'Disponible para médicos radiólogos autorizados.' },
    { icon: 'stethoscope' as IconName, titulo: 'Un médico radiólogo realiza la lectura', texto: 'Según disponibilidad, especialidad y asignación.' },
    { icon: 'file-text' as IconName, titulo: 'El informe se entrega en el sistema', texto: 'El resultado queda disponible para el centro solicitante y el paciente.' },
  ],
  esfuerzoTitulo: 'Un esfuerzo conjunto por una mejor salud',
  esfuerzoTexto:
    'Radiologo Nacional es una iniciativa impulsada por las empresas dominicanas LINKDICOM y HDCO, que aportan su experiencia, innovación y compromiso con el desarrollo del sistema de salud del país.',
  esfuerzoSello: 'Tecnología dominicana al servicio de la salud de nuestra gente.',
  cerrar: 'Cerrar',
};

/* ---------------- Modal: registro ---------------- */

export const MODAL_REGISTRO = {
  titulo: 'Registro de Médico Radiólogo',
  subtitulo: 'Completa tu información para formar parte de la red nacional de talento radiológico de la República Dominicana.',
  pasos: ['Datos personales', 'Información profesional', 'Disponibilidad y documentos'],
  lateral: [
    { icon: 'users' as IconName, titulo: 'Participa en convocatorias nacionales', texto: 'Accede a oportunidades en hospitales y centros de salud de todo el país.' },
    { icon: 'chart' as IconName, titulo: 'Contribuye a una mejor salud', texto: 'Tu talento ayuda a llevar diagnóstico y esperanza a más dominicanos.' },
    { icon: 'shield' as IconName, titulo: 'Proceso transparente', texto: 'Asignaciones basadas en criterios objetivos y trazables.' },
    { icon: 'users' as IconName, titulo: 'Forma parte de una comunidad profesional', texto: 'Únete a una red de especialistas comprometidos con el país.' },
  ],
  privacidad: 'Tu información será tratada de forma confidencial y utilizada únicamente para los fines del proyecto.',
  cancelar: 'Cancelar',
  enviar: 'Enviar registro',
};

export const TRATAMIENTOS = ['Dr.', 'Dra.'];
export const SEXOS = ['Masculino', 'Femenino'];

export const PROVINCIAS = [
  'Azua', 'Baoruco', 'Barahona', 'Dajabón', 'Distrito Nacional', 'Duarte', 'El Seibo', 'Elías Piña', 'Espaillat',
  'Hato Mayor', 'Hermanas Mirabal', 'Independencia', 'La Altagracia', 'La Romana', 'La Vega', 'María Trinidad Sánchez',
  'Monseñor Nouel', 'Monte Cristi', 'Monte Plata', 'Pedernales', 'Peravia', 'Puerto Plata', 'Samaná', 'San Cristóbal',
  'San José de Ocoa', 'San Juan', 'San Pedro de Macorís', 'Sánchez Ramírez', 'Santiago', 'Santiago Rodríguez',
  'Santo Domingo', 'Valverde',
];

export const REGIONES = [
  'Ozama (Gran Santo Domingo)',
  'Cibao Norte (Santiago, Puerto Plata, Espaillat)',
  'Cibao Sur (La Vega, Monseñor Nouel, Sánchez Ramírez)',
  'Cibao Nordeste (Duarte, Samaná, Hermanas Mirabal, María Trinidad Sánchez)',
  'Cibao Noroeste (Valverde, Monte Cristi, Dajabón, Santiago Rodríguez)',
  'Valdesia (San Cristóbal, Peravia, San José de Ocoa)',
  'Enriquillo (Barahona, Baoruco, Independencia, Pedernales)',
  'El Valle (San Juan, Elías Piña, Azua)',
  'Yuma (La Altagracia, La Romana, El Seibo)',
  'Higuamo (San Pedro de Macorís, Hato Mayor, Monte Plata)',
  'Todo el país',
];

export const ESPECIALIDADES = [
  'Tomografía Computarizada (CT)',
  'Resonancia Magnética (RM)',
  'Rayos X (Convencional)',
  'Mamografía',
  'Sonografía (Ultrasonido)',
  'Densitometría Ósea',
  'Medicina Nuclear',
  'Radiología Intervencionista',
  'PET-CT',
  'Neurorradiología',
  'Radiología Pediátrica',
];

export const DISPONIBILIDADES = [
  'Tiempo completo',
  'Medio tiempo',
  'Por horas o guardias',
  'Fines de semana',
  'Lectura remota (teleradiología)',
  'Según convocatoria',
];

/* ---------------- Modal: registro recibido ---------------- */

export const MODAL_EXITO = {
  titulo: '¡Registro recibido!',
  subtitulo: 'Gracias por tu interés en formar parte de Radiologo Nacional.',
  texto:
    'Tu información ha sido enviada y se encuentra en proceso de registro y revisión por nuestro equipo. Nos pondremos en contacto contigo una vez completada la validación de tus datos.',
  correoTitulo: 'Recibirás un correo electrónico',
  correoTexto:
    'En los próximos minutos recibirás un mensaje de confirmación de registro con más información sobre la plataforma Radiologo Nacional, sus beneficios y próximos pasos.',
  spam: 'Si no ves el mensaje en tu bandeja de entrada, revisa tu carpeta de spam o correo no deseado.',
  boton: 'Revisar mi correo',
};

/* ---------------- Modal: contacto ---------------- */

export const MODAL_CONTACTO = {
  titulo: 'Contacto',
  subtitulo: ['Estamos para orientarte.', 'Escríbenos y nuestro equipo te responderá.'],
  texto:
    'Si tienes preguntas sobre el proyecto, necesitas más información o deseas establecer una alianza, completa el formulario y te contactaremos en el menor tiempo posible.',
  empresa: 'LINKDICOM, S.R.L.',
  empresaLema: 'Tecnología dominicana al servicio de la salud',
  direccion: ['Calle Proyecto 1, No. 12, Urb. Fernández', 'Santo Domingo Este, República Dominicana', 'Código Postal: 11903'],
  telefono: '+1 (809) 792-9763',
  telefonoEnlace: '+18097929763',
  horario: ['Lunes a sábado', '8:00 a.m. - 6:00 p.m.'],
  ciudad: 'Santo Domingo Este',
  motivoTitulo: '¿Cómo podemos ayudarte?',
  motivoTexto: 'Selecciona el motivo de tu consulta (opcional)',
  motivos: [
    { icon: 'file-text' as IconName, label: 'Información del proyecto' },
    { icon: 'headset' as IconName, label: 'Soporte tecnológico' },
    { icon: 'users' as IconName, label: 'Alianzas y colaboraciones' },
    { icon: 'message' as IconName, label: 'Otros', nota: '(Especifica en tu mensaje)' },
  ],
  privacidad: 'Tu información será tratada de forma confidencial y utilizada únicamente para atender tu solicitud.',
  enviar: 'Enviar mensaje',
  cerrar: 'Cerrar',
  gracias: '¡Mensaje enviado!',
  graciasTexto: 'Gracias por escribirnos. Nuestro equipo te responderá en el menor tiempo posible.',
};

export const OCUPACIONES = [
  'Médico radiólogo',
  'Médico de otra especialidad',
  'Técnico o tecnólogo en imágenes',
  'Director o administrador de centro de salud',
  'Funcionario o institución pública',
  'Empresa o proveedor tecnológico',
  'Estudiante',
  'Otro',
];

/* ---------------- Modal: demostracion (secciones de la plataforma) ---------------- */

export const MODAL_DEMO: Record<'convocatorias' | 'faq' | 'sesion' | 'terminos' | 'privacidad', { titulo: string; texto: string; icon: IconName }> = {
  convocatorias: {
    icon: 'bell',
    titulo: 'Convocatorias',
    texto:
      'En la plataforma completa, aquí se publican las convocatorias de plazas en hospitales y centros de salud, con sus requisitos, plazos y el estado de cada postulación. Los médicos registrados reciben una notificación por correo con cada nueva convocatoria.',
  },
  faq: {
    icon: 'help',
    titulo: 'Preguntas frecuentes',
    texto:
      'Esta sección reunirá las respuestas sobre el registro, la validación de documentos, las convocatorias y el funcionamiento de la red. Mientras tanto, cualquier duda se atiende desde el formulario de contacto.',
  },
  sesion: {
    icon: 'lock',
    titulo: 'Acceso para médicos registrados',
    texto:
      'El usuario y la contraseña se envían por correo una vez que el equipo valida los datos del registro, junto a un video instructivo para usar la plataforma. Si todavía no te has registrado, hazlo gratis en pocos minutos.',
  },
  terminos: {
    icon: 'file-text',
    titulo: 'Términos de uso',
    texto:
      'Los términos de uso de la plataforma se publicarán con la versión final del proyecto. Esta demostración es una emulación funcional desarrollada por LINKDICOM para fines de presentación.',
  },
  privacidad: {
    icon: 'shield',
    titulo: 'Políticas de privacidad',
    texto:
      'La información que se envía desde esta demostración se trata de forma confidencial y se utiliza únicamente para los fines del proyecto. La política completa se publicará con la versión final de la plataforma.',
  },
};

export const NOTA_DEMO = 'Funcionalidad de la plataforma completa. Esta demostración muestra una emulación aproximada del resultado final.';
