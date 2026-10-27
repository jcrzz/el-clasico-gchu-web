import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseProjectUrl,
  isSupabaseConfigured,
} from "./config";

/**
 * Read-only client for public content. Returns null while the project runs in
 * mock mode, so every section keeps working without credentials.
 */
export function getSupabaseServer(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  return createClient(getSupabaseProjectUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
