import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseProjectUrl,
  isSupabaseAdminConfigured,
} from "./config";

/**
 * Service-role client. Never import this module from a Client Component.
 * It is used for admin reads, metadata writes and signed Storage uploads.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseAdminConfigured()) return null;

  return createClient(
    getSupabaseProjectUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}
