const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://elclasico.com.ar";

export const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteName = "EL CLÁSICO";

export const siteDescription =
  "El Clásico es una banda de rock de Gualeguaychú, Entre Ríos. Fuego Interior, gira 2026 y La Hermandad: rock clásico y moderno desde el litoral argentino.";

export const ogImage = {
  url: "/og-el-clasico.png",
  width: 1200,
  height: 630,
  alt: "El Clásico — Donde el rock se vive. Gira 2026 por Argentina y Uruguay.",
};
