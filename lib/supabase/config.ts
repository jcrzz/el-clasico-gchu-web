export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isSupabaseAdminConfigured() {
  return Boolean(
    isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getSupabaseProjectUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
}

export const GALLERY_BUCKET =
  process.env.SUPABASE_GALLERY_BUCKET?.trim() || "gallery";

export const PRESS_BUCKET =
  process.env.SUPABASE_PRESS_BUCKET?.trim() || "press";

export const SUPPORT_BUCKET =
  process.env.SUPABASE_SUPPORT_BUCKET?.trim() || "support";
