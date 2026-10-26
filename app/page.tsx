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
import { getSiteData } from "@/lib/data";

export default async function HomePage() {
  const { settings, album, shows, gallery, epk } = await getSiteData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "El Clásico",
    description:
      "Banda de rock de Gualeguaychú, Entre Ríos, Argentina. Fuego Interior (2025).",
    foundingDate: "2018",
    genre: ["Rock", "Rock alternativo"],
    foundingLocation: {
      "@type": "Place",
      name: "Gualeguaychú, Entre Ríos, Argentina",
    },
    email: settings.email,
    sameAs: settings.socials.map((social) => social.href),
    album: {
      "@type": "MusicAlbum",
      name: album.title,
      datePublished: album.year,
      numTracks: album.trackCount,
    },
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
    <>
      <Navbar settings={settings} />
      <main id="contenido">
        <Hero shows={shows} />
        <History />
        <Hermandad />
        <Music album={album} />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
