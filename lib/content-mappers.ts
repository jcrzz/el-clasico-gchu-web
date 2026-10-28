import type { Epk, GalleryImage, Show } from "@/lib/types";

export interface ShowRow {
  id: string;
  date: string;
  time: string | null;
  city: string;
  country: "AR" | "UY";
  venue: string;
  ticket_url: string;
  status: Show["status"];
  notes: string | null;
  free_entry?: boolean | null;
}

export interface GalleryRow {
  id: string;
  src: string | null;
  alt: string;
  caption: string;
  scene: GalleryImage["scene"];
  span: GalleryImage["span"];
  position: number;
  mono: boolean;
}

export interface EpkRow {
  bio: string[] | null;
  bio_short: string | null;
  facts: Epk["facts"] | null;
  rider: Epk["rider"] | null;
  stage_plot_url: string | null;
  downloads: Epk["downloads"] | null;
}

export function mapShowRow(row: ShowRow): Show {
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    city: row.city,
    country: row.country,
    venue: row.venue,
    ticketUrl: row.ticket_url,
    status: row.status,
    notes: row.notes,
    freeEntry: row.free_entry ?? false,
  };
}

export function mapGalleryRow(row: GalleryRow): GalleryImage {
  return {
    id: row.id,
    src: row.src,
    alt: row.alt,
    caption: row.caption,
    scene: row.scene,
    span: row.span,
    position: row.position,
    mono: row.mono,
  };
}

export function mergeEpkRow(row: EpkRow | null, fallback: Epk): Epk {
  if (!row) return fallback;

  return {
    ...fallback,
    bio: row.bio?.length ? row.bio : fallback.bio,
    bioShort: row.bio_short ?? fallback.bioShort,
    facts: row.facts?.length ? row.facts : fallback.facts,
    rider: row.rider?.length ? row.rider : fallback.rider,
    stagePlotUrl: row.stage_plot_url ?? fallback.stagePlotUrl,
    downloads: row.downloads?.length ? row.downloads : fallback.downloads,
  };
}
