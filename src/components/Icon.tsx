import type { SVGProps } from 'react';

export type IconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'chevron-down'
  | 'search'
  | 'check'
  | 'check-circle'
  | 'shield'
  | 'code'
  | 'headset'
  | 'sparkles'
  | 'users'
  | 'building'
  | 'landmark'
  | 'heart'
  | 'cloud'
  | 'calendar'
  | 'clock'
  | 'chart'
  | 'activity'
  | 'whatsapp'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'menu'
  | 'close'
  | 'lock'
  | 'cpu'
  | 'layers'
  | 'file-text'
  | 'credit-card'
  | 'image'
  | 'printer'
  | 'box'
  | 'stethoscope'
  | 'microscope'
  | 'hospital'
  | 'network'
  | 'brain'
  | 'database'
  | 'monitor'
  | 'user-round'
  | 'send'
  | 'star'
  | 'zap'
  | 'globe'
  | 'graduation'
  | 'home'
  | 'external-link'
  | 'play'
  | 'gift'
  | 'scan'
  | 'arrow-up'
  | 'chevron-right'
  | 'handshake'
  | 'trophy'
  | 'settings'
  | 'lightbulb'
  | 'scale'
  | 'pill'
  | 'plane'
  | 'briefcase'
  | 'download'
  | 'upload'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'eye'
  | 'eye-off'
  | 'video'
  | 'folder'
  | 'newspaper'
  | 'logout'
  | 'chevron-left'
  | 'chevron-up'
  | 'refresh'
  | 'save'
  | 'copy'
  | 'arrow-left'
  | 'alert'
  | 'info'
  | 'inbox'
  | 'key'
  | 'dashboard'
  | 'link'
  | 'filter'
  | 'history'
  | 'grid'
  | 'list'
  | 'more'
  | 'bell'
  | 'help'
  | 'message'
  | 'megaphone'
  | 'text-size';

const PATHS: Record<IconName, JSX.Element> = {
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M8 7h9v9" />,
  'arrow-up': <path d="M12 19V5M6 11l6-6 6 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.2 12.2 2.6 2.6 5-5.4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.6c0 4.3 3 8.1 7 9.4 4-1.3 7-5.1 7-9.4V6l-7-3Z" />
      <path d="m9.2 12 2 2 3.6-3.9" />
    </>
  ),
  code: <path d="m9 18-6-6 6-6M15 6l6 6-6 6" />,
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h2.5a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 17V13ZM20 13h-2.5a1 1 0 0 0-1 1v3.5a1 1 0 0 0 1 1h1A1.5 1.5 0 0 0 20 17V13Z" />
      <path d="M18 18.5v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5 13.6 8 18 9.5 13.6 11 12 15.5 10.4 11 6 9.5 10.4 8 12 3.5Z" />
      <path d="M18.5 15.5 19.3 18l2.2.8-2.2.8-.8 2.4-.8-2.4-2.2-.8 2.2-.8.8-2.5ZM5 14l.6 1.8L7.5 16.4l-1.9.7L5 19l-.6-1.9-1.9-.7 1.9-.6L5 14Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M3 20c0-3.3 2.7-5.4 6-5.4S15 16.7 15 20" />
      <path d="M16 5.2a3.4 3.4 0 0 1 0 6.6M17.5 14.9c2.1.6 3.5 2.3 3.5 5.1" />
    </>
  ),
  landmark: (
    <>
      <path d="M3 10h18L12 4 3 10Z" />
      <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
      <path d="M3 21h18" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </>
  ),
  trophy: (
    <>
      <path d="M6.5 4h11v5a5.5 5.5 0 0 1-11 0V4Z" />
      <path d="M6.5 6H4.5a2 2 0 0 0 0 4h2M17.5 6h2a2 2 0 0 1 0 4h-2" />
      <path d="M12 14.5V18M9 21h6M10 18h4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </>
  ),
  lightbulb: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .9 1.6l.1.5h5l.1-.5c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3.5v17.5M7 21h10" />
      <path d="m12 6.5-7 1.8m7-1.8 7 1.8" />
      <path d="M5 8.3 2.6 14a2.5 2.5 0 0 0 4.8 0L5 8.3Zm14 0L16.6 14a2.5 2.5 0 0 0 4.8 0L19 8.3Z" />
    </>
  ),
  pill: (
    <>
      <path d="M10.5 20.5a5 5 0 0 1-7-7l6-6a5 5 0 0 1 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </>
  ),
  plane: <path d="M10.4 3.7a1.4 1.4 0 0 1 2.6 0L14.6 9l5.4 1.6a1.3 1.3 0 0 1 0 2.5L14.6 15l-1.6 5.3a1.3 1.3 0 0 1-2.5 0L8.9 15 3.6 13.1a1.3 1.3 0 0 1 0-2.5L8.9 9l1.5-5.3Z" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12h18" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V6l7-3v18M11 21V9l8 3v9M3 21h18" />
      <path d="M7 9v.01M7 13v.01M7 17v.01M15 14v.01M15 17v.01" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9.3A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.7C19 15.6 12 20 12 20Z" />,
  cloud: <path d="M7.5 19a4.2 4.2 0 0 1-.4-8.4 5.6 5.6 0 0 1 10.8-.6A3.9 3.9 0 0 1 17.5 19h-10Z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7v5.3l3.2 1.9" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  activity: <path d="M2 12.5h4l2.4-6.5 4.4 12 2.6-7 1.8 1.5H22" />,
  /* Marca oficial de WhatsApp. */
  whatsapp: (
    <path
      fill="currentColor"
      stroke="none"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"
    />
  ),
  facebook: (
    <path
      fill="currentColor"
      stroke="none"
      d="M13.5 21v-7.8h2.6l.4-3h-3V8.2c0-.88.24-1.47 1.5-1.47H16.7V4.06A21 21 0 0 0 14.36 4c-2.32 0-3.9 1.4-3.9 4v2.2H7.9v3h2.56V21h3.04Z"
    />
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <path d="M17 7.2h.01" />
    </>
  ),
  linkedin: (
    <path
      fill="currentColor"
      stroke="none"
      d="M6.94 8.5H4.1V21h2.84V8.5ZM5.52 3.5a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.9c0-3.3-1.76-4.84-4.1-4.84-1.9 0-2.75 1.04-3.22 1.78V8.5H9.84c.04.8 0 12.5 0 12.5h2.84v-6.98c0-.25.02-.5.1-.68.2-.5.66-1.02 1.44-1.02 1.02 0 1.42.78 1.42 1.92V21H20v-7.1Z"
    />
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.3 9.4 5 2.6-5 2.6V9.4Z" fill="currentColor" stroke="none" />
    </>
  ),
  phone: (
    <path d="M6.2 3.5h2.9l1.4 3.5-2 1.4a12.6 12.6 0 0 0 5.1 5.1l1.4-2 3.5 1.4v2.9a2.2 2.2 0 0 1-2.4 2.2A15.9 15.9 0 0 1 4 5.9a2.2 2.2 0 0 1 2.2-2.4Z" />
  ),
  mail: (
    <>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.6" />
      <path d="m3.6 7 8.4 6 8.4-6" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.6" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  cpu: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.4" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9.5 3v3.5M14.5 3v3.5M9.5 17.5V21M14.5 17.5V21M3 9.5h3.5M3 14.5h3.5M17.5 9.5H21M17.5 14.5H21" />
    </>
  ),
  layers: <path d="m12 3 9 4.6-9 4.6-9-4.6L12 3ZM3 12.4l9 4.6 9-4.6M3 16.9l9 4.6 9-4.6" />,
  'file-text': (
    <>
      <path d="M13.5 3H7a2.5 2.5 0 0 0-2.5 2.5v13A2.5 2.5 0 0 0 7 21h10a2.5 2.5 0 0 0 2.5-2.5V9l-6-6Z" />
      <path d="M13.5 3v6h6M8.5 13.5h7M8.5 17h5" />
    </>
  ),
  'credit-card': (
    <>
      <rect x="2.8" y="5.5" width="18.4" height="13" rx="2.6" />
      <path d="M2.8 10h18.4M6.5 14.8h3" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.6" />
      <circle cx="9" cy="10" r="1.8" />
      <path d="m4.5 17.5 4.6-4.4 3.4 3 3-2.6 4 3.8" />
    </>
  ),
  printer: (
    <>
      <path d="M7 9V4h10v5" />
      <rect x="3.5" y="9" width="17" height="7.5" rx="2.2" />
      <path d="M7 14h10v6H7z" />
    </>
  ),
  box: (
    <>
      <path d="m12 3 8 4v10l-8 4-8-4V7l8-4Z" />
      <path d="m4 7 8 4 8-4M12 11v10" />
    </>
  ),
  stethoscope: (
    <>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M5 3h2M13 3h2M10 12v2.5a4.5 4.5 0 0 0 9 0V13" />
      <circle cx="19" cy="11" r="2.1" />
    </>
  ),
  microscope: (
    <>
      <path d="M7 20h12M9.5 20a5.5 5.5 0 0 0 5.5-5.5" />
      <path d="M10.5 4.5 8 7l4 4 2.5-2.5a2.8 2.8 0 0 0-4-4Z" />
      <path d="m8.5 11.5-2.6 2.6a2 2 0 0 0 2.8 2.8l2.6-2.6" />
    </>
  ),
  hospital: (
    <>
      <path d="M4 21V8l8-4 8 4v13M2.5 21h19" />
      <path d="M12 9.5v5M9.5 12h5M9 21v-3.5h6V21" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <circle cx="12" cy="4" r="1.9" />
      <circle cx="19" cy="17" r="1.9" />
      <circle cx="5" cy="17" r="1.9" />
      <path d="M12 6v3.4M13.9 13.6l3.4 2M10.1 13.6l-3.4 2" />
    </>
  ),
  brain: (
    <>
      <path d="M12 5.2a3 3 0 0 0-5.6 1.2A2.9 2.9 0 0 0 4.5 9a2.9 2.9 0 0 0 1 2.2A3 3 0 0 0 6.8 16 3 3 0 0 0 12 18.4V5.2Z" />
      <path d="M12 5.2a3 3 0 0 1 5.6 1.2A2.9 2.9 0 0 1 19.5 9a2.9 2.9 0 0 1-1 2.2 3 3 0 0 1-1.3 4.8A3 3 0 0 1 12 18.4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </>
  ),
  monitor: (
    <>
      <rect x="2.8" y="4" width="18.4" height="12.5" rx="2.4" />
      <path d="M8.5 20.5h7M12 16.5v4" />
    </>
  ),
  'user-round': (
    <>
      <circle cx="12" cy="8.4" r="3.9" />
      <path d="M4.5 20.5c0-3.9 3.4-6.2 7.5-6.2s7.5 2.3 7.5 6.2" />
    </>
  ),
  send: <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />,
  star: <path d="m12 3.5 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.8l6-.8L12 3.5Z" />,
  zap: <path d="M13.2 2.5 4.5 13.6h6l-.7 7.9 8.7-11.1h-6l.7-7.9Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.4 12h17.2M12 3.4c2.2 2.4 3.4 5.4 3.4 8.6S14.2 18.2 12 20.6c-2.2-2.4-3.4-5.4-3.4-8.6S9.8 5.8 12 3.4Z" />
    </>
  ),
  graduation: (
    <>
      <path d="m12 4 9.5 4.5L12 13 2.5 8.5 12 4Z" />
      <path d="M6.5 10.5v5.2c0 1.6 2.5 2.8 5.5 2.8s5.5-1.2 5.5-2.8v-5.2M20.5 9v5.5" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 10.4 12 3.6l8.5 6.8V19a1.6 1.6 0 0 1-1.6 1.6H5.1A1.6 1.6 0 0 1 3.5 19v-8.6Z" />
      <path d="M9.4 20.6v-6.2h5.2v6.2" />
    </>
  ),
  'external-link': (
    <>
      <path d="M13.5 4.5H19a.5.5 0 0 1 .5.5v5.5" />
      <path d="M19.5 5 12 12.5" />
      <path d="M18 14.4V18a1.6 1.6 0 0 1-1.6 1.6H6A1.6 1.6 0 0 1 4.4 18V7.6A1.6 1.6 0 0 1 6 6h3.6" />
    </>
  ),
  play: <path d="M9 6.6 17.4 12 9 17.4V6.6Z" fill="currentColor" stroke="none" />,
  scan: (
    <>
      <rect x="2.8" y="4.2" width="18.4" height="12.6" rx="3" />
      <circle cx="12" cy="10.5" r="3.3" />
      <path d="M7.5 20.4h9M12 16.8v3.6" />
    </>
  ),
  gift: (
    <>
      <rect x="3.4" y="8.6" width="17.2" height="4.2" rx="1.2" />
      <path d="M4.9 12.8V19a1.6 1.6 0 0 0 1.6 1.6h11a1.6 1.6 0 0 0 1.6-1.6v-6.2M12 8.6v12" />
      <path d="M12 8.6H8.2a2.1 2.1 0 1 1 0-4.2c2 0 3.8 4.2 3.8 4.2Zm0 0h3.8a2.1 2.1 0 1 0 0-4.2c-2 0-3.8 4.2-3.8 4.2Z" />
    </>
  ),
  /* ---- iconos del panel de administracion ---- */
  download: <path d="M12 3.5v11m0 0 4-4m-4 4-4-4M4.5 15.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.5" />,
  upload: <path d="M12 14.5v-11m0 0 4 4m-4-4-4 4M4.5 15.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l.8 12.2a1.5 1.5 0 0 0 1.5 1.4h6.4a1.5 1.5 0 0 0 1.5-1.4L17.5 7M10 11v6M14 11v6" />,
  edit: <path d="M4 20h4.4L19.6 8.8a1.8 1.8 0 0 0 0-2.6l-1.8-1.8a1.8 1.8 0 0 0-2.6 0L4 15.6V20ZM13.5 6.5l4 4" />,
  eye: (
    <>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.8 2.8M7.4 7.6C4.5 9.3 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.8 0 3.4-.5 4.7-1.2M11 5.6c.3 0 .7-.1 1-.1 6 0 9.5 6.5 9.5 6.5s-.8 1.5-2.3 3.1" />,
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2.2" />
      <path d="m16 10 5-2.6v9.2L16 14" />
    </>
  ),
  folder: <path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4.2l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19.2H5a1.5 1.5 0 0 1-1.5-1.5v-10.2Z" />,
  newspaper: (
    <>
      <path d="M4 5.5h13.5v12a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2v-12Z" />
      <path d="M17.5 9.5H20a.5.5 0 0 1 .5.5v7.5a2 2 0 0 1-2 2" />
      <path d="M7 9h4v4H7zM13.5 9h1.5M13.5 12h1.5M7 16h8" />
    </>
  ),
  logout: <path d="M10 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h4M15 8l4 4-4 4M19 12H9.5" />,
  'chevron-left': <path d="m14.5 6-6 6 6 6" />,
  'chevron-up': <path d="m6 15 6-6 6 6" />,
  refresh: <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9M18.5 4v3.5H15M5.5 20v-3.5H9" />,
  save: <path d="M5 4.5h11l3.5 3.5v11.5H5V4.5ZM8 4.5V9h7V4.5M8 19.5v-5h8v5" />,
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
      <path d="M15.5 8.5V6a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" />
    </>
  ),
  'arrow-left': <path d="M19 12H5m0 0 6-6m-6 6 6 6" />,
  alert: <path d="M12 9v4.5M12 17h.01M10.3 4.6 3 17.2a1.9 1.9 0 0 0 1.7 2.8h14.6a1.9 1.9 0 0 0 1.7-2.8L13.7 4.6a1.9 1.9 0 0 0-3.4 0Z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  inbox: <path d="M3.5 13.5 6 5.5h12l2.5 8v5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5v-5Zm0 0H9l1.2 2.2h3.6L15 13.5h5.5" />,
  key: <path d="M14.5 4a5.5 5.5 0 0 0-5.2 7.3L3 17.6V21h3.4v-2.2h2.2v-2.2h2.2l1.6-1.6A5.5 5.5 0 1 0 14.5 4Zm1.5 4a1.5 1.5 0 1 1 0 .01" />,
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="9" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
      <rect x="3.5" y="15.5" width="7" height="5" rx="1.5" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.5 1.5M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5" />,
  filter: <path d="M4 5.5h16l-6.2 7.3v5.2l-3.6 1.8v-7L4 5.5Z" />,
  history: <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4M12 8v4.5l3 1.8" />,
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  list: <path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01" />,
  more: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  bell: <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2ZM9.8 20.5a2.3 2.3 0 0 0 4.4 0" />,
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.5a2.6 2.6 0 1 1 3.7 2.4c-.8.4-1.1.9-1.1 1.7M12 17h.01" />
    </>
  ),
  message: <path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 3.5V7A1.5 1.5 0 0 1 5 5.5ZM8 10h8M8 13h5" />,
  megaphone: <path d="M3.5 10.5v3a1 1 0 0 0 1 1H7l7 4V5.5l-7 4H4.5a1 1 0 0 0-1 1ZM17.5 9.5a3.5 3.5 0 0 1 0 5M7.5 14.5l1.2 5" />,
  'text-size': <path d="M3 18.5 8 6l5 12.5M4.8 14h6.4M14 18.5 17.2 10l3.3 8.5M15.3 15.6h3.9" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export default function Icon({ name, size = 20, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
