export type CountryCode = "AR" | "UY";

export type ShowStatus = "available" | "sold-out" | "paused";

export interface Show {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string | null;
  city: string;
  country: CountryCode;
  venue: string;
  ticketUrl: string;
  status: ShowStatus;
  notes?: string | null;
  freeEntry?: boolean;
}

export type SceneVariant = "guitar" | "band" | "drummer" | "vocalist";

export type GallerySpan = "tall" | "wide" | "small";

export interface GalleryImage {
  id: string;
  src?: string | null;
  alt: string;
  caption: string;
  scene: SceneVariant;
  span: GallerySpan;
  position: number;
  mono?: boolean;
}

export interface Track {
  id: string;
  number: string;
  title: string;
  duration: string;
}

export interface Album {
  title: string;
  year: string;
  trackCount: number;
  tracks: Track[];
  spotifyUrl: string;
  youtubeUrl: string;
  appleMusicUrl: string;
  spotifyEmbedUrl: string | null;
}

export type DownloadFormat = "PDF" | "ZIP";

export interface EpkDownload {
  id: string;
  title: string;
  description: string;
  format: DownloadFormat;
  size: string;
  url: string;
}

export interface RiderItem {
  item: string;
  detail: string;
}

export interface EpkFact {
  label: string;
  value: string;
}

export interface Epk {
  bio: string[];
  bioShort: string;
  facts: EpkFact[];
  rider: RiderItem[];
  stagePlotUrl: string;
  downloads: EpkDownload[];
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  city: string;
  province: string;
  country: string;
  established: string;
  email: string;
  pressEmail: string;
  bookingEmail: string;
  whatsapp: string;
  whatsappMessage: string;
  socials: SocialLink[];
}

export interface SiteData {
  settings: SiteSettings;
  album: Album;
  shows: Show[];
  gallery: GalleryImage[];
  epk: Epk;
}
