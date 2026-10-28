import type {
  Epk,
  GalleryImage,
  Show,
  SiteData,
  SiteSettings,
} from "./types";
import { discography } from "./discography";

export const settings: SiteSettings = {
  name: "EL CLÁSICO",
  tagline: "Rock desde Gualeguaychú",
  city: "Gualeguaychú",
  province: "Entre Ríos",
  country: "Argentina",
  established: "2018",
  email: "contacto@elclasico.com",
  pressEmail: "prensa@elclasico.com",
  bookingEmail: "contacto@elclasico.com",
  whatsapp: "5493446123456",
  whatsappMessage:
    "Hola El Clásico, quiero consultar por shows y entradas.",
  socials: [
    {
      label: "Instagram",
      handle: "@elclasico.banda",
      href: "https://www.instagram.com/elclasico.banda",
    },
    {
      label: "Facebook",
      handle: "/elclasico.banda",
      href: "https://www.facebook.com/elclasico.banda",
    },
    {
      label: "YouTube",
      handle: "@elclasico.banda",
      href: "https://www.youtube.com/@elclasico.banda",
    },
  ],
};

export const albums = discography;

export const shows: Show[] = [
  {
    id: "sh-01",
    date: "2026-11-07",
    time: "21:00",
    city: "Gualeguaychú",
    country: "AR",
    venue: "Centro Cultural",
    ticketUrl:
      "https://wa.me/5493446123456?text=Quiero%20entradas%20para%20El%20Cl%C3%A1sico%20en%20Gualeguaych%C3%BA",
    status: "available",
    freeEntry: false,
  },
  {
    id: "sh-02",
    date: "2026-11-14",
    time: "21:00",
    city: "Paraná",
    country: "AR",
    venue: "Sala Mayo",
    ticketUrl:
      "https://wa.me/5493446123456?text=Quiero%20entradas%20para%20El%20Cl%C3%A1sico%20en%20Paran%C3%A1",
    status: "available",
    freeEntry: false,
  },
  {
    id: "sh-03",
    date: "2026-11-21",
    time: "21:00",
    city: "Rosario",
    country: "AR",
    venue: "Club Distrito Siete",
    ticketUrl:
      "https://wa.me/5493446123456?text=Quiero%20entradas%20para%20El%20Cl%C3%A1sico%20en%20Rosario",
    status: "available",
    freeEntry: false,
  },
  {
    id: "sh-04",
    date: "2026-11-28",
    time: "21:00",
    city: "Buenos Aires",
    country: "AR",
    venue: "Vorterix — Capital Federal",
    ticketUrl:
      "https://wa.me/5493446123456?text=Quiero%20entradas%20para%20El%20Cl%C3%A1sico%20en%20Buenos%20Aires",
    status: "available",
    freeEntry: false,
  },
  {
    id: "sh-05",
    date: "2026-12-05",
    time: "21:00",
    city: "Córdoba",
    country: "AR",
    venue: "Quality Espacio",
    ticketUrl:
      "https://wa.me/5493446123456?text=Quiero%20entradas%20para%20El%20Cl%C3%A1sico%20en%20C%C3%B3rdoba",
    status: "available",
    freeEntry: false,
  },
  {
    id: "sh-06",
    date: "2026-12-12",
    time: "21:00",
    city: "Montevideo",
    country: "UY",
    venue: "Sala del Museo",
    ticketUrl:
      "https://wa.me/5493446123456?text=Quiero%20entradas%20para%20El%20Cl%C3%A1sico%20en%20Montevideo",
    status: "available",
    freeEntry: false,
  },
];

export const gallery: GalleryImage[] = [
  {
    id: "g-01",
    scene: "guitar",
    span: "tall",
    position: 0,
    alt: "Primer plano de las cuerdas y pastillas de una guitarra eléctrica bajo luz roja.",
    caption: "Guitarra y humo — soundcheck",
  },
  {
    id: "g-02",
    scene: "band",
    span: "wide",
    position: 1,
    alt: "Escenario vacío con amplificadores, batería y luces rojas antes del show.",
    caption: "El escenario antes de la tormenta — 2025",
  },
  {
    id: "g-03",
    scene: "drummer",
    span: "small",
    position: 2,
    alt: "Primer plano de una batería iluminada por una luz roja intensa.",
    caption: "La batería marca el pulso",
  },
  {
    id: "g-04",
    scene: "vocalist",
    span: "small",
    position: 3,
    mono: true,
    alt: "Micrófono de estudio sobre un pie, recortado en blanco y negro por un contraluz.",
    caption: "Voz y silencio — antes de salir",
  },
];

export const epk: Epk = {
  bioShort:
    "Rock de Gualeguaychú para toda la región. Guitarras de filo clásico, pulso moderno y una comunidad que crece en cada show.",
  bio: [
    "El Clásico nació en 2018 en Gualeguaychú, Entre Ríos, con una idea simple y obstinada: devolverle al rock el volumen, la mística y las ganas de cantar hasta quedarse sin voz. La banda construyó su sonido entre guitarras de filo clásico, ritmos modernos y letras que hablan de calles de provincia, noches largas y fuegos que no se apagan.",
    "Desde los primeros shows en clubes y centros culturales hasta la gira que hoy recorre Argentina y Uruguay, El Clásico convirtió cada presentación en un ritual compartido. Ese vínculo tiene nombre propio: La Hermandad, la comunidad de fans que creció show tras show y que hoy es parte inseparable del proyecto.",
    "A lo largo de cinco discos, El Clásico condensó su identidad: rock directo, estribillos para cantar en vivo y una producción que respeta la crudeza del escenario. El próximo capítulo se escribe en vivo.",
  ],
  facts: [
    { label: "Origen", value: "Gualeguaychú, Entre Ríos" },
    { label: "Activos desde", value: "2018" },
    { label: "Género", value: "Rock clásico / moderno" },
    { label: "Discos editados", value: "5" },
    { label: "Zona de gira", value: "Argentina y Uruguay" },
    { label: "Contacto", value: "contacto@elclasico.com" },
  ],
  rider: [
    {
      item: "Sistema de PA",
      detail:
        "PA adecuado a la capacidad y acústica del venue. Line array o sistema punto por punto.",
    },
    {
      item: "Monitoreo",
      detail:
        "4 mezclas independientes: cuñas o in-ear para voces, guitarras, bajo y batería.",
    },
    {
      item: "Microfonía",
      detail:
        "Voces SM58 o equivalente. Instrumentos según rider técnico detallado.",
    },
    {
      item: "Backline",
      detail:
        "Batería completa, amplificadores de guitarra y bajo. Consola de monitoreo propia.",
    },
    {
      item: "Iluminación",
      detail:
        "Iluminación escénica básica con contraluces rojo y ámbar sobre backline.",
    },
  ],
  stagePlotUrl: "/press/el-clasico-stage-plot.pdf",
  downloads: [
    {
      id: "d-bio",
      title: "Bio completa",
      description: "Historia, ficha artística y contacto profesional.",
      format: "PDF",
      size: "PDF",
      url: "/press/el-clasico-bio.pdf",
    },
    {
      id: "d-rider",
      title: "Rider técnico",
      description: "PA, monitoreo, microfonía, backline e iluminación.",
      format: "PDF",
      size: "PDF",
      url: "/press/el-clasico-rider.pdf",
    },
    {
      id: "d-fotos",
      title: "Fotos de prensa",
      description: "Selección en alta resolución para medios y productoras.",
      format: "ZIP",
      size: "ZIP",
      url: "/press/el-clasico-fotos.zip",
    },
    {
      id: "d-demo",
      title: "Demo / EPK",
      description: "Discografía, biografía corta y material de difusión.",
      format: "ZIP",
      size: "ZIP",
      url: "/press/el-clasico-epk.zip",
    },
  ],
};

export const mockSiteData: SiteData = {
  settings,
  albums,
  shows,
  gallery,
  epk,
};
