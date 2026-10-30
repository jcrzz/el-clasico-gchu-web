import type { Metadata } from "next";
import { SupportManager } from "@/components/admin/support-manager";

export const metadata: Metadata = { title: "Aportes" };

export default function AdminSupportPage() {
  return <SupportManager />;
}
