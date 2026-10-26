import { cacheLife, cacheTag } from "next/cache";
import { mockSiteData } from "./mock-data";
import { getSupabaseServer } from "./supabase/server";
import type {
  Epk,
  GalleryImage,
  Show,
  SiteData,
} from "./types";

interface ShowRow {
  id: string;
  date: string;
  time: string | null;
  city: string;
  country: "AR" | "UY";
  venue: string;
  ticket_url: string;
  status: Show["status"];
  notes: string | null;
}

interface GalleryRow {
  id: string;
  src: string | null;
  alt: string;
  caption: string;
  scene: GalleryImage["scene"];
  span: GalleryImage["span"];
  position: number;
  mono: boolean;
}

interface EpkRow {
  bio: string[] | null;
  bio_short: string | null;
  facts: Epk["facts"] | null;
  rider: Epk["rider"] | null;
  stage_plot_url: string | null;
  downloads: Epk["downloads"] | null;
}

export async function getSiteData(): Promise<SiteData> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-data", "shows", "gallery", "epk");

  const supabase = getSupabaseServer();
  if (!supabase) return mockSiteData;

  try {
    const [showsResult, galleryResult, epkResult] = await Promise.all([
      supabase
        .from("shows")
        .select(
          "id, date, time, city, country, venue, ticket_url, status, notes",
        )
        .order("date", { ascending: true }),
      supabase
        .from("gallery_images")
        .select("id, src, alt, caption, scene, span, position, mono")
        .order("position", { ascending: true }),
      supabase.from("epk_content").select("*").eq("id", "main").maybeSingle(),
    ]);

    const shows: Show[] =
      !showsResult.error && showsResult.data
        ? (showsResult.data as ShowRow[]).map((row) => ({
            id: row.id,
            date: row.date,
            time: row.time,
            city: row.city,
            country: row.country,
            venue: row.venue,
            ticketUrl: row.ticket_url,
            status: row.status,
            notes: row.notes,
          }))
        : mockSiteData.shows;

    const gallery: GalleryImage[] =
      !galleryResult.error && galleryResult.data
        ? (galleryResult.data as GalleryRow[]).map((row) => ({
            id: row.id,
            src: row.src,
            alt: row.alt,
            caption: row.caption,
            scene: row.scene,
            span: row.span,
            position: row.position,
            mono: row.mono,
          }))
        : mockSiteData.gallery;

    const row = (!epkResult.error ? epkResult.data : null) as EpkRow | null;
    const epk: Epk = row
      ? {
          ...mockSiteData.epk,
          bio: row.bio?.length ? row.bio : mockSiteData.epk.bio,
          bioShort: row.bio_short ?? mockSiteData.epk.bioShort,
          facts: row.facts?.length ? row.facts : mockSiteData.epk.facts,
          rider: row.rider?.length ? row.rider : mockSiteData.epk.rider,
          stagePlotUrl:
            row.stage_plot_url ?? mockSiteData.epk.stagePlotUrl,
          downloads: row.downloads?.length
            ? row.downloads
            : mockSiteData.epk.downloads,
        }
      : mockSiteData.epk;

    return {
      ...mockSiteData,
      shows,
      gallery,
      epk,
    };
  } catch {
    return mockSiteData;
  }
}
