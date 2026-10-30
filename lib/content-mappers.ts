import type { Epk, GalleryImage, Show, Support, SupportTier } from "@/lib/types";

export interface ShowRow {
  id: string;
  date: string;
  time: string | null;
  city: string;
  country: "AR" | "UY";
  venue: string;
  ticket_url: string;
  status: Show["status"];
  notes: string | null;
  free_entry?: boolean | null;
}

export interface GalleryRow {
  id: string;
  src: string | null;
  alt: string;
  caption: string;
  scene: GalleryImage["scene"];
  span: GalleryImage["span"];
  position: number;
  mono: boolean;
}

export interface EpkRow {
  bio: string[] | null;
  bio_short: string | null;
  facts: Epk["facts"] | null;
  rider: Epk["rider"] | null;
  stage_plot_url: string | null;
  downloads: Epk["downloads"] | null;
}

export function mapShowRow(row: ShowRow): Show {
  const freeEntry = (row as any).free_entry ?? (row as any).freeEntry ?? false;
  return {
    id: row.id,
    date: row.date,
    time: row.time,
    city: row.city,
    country: row.country,
    venue: row.venue,
    ticketUrl: row.ticket_url ?? "",
    status: row.status,
    notes: row.notes,
    freeEntry: Boolean(freeEntry),
  };
}

export function mapGalleryRow(row: GalleryRow): GalleryImage {
  return {
    id: row.id,
    src: row.src,
    alt: row.alt,
    caption: row.caption,
    scene: row.scene,
    span: row.span,
    position: row.position,
    mono: row.mono,
  };
}

export function mergeEpkRow(row: EpkRow | null, fallback: Epk): Epk {
  if (!row) return fallback;

  return {
    ...fallback,
    bio: row.bio?.length ? row.bio : fallback.bio,
    bioShort: row.bio_short ?? fallback.bioShort,
    facts: row.facts?.length ? row.facts : fallback.facts,
    rider: row.rider?.length ? row.rider : fallback.rider,
    stagePlotUrl: row.stage_plot_url ?? fallback.stagePlotUrl,
    downloads: row.downloads?.length ? row.downloads : fallback.downloads,
  };
}

export interface SupportRow {
  alias: string | null;
  cvu: string | null;
  account_holder: string | null;
  qr_image_url: string | null;
  free_amount_link: string | null;
  tiers: unknown;
}

function readText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function mapSupportTiers(value: unknown): SupportTier[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;

    const title = readText(row.title);
    const amount = Number(row.amount);
    if (!title || !Number.isFinite(amount) || amount <= 0) return [];

    return [
      {
        id: readText(row.id) || `tier-${index + 1}`,
        title,
        description: readText(row.description),
        amount: Math.round(amount),
        paymentLink: readText(row.paymentLink ?? row.payment_link),
        featured: Boolean(row.featured),
      },
    ];
  });
}

export function mergeSupportRow(
  row: SupportRow | null,
  fallback: Support,
): Support {
  if (!row) return fallback;

  const tiers = mapSupportTiers(row.tiers);

  return {
    alias: readText(row.alias) || fallback.alias,
    cvu: readText(row.cvu) || fallback.cvu,
    accountHolder: readText(row.account_holder) || fallback.accountHolder,
    qrImageUrl: readText(row.qr_image_url) || null,
    freeAmountLink: readText(row.free_amount_link) || fallback.freeAmountLink,
    tiers: tiers.length ? tiers : fallback.tiers,
  };
}
