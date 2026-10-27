"use server";

import { updateTag } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { formatBytes } from "@/lib/admin/format";
import {
  epkFinalizeSchema,
  epkSaveSchema,
  epkUploadInitSchema,
  galleryFinalizeSchema,
  galleryMetaSchema,
  galleryUploadInitSchema,
  showInputSchema,
  type ShowInput,
} from "@/lib/admin/schemas";
import { getAdminData } from "@/lib/admin/data";
import { getAdminSession } from "@/lib/admin/auth";
import type { AdminActionResult, AdminSession } from "@/lib/admin/types";
import { mergeEpkRow, type EpkRow } from "@/lib/content-mappers";
import { mockSiteData } from "@/lib/mock-data";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { GALLERY_BUCKET, PRESS_BUCKET } from "@/lib/supabase/config";
import type { Epk, EpkDownload, GalleryImage } from "@/lib/types";

const imageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const pdfTypes = new Set(["application/pdf", "application/x-pdf"]);
const zipTypes = new Set([
  "application/zip",
  "application/x-zip",
  "application/x-zip-compressed",
  "application/octet-stream",
]);

interface AdminContext {
  session: AdminSession;
  supabase: SupabaseClient;
}

async function getAdminContext(): Promise<
  { ok: true; context: AdminContext } | { ok: false; error: string }
> {
  const session = await getAdminSession();

  if (!session) {
    return {
      ok: false,
      error: "Tu sesión expiró. Volvé a entrar para guardar los cambios.",
    };
  }

  if (session.mode === "demo") {
    return {
      ok: false,
      error: "El modo demo guarda los cambios en el navegador, no en Supabase.",
    };
  }

  if (!session.writeEnabled) {
    return {
      ok: false,
      error:
        "Falta SUPABASE_SERVICE_ROLE_KEY. El panel queda en modo lectura hasta configurarla.",
    };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "No pudimos conectar con Supabase Admin." };
  }

  return { ok: true, context: { session, supabase } };
}

function fail(error: string): AdminActionResult {
  return { ok: false, error };
}

function storagePathFromPublicUrl(src: string | null | undefined, bucket: string) {
  if (!src) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = src.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(src.slice(index + marker.length).split("?")[0]);
}

async function readEpk(supabase: SupabaseClient): Promise<Epk> {
  const { data, error } = await supabase
    .from("epk_content")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  return mergeEpkRow(
    (!error ? data : null) as EpkRow | null,
    mockSiteData.epk,
  );
}

async function writeEpk(supabase: SupabaseClient, epk: Epk) {
  return supabase.from("epk_content").upsert(
    {
      id: "main",
      bio: epk.bio,
      bio_short: epk.bioShort,
      facts: epk.facts,
      rider: epk.rider,
      stage_plot_url: epk.stagePlotUrl,
      downloads: epk.downloads,
    },
    { onConflict: "id" },
  );
}

async function resultWithData(
  session: AdminSession,
): Promise<AdminActionResult> {
  return { ok: true, data: await getAdminData(session) };
}

export async function saveShowAction(
  input: ShowInput,
): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const parsed = showInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisá los datos de la fecha.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { session, supabase } = contextResult.context;
  const value = parsed.data;
  const payload = {
    date: value.date,
    time: value.time || null,
    city: value.city,
    country: value.country,
    venue: value.venue,
    ticket_url: value.ticketUrl,
    status: value.soldOut ? ("sold-out" as const) : ("available" as const),
    notes: value.notes || null,
  };

  const { error } = value.id
    ? await supabase.from("shows").update(payload).eq("id", value.id)
    : await supabase.from("shows").insert(payload);

  if (error) {
    console.error("[admin] save show", error);
    return fail("No pudimos guardar la fecha. Revisá la tabla shows.");
  }

  updateTag("shows");
  return resultWithData(session);
}

export async function deleteShowAction(id: string): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  if (!id.trim()) return fail("Falta el ID de la fecha.");

  const { session, supabase } = contextResult.context;
  const { error } = await supabase.from("shows").delete().eq("id", id);

  if (error) {
    console.error("[admin] delete show", error);
    return fail("No pudimos eliminar la fecha.");
  }

  updateTag("shows");
  return resultWithData(session);
}

export async function createGalleryUploadUrlAction(input: {
  filename: string;
  contentType: string;
  size: number;
}) {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const parsed = galleryUploadInitSchema.safeParse(input);
  if (!parsed.success) {
    return fail("La imagen supera los 12 MB o el archivo no es válido.");
  }

  const extension = imageTypes[parsed.data.contentType];
  if (!extension) {
    return fail("Usá JPG, PNG, WebP o AVIF.");
  }

  const { supabase } = contextResult.context;
  const path = `gallery/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[admin] gallery signed url", error);
    return fail("No pudimos preparar la subida. Revisá el bucket gallery.");
  }

  return {
    ok: true,
    path: data.path,
    token: data.token,
    bucket: GALLERY_BUCKET,
  };
}

export async function finalizeGalleryUploadAction(input: {
  path: string;
  alt: string;
  caption: string;
  scene: GalleryImage["scene"];
  span: GalleryImage["span"];
  mono: boolean;
}): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const parsed = galleryFinalizeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisá los datos de la imagen.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (!/^gallery\/[a-zA-Z0-9._-]+$/.test(parsed.data.path)) {
    return fail("La ruta del archivo no es válida.");
  }

  const { session, supabase } = contextResult.context;
  const { data: publicUrlData } = supabase.storage
    .from(GALLERY_BUCKET)
    .getPublicUrl(parsed.data.path);

  const { data: last } = await supabase
    .from("gallery_images")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const position =
    typeof last?.position === "number" ? last.position + 1 : 0;

  const { error } = await supabase.from("gallery_images").insert({
    src: publicUrlData.publicUrl,
    alt: parsed.data.alt,
    caption: parsed.data.caption,
    scene: parsed.data.scene,
    span: parsed.data.span,
    position,
    mono: parsed.data.mono,
  });

  if (error) {
    console.error("[admin] gallery insert", error);
    await supabase.storage.from(GALLERY_BUCKET).remove([parsed.data.path]);
    return fail("La imagen subió, pero no pudimos guardarla en la galería.");
  }

  updateTag("gallery");
  return resultWithData(session);
}

export async function updateGalleryAction(input: {
  id: string;
  alt: string;
  caption: string;
  scene: GalleryImage["scene"];
  span: GalleryImage["span"];
  mono: boolean;
}): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const parsed = galleryMetaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisá los datos de la imagen.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { session, supabase } = contextResult.context;
  const { error } = await supabase
    .from("gallery_images")
    .update({
      alt: parsed.data.alt,
      caption: parsed.data.caption,
      scene: parsed.data.scene,
      span: parsed.data.span,
      mono: parsed.data.mono,
    })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("[admin] gallery update", error);
    return fail("No pudimos actualizar la imagen.");
  }

  updateTag("gallery");
  return resultWithData(session);
}

export async function deleteGalleryAction(
  id: string,
): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const { session, supabase } = contextResult.context;
  const { data: row } = await supabase
    .from("gallery_images")
    .select("src")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("gallery_images")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[admin] gallery delete", error);
    return fail("No pudimos eliminar la imagen.");
  }

  const path = storagePathFromPublicUrl(
    (row as { src?: string | null } | null)?.src,
    GALLERY_BUCKET,
  );
  if (path) {
    await supabase.storage.from(GALLERY_BUCKET).remove([path]);
  }

  updateTag("gallery");
  return resultWithData(session);
}

export async function reorderGalleryAction(
  ids: string[],
): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  if (
    !Array.isArray(ids) ||
    ids.length > 300 ||
    new Set(ids).size !== ids.length
  ) {
    return fail("El orden recibido no es válido.");
  }

  const { session, supabase } = contextResult.context;
  const updates = await Promise.all(
    ids.map((id, position) =>
      supabase.from("gallery_images").update({ position }).eq("id", id),
    ),
  );

  const error = updates.find((result) => result.error)?.error;
  if (error) {
    console.error("[admin] gallery reorder", error);
    return fail("No pudimos guardar el nuevo orden.");
  }

  updateTag("gallery");
  return resultWithData(session);
}

export async function saveEpkAction(input: {
  bioShort: string;
  bioText: string;
  rider: { item: string; detail: string }[];
}): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const parsed = epkSaveSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Revisá la biografía y el rider.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { session, supabase } = contextResult.context;
  const current = await readEpk(supabase);
  const bio = parsed.data.bioText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const { error } = await writeEpk(supabase, {
    ...current,
    bio,
    bioShort: parsed.data.bioShort,
    rider: parsed.data.rider,
  });

  if (error) {
    console.error("[admin] save epk", error);
    return fail("No pudimos guardar el press kit.");
  }

  updateTag("epk");
  return resultWithData(session);
}

export async function createEpkUploadUrlAction(input: {
  kind: "bio" | "rider" | "fotos" | "demo" | "stage-plot";
  filename: string;
  contentType: string;
  size: number;
}) {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const parsed = epkUploadInitSchema.safeParse(input);
  if (!parsed.success) {
    return fail("El archivo supera los 25 MB o los datos no son válidos.");
  }

  const isPdf =
    parsed.data.kind === "bio" ||
    parsed.data.kind === "rider" ||
    parsed.data.kind === "stage-plot";
  const validType = isPdf
    ? pdfTypes.has(parsed.data.contentType)
    : zipTypes.has(parsed.data.contentType);

  if (!validType) {
    return fail(
      isPdf
        ? "Este archivo tiene que ser un PDF."
        : "Este archivo tiene que ser un ZIP.",
    );
  }

  const extension = isPdf ? "pdf" : "zip";
  const { supabase } = contextResult.context;
  const path = `press/${parsed.data.kind}-${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from(PRESS_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("[admin] epk signed url", error);
    return fail("No pudimos preparar la subida. Revisá el bucket press.");
  }

  return {
    ok: true,
    path: data.path,
    token: data.token,
    bucket: PRESS_BUCKET,
  };
}

export async function finalizeEpkUploadAction(input: {
  kind: "bio" | "rider" | "fotos" | "demo" | "stage-plot";
  path: string;
  size: number;
}): Promise<AdminActionResult> {
  const contextResult = await getAdminContext();
  if (!contextResult.ok) return fail(contextResult.error);

  const parsed = epkFinalizeSchema.safeParse(input);
  if (!parsed.success) return fail("Los datos del archivo no son válidos.");

  const expectedPrefix = `press/${parsed.data.kind}-`;
  if (
    !parsed.data.path.startsWith(expectedPrefix) ||
    !/^press\/[a-zA-Z0-9._-]+$/.test(parsed.data.path)
  ) {
    return fail("La ruta del archivo no es válida.");
  }

  const { session, supabase } = contextResult.context;
  const { data: publicUrlData } = supabase.storage
    .from(PRESS_BUCKET)
    .getPublicUrl(parsed.data.path);

  const current = await readEpk(supabase);
  let next: Epk = current;

  if (parsed.data.kind === "stage-plot") {
    next = { ...current, stagePlotUrl: publicUrlData.publicUrl };
  } else {
    const downloadId: Record<string, string> = {
      bio: "d-bio",
      rider: "d-rider",
      fotos: "d-fotos",
      demo: "d-demo",
    };
    const id = downloadId[parsed.data.kind];
    const downloads: EpkDownload[] = current.downloads.map((download) =>
      download.id === id
        ? {
            ...download,
            url: publicUrlData.publicUrl,
            size: formatBytes(parsed.data.size),
          }
        : download,
    );
    next = { ...current, downloads };
  }

  const { error } = await writeEpk(supabase, next);

  if (error) {
    console.error("[admin] finalize epk upload", error);
    await supabase.storage.from(PRESS_BUCKET).remove([parsed.data.path]);
    return fail("El archivo subió, pero no pudimos guardarlo en el press kit.");
  }

  updateTag("epk");
  return resultWithData(session);
}
