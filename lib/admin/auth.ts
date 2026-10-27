import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_DEMO_COOKIE,
  isAdminDemoAvailable,
  isAllowedAdminEmail,
} from "./config";
import type { AdminSession } from "./types";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();

  if (
    isAdminDemoAvailable() &&
    cookieStore.get(ADMIN_DEMO_COOKIE)?.value === "1"
  ) {
    return {
      mode: "demo",
      email: "demo@elclasico.local",
      name: "Modo demo",
      writeEnabled: true,
    };
  }

  const supabase = await createSupabaseAuthClient();
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email || !isAllowedAdminEmail(user.email)) return null;

    const metadataName = user.user_metadata?.name;
    const fallbackName = user.email.split("@")[0];

    return {
      mode: "supabase",
      email: user.email,
      name:
        typeof metadataName === "string" && metadataName.trim()
          ? metadataName
          : fallbackName,
      writeEnabled: isSupabaseAdminConfigured(),
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
