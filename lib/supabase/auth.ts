import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Authenticated server client, used by /admin and the protected mutations.
 * The public site reads content through lib/data.ts instead.
 */
export async function createSupabaseAuthClient() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
            // Called from a Server Component: middleware refreshes the session.
          }
        },
      },
    },
  );
}
