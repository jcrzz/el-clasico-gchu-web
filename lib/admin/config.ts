import { isSupabaseConfigured } from "@/lib/supabase/config";

export const ADMIN_DEMO_COOKIE = "elc_admin_demo";

export function isAdminDemoAvailable() {
  return !isSupabaseConfigured() && process.env.NODE_ENV !== "production";
}

export function parseAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string) {
  const allowed = parseAdminEmails();

  // In production the allowlist is mandatory: an open Supabase signup must
  // never become an admin account by accident. Locally we allow any
  // authenticated user so the panel can be tested against a real project.
  if (allowed.length === 0) return process.env.NODE_ENV !== "production";

  return allowed.includes(email.trim().toLowerCase());
}

export function hasConfiguredAdmins() {
  return parseAdminEmails().length > 0;
}
