import type { SiteData } from "@/lib/types";

export type AdminMode = "demo" | "supabase";

export interface AdminSession {
  mode: AdminMode;
  email: string;
  name: string;
  writeEnabled: boolean;
}

export type AdminData = SiteData;

export interface AdminActionResult {
  ok: boolean;
  error?: string;
  data?: AdminData;
  fieldErrors?: Record<string, string[] | undefined>;
}
