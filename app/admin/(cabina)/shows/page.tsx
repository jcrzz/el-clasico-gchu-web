import type { Metadata } from "next";
import { ShowsManager } from "@/components/admin/shows-manager";

export const metadata: Metadata = { title: "Fechas" };

export default function AdminShowsPage() {
  return <ShowsManager />;
}
