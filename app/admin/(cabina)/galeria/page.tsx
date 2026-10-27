import type { Metadata } from "next";
import { GalleryManager } from "@/components/admin/gallery-manager";

export const metadata: Metadata = { title: "Galería" };

export default function AdminGalleryPage() {
  return <GalleryManager />;
}
