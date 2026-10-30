import { AudioProvider } from "@/components/audio/audio-provider";
import { FloatingPlayer } from "@/components/audio/floating-player";
import { Contact } from "@/components/site/contact";
import { Epk } from "@/components/site/epk";
import { Footer } from "@/components/site/footer";
import { Gallery } from "@/components/site/gallery";
import { Hermandad } from "@/components/site/hermandad";
import { Hero } from "@/components/site/hero";
import { History } from "@/components/site/history";
import { Music } from "@/components/site/music";
import { Navbar } from "@/components/site/navbar";
import { Shows } from "@/components/site/shows";
import { Support } from "@/components/site/support";
import { getSiteData } from "@/lib/data";

export default async function HomePage() {
  const { settings, albums, shows, gallery, epk, support } =
    await getSiteData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "El Clásico",
    description:
      "Banda de rock de Gualeguaychú, Entre Ríos, Argentina. Cinco discos y una gira 2026.",
    foundingDate: "2018",
    genre: ["Rock", "Rock alternativo"],
    foundingLocation: {
      "@type": "Place",
      name: "Gualeguaychú, Entre Ríos, Argentina",
    },
    email: settings.email,
    sameAs: settings.socials.map((social) => social.href),
    album: albums.map((album) => ({
      "@type": "MusicAlbum",
      name: album.title,
      ...(album.year ? { datePublished: album.year } : {}),
      numTracks: album.trackCount,
      track: album.tracks.map((track) => ({
        "@type": "MusicRecording",
        name: track.title,
        position: Number(track.number),
      })),
    })),
    event: shows
      .filter((show) => show.status !== "paused")
      .map((show) => ({
        "@type": "MusicEvent",
        name: `El Clásico en ${show.city}`,
        startDate: show.time ? `${show.date}T${show.time}:00-03:00` : show.date,
        eventStatus:
          show.status === "sold-out"
            ? "https://schema.org/EventSoldOut"
            : "https://schema.org/EventScheduled",
        location: {
          "@type": "MusicVenue",
          name: show.venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: show.city,
            addressCountry: show.country,
          },
        },
        offers: {
          "@type": "Offer",
          url: show.ticketUrl,
          availability:
            show.status === "sold-out"
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
        },
      })),
  };

  return (
    <AudioProvider albums={albums}>
      <Navbar settings={settings} />
      <main id="contenido">
        <Hero shows={shows} />
        <History />
        <Hermandad />
        <Support support={support} whatsapp={settings.whatsapp} />
        <Music albums={albums} />
        <Shows
          shows={shows}
          whatsapp={settings.whatsapp}
          whatsappMessage={settings.whatsappMessage}
        />
        <Gallery images={gallery} />
        <Epk epk={epk} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
      <FloatingPlayer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </AudioProvider>
  );
}
