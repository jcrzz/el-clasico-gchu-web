import { cacheLife, cacheTag } from "next/cache";
import { withResolvedAudio } from "./audio";
import {
  mapGalleryRow,
  mapShowRow,
  mergeEpkRow,
  mergeSupportRow,
  type EpkRow,
  type GalleryRow,
  type ShowRow,
  type SupportRow,
} from "./content-mappers";
import { mockSiteData } from "./mock-data";
import { todayInArgentina } from "./shows";
import { getSupabaseServer } from "./supabase/server";

export async function getSiteData() {
  "use cache";
  cacheLife("hours");
  cacheTag("site-data", "shows", "gallery", "epk", "support");

  // El día se calcula dentro del scope cacheado: así el HTML prerenderizado es
  // estable y el cliente puede corregirlo al hidratar si cruzó la medianoche.
  const today = todayInArgentina();
  const base = {
    ...mockSiteData,
    albums: withResolvedAudio(mockSiteData.albums),
    today,
  };

  const supabase = getSupabaseServer();
  if (!supabase) return base;

  try {
    const [showsResult, galleryResult, epkResult, supportResult] =
      await Promise.all([
        supabase
          .from("shows")
          .select(
            "id, date, time, city, country, venue, ticket_url, status, notes, free_entry",
          )
          .order("date", { ascending: true }),
        supabase
          .from("gallery_images")
          .select("id, src, alt, caption, scene, span, position, mono")
          .order("position", { ascending: true }),
        supabase.from("epk_content").select("*").eq("id", "main").maybeSingle(),
        supabase
          .from("support_content")
          .select(
            "alias, cvu, account_holder, qr_image_url, free_amount_link, tiers",
          )
          .eq("id", "main")
          .maybeSingle(),
      ]);

    const shows =
      !showsResult.error && showsResult.data
        ? (showsResult.data as ShowRow[]).map(mapShowRow)
        : mockSiteData.shows;

    const gallery =
      !galleryResult.error && galleryResult.data
        ? (galleryResult.data as GalleryRow[]).map(mapGalleryRow)
        : mockSiteData.gallery;

    const epk = mergeEpkRow(
      (!epkResult.error ? epkResult.data : null) as EpkRow | null,
      mockSiteData.epk,
    );

    const support = mergeSupportRow(
      (!supportResult.error ? supportResult.data : null) as SupportRow | null,
      mockSiteData.support,
    );

    return {
      ...base,
      shows,
      gallery,
      epk,
      support,
    };
  } catch {
    return base;
  }
}
