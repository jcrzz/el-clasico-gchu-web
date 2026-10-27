import { cacheLife, cacheTag } from "next/cache";
import {
  mapGalleryRow,
  mapShowRow,
  mergeEpkRow,
  type EpkRow,
  type GalleryRow,
  type ShowRow,
} from "./content-mappers";
import { mockSiteData } from "./mock-data";
import { getSupabaseServer } from "./supabase/server";

export async function getSiteData() {
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
