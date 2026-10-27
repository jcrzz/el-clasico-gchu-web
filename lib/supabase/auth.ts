import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getSupabaseAnonKey,
  getSupabaseProjectUrl,
  isSupabaseConfigured,
} from "./config";

/**
 * Authenticated server client, used by /admin and the protected mutations.
 * The public site reads content through lib/data.ts instead.
 */
export async function createSupabaseAuthClient() {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseProjectUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component: Proxy refreshes the session.
          }
        },
      },
    },
  );
}
