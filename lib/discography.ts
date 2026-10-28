import type { Album, AlbumAccent, AlbumCoverVariant, AlbumStatus, Track } from "./types";

interface TrackSeed {
  title: string;
  /** Nombre del archivo dentro de public/audio, sin extensión. */
  file: string | null;
}

interface AlbumSeed {
  id: string;
  number: string;
  slug: string;
  title: string;
  year: string | null;
  status: AlbumStatus;
  cover: AlbumCoverVariant;
  accent: AlbumAccent;
  coverLines: string[];
  tracks: TrackSeed[];
}

const seeds: AlbumSeed[] = [
  {
    id: "d01",
    number: "01",
    slug: "01-aca-nadie-se-rinde",
    title: "Acá Nadie Se Rinde",
    year: null,
    status: "released",
    cover: "flame",
    accent: "fire",
    coverLines: ["ACÁ NADIE", "SE RINDE"],
    tracks: [
      { title: "1 en 32", file: "01-1-en-32" },
      { title: "Camalote", file: "02-camalote" },
      { title: "El Arrabal", file: "03-el-arrabal" },
      { title: "El Chico No Es Malvado", file: "04-el-chico-no-es-malvado" },
      { title: "Franklin", file: "05-franklin" },
      { title: "Naturaleza", file: "06-naturaleza" },
      { title: "Noche de Festejos", file: "07-noche-de-festejos" },
      { title: "Roca Rosa", file: "08-roca-rosa" },
    ],
  },
  {
    id: "d02",
    number: "02",
    slug: "02-resistiendo-en-la-trinchera",
    title: "Resistiendo en la Trinchera",
    year: null,
    status: "released",
    cover: "trench",
    accent: "steel",
    coverLines: ["RESISTIENDO", "EN LA", "TRINCHERA"],
    tracks: [
      { title: "Colectivas Realidades", file: "01-colectivas-realidades" },
      { title: "Dale Con un Hacha", file: "02-dale-con-un-hacha" },
      { title: "El Bondi", file: "03-el-bondi" },
      { title: "El Punchi", file: "04-el-punchi" },
      { title: "Fábula o Realidad", file: "05-fabula-o-realidad" },
      { title: "Gusano Vencedor", file: "06-gusano-vencedor" },
      { title: "Sideral", file: "07-sideral" },
      { title: "Solo Antes", file: "08-solo-antes" },
    ],
  },
  {
    id: "d03",
    number: "03",
    slug: "03-que-se-pudra",
    title: "Que Se Pudra",
    year: null,
    status: "released",
    cover: "rot",
    accent: "amber",
    coverLines: ["QUE SE", "PUDRA"],
    tracks: [
      { title: "Perro Sonajero", file: "01-perro-sonajero" },
      { title: "No lo Dejes", file: "02-no-lo-dejes" },
      { title: "Pedo de Perro", file: "03-pedo-de-perro" },
      { title: "2001", file: "04-2001" },
      { title: "Arpegio", file: "05-arpegio" },
      { title: "Longevo", file: "06-longevo" },
      { title: "Vos Sabías", file: "07-vos-sabias" },
      { title: "De este Suelo", file: "08-de-este-suelo" },
    ],
  },
  {
    id: "d04",
    number: "04",
    slug: "04-con-la-sangre-del-enemigo",
    title: "Con La Sangre Del Enemigo",
    year: null,
    status: "released",
    cover: "blood",
    accent: "fire",
    coverLines: ["CON LA SANGRE", "DEL ENEMIGO"],
    tracks: [
      { title: "4370", file: "01-4370" },
      { title: "Polvo de Ángeles", file: "02-polvo-de-angeles" },
      { title: "Punk Nuevo", file: "03-punk-nuevo" },
      { title: "P.G.B", file: "04-pgb" },
      { title: "Cacho Bardo", file: "05-cacho-bardo" },
      { title: "Laureles", file: "06-laureles" },
      { title: "El Sorete", file: "07-el-sorete" },
      { title: "El Llanto De La Sirena", file: "08-el-llanto-de-la-sirena" },
    ],
  },
  {
    id: "d05",
    number: "05",
    slug: "05-la-patria-no-se-vende",
    title: "La Patria No Se Vende",
    year: null,
    status: "upcoming",
    cover: "flag",
    accent: "amber",
    coverLines: ["LA PATRIA", "NO SE VENDE"],
    tracks: [
      { title: "Con La Sangre", file: null },
      { title: "Subite A Mi Historia", file: null },
      { title: "Gata Peluda", file: null },
      { title: "La Plazita", file: null },
      { title: "Kor Led Yer", file: null },
      { title: "Chanfle", file: null },
      { title: "Sombi", file: null },
      { title: "Machinger", file: null },
    ],
  },
];

function buildTrack(seed: AlbumSeed, track: TrackSeed, index: number): Track {
  return {
    id: `${seed.id}-t${String(index + 1).padStart(2, "0")}`,
    number: String(index + 1).padStart(2, "0"),
    title: track.title,
    durationSeconds: null,
    audioUrl: null,
    audioFile: track.file ? `${seed.slug}/${track.file}` : null,
  };
}

function searchUrl(base: string, title: string) {
  const query = encodeURIComponent(`El Clásico ${title}`);
  return base.replace("{query}", query);
}

export const discography: Album[] = seeds.map((seed) => {
  const tracks = seed.tracks.map((track, index) => buildTrack(seed, track, index));

  return {
    id: seed.id,
    number: seed.number,
    slug: seed.slug,
    title: seed.title,
    year: seed.year,
    status: seed.status,
    cover: seed.cover,
    accent: seed.accent,
    coverLines: seed.coverLines,
    trackCount: tracks.length,
    tracks,
    links: {
      spotify: searchUrl("https://open.spotify.com/search/{query}", seed.title),
      youtube: searchUrl(
        "https://www.youtube.com/results?search_query={query}",
        seed.title,
      ),
      appleMusic: searchUrl("https://music.apple.com/search?term={query}", seed.title),
    },
    spotifyEmbedUrl: null,
  };
});

/** Total de pistas reproducibles, usado para la cola global del reproductor. */
export function playableTracks(albums: Album[]) {
  return albums.flatMap((album) =>
    album.tracks
      .filter((track) => Boolean(track.audioUrl))
      .map((track) => ({ album, track })),
  );
}
