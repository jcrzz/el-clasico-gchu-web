import type { Metadata, Viewport } from "next";
import {
  Big_Shoulders,
  Big_Shoulders_Stencil,
  Archivo,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";
import {
  ogImage,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site";

const poster = Big_Shoulders({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
});

const posterStencil = Big_Shoulders_Stencil({
  variable: "--font-poster-stencil",
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EL CLÁSICO — Donde el rock se vive",
    template: "%s — EL CLÁSICO",
  },
  description: siteDescription,
  applicationName: siteName,
  category: "music",
  keywords: [
    "El Clásico",
    "banda de rock",
    "Gualeguaychú",
    "Entre Ríos",
    "rock argentino",
    "Fuego Interior",
    "La Hermandad",
    "shows en vivo",
    "gira 2026",
  ],
  authors: [{ name: "El Clásico" }],
  creator: "El Clásico",
  publisher: "El Clásico",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteUrl,
    siteName,
    title: "EL CLÁSICO — Donde el rock se vive",
    description:
      "Rock desde Gualeguaychú para toda la región. Escuchá Fuego Interior y encontrá las fechas de la gira 2026.",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "EL CLÁSICO — Donde el rock se vive",
    description:
      "Rock desde Gualeguaychú para toda la región. Fuego Interior (2025) y gira 2026.",
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es-AR"
      className={`${poster.variable} ${posterStencil.variable} ${archivo.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-svh bg-ink text-bone antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-bone focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
        >
          Saltar al contenido
        </a>
        {children}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
