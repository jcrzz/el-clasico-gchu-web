import type { Metadata } from "next";
import { EpkManager } from "@/components/admin/epk-manager";

export const metadata: Metadata = { title: "Press kit" };

export default function AdminEpkPage() {
  return <EpkManager />;
}
