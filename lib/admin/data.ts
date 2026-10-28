import "server-only";

import {
  mapGalleryRow,
  mapShowRow,
  mergeEpkRow,
  type EpkRow,
  type GalleryRow,
  type ShowRow,
} from "@/lib/content-mappers";
import { mockSiteData } from "@/lib/mock-data";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { AdminData, AdminSession } from "./types";

function cloneMockData(): AdminData {
  return structuredClone(mockSiteData);
}

export async function getAdminData(session: AdminSession): Promise<AdminData> {
  if (session.mode === "demo") return cloneMockData();

  const supabase = getSupabaseAdmin();

  // Supabase is configured but the service-role key is missing. The panel
  // stays usable as a read-only preview and warns in the UI.
  if (!supabase) return cloneMockData();

  try {
    const [showsResult, galleryResult, epkResult] = await Promise.all([
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
    ]);

    return {
      ...cloneMockData(),
      shows:
        !showsResult.error && showsResult.data
          ? (showsResult.data as ShowRow[]).map(mapShowRow)
          : mockSiteData.shows,
      gallery:
        !galleryResult.error && galleryResult.data
          ? (galleryResult.data as GalleryRow[]).map(mapGalleryRow)
          : mockSiteData.gallery,
      epk: mergeEpkRow(
        (!epkResult.error ? epkResult.data : null) as EpkRow | null,
        mockSiteData.epk,
      ),
    };
  } catch {
    return cloneMockData();
  }
}
