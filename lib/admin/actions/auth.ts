"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_DEMO_COOKIE,
  hasConfiguredAdmins,
  isAdminDemoAvailable,
  isAllowedAdminEmail,
} from "@/lib/admin/config";
import { createSupabaseAuthClient } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface LoginState {
  error: string;
}

const initialError = { error: "" };

export async function loginAction(
  previousState: LoginState = initialError,
  formData: FormData,
): Promise<LoginState> {
  void previousState;

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase no está configurado. Usá el acceso demo para probar el panel.",
    };
  }

  if (
    process.env.NODE_ENV === "production" &&
    !hasConfiguredAdmins()
  ) {
    return {
      error:
        "Falta configurar ADMIN_EMAILS. Agregá los emails habilitados en Vercel.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá tu email y contraseña." };
  }

  const supabase = await createSupabaseAuthClient();
  if (!supabase) {
    return { error: "No pudimos iniciar el cliente de Supabase." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user?.email) {
    return { error: "Email o contraseña incorrectos." };
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return {
      error:
        "Tu cuenta existe, pero no tiene permisos para entrar a la cabina.",
    };
  }

  redirect("/admin");
}

export async function demoLoginAction(): Promise<LoginState> {
  if (!isAdminDemoAvailable()) {
    return {
      error:
        "El modo demo sólo está disponible en desarrollo cuando Supabase no está configurado.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: ADMIN_DEMO_COOKIE, path: "/admin" });

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseAuthClient();
      await supabase?.auth.signOut();
    } catch {
      // The session is being discarded regardless.
    }
  }

  redirect("/admin/login");
}
