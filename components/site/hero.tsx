import { CalendarDays, Play } from "lucide-react";
import { LiveScene } from "@/components/art/live-scene";
import type { Show } from "@/lib/types";
import { parseShowDate } from "@/lib/utils";

export function Hero({ shows }: { shows: Show[] }) {
  const marqueeShows = shows.filter((show) => show.status !== "paused");

  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      <LiveScene variant="hero" className="absolute inset-0 -z-10 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_58%_50%_at_50%_44%,rgba(7,7,7,.38)_0%,rgba(7,7,7,.12)_58%,transparent_78%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(7,7,7,.14)_0%,rgba(7,7,7,.5)_62%,rgba(7,7,7,.9)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-ink/85 to-transparent" />

      <div className="shell relative flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center pb-10 pt-28 text-center sm:pb-14 sm:pt-32">
          <div
            className="animate-hero-fade flex flex-col items-center"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span aria-hidden="true" className="h-px w-7 bg-fire/80 sm:w-10" />
              <span className="stencil text-[0.78rem] leading-none tracking-[0.46em] text-bone/75 sm:text-sm">
                EL CLÁSICO
              </span>
              <span aria-hidden="true" className="h-px w-7 bg-fire/80 sm:w-10" />
            </div>
            <p className="mt-4 font-mono text-[9px] tracking-[0.28em] text-amber/90 sm:text-[10px]">
              ROCK DESDE GUALEGUAYCHÚ · ENTRE RÍOS · AR
            </p>
          </div>

          <h1
            id="hero-title"
            className="mt-7 w-full text-[clamp(3.4rem,14vw,12rem)] leading-[0.8] sm:mt-8"
          >
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="animate-hero-line block will-change-transform">
                <span className="block text-bone" style={{ animationDelay: "0.2s" }}>
                  DONDE EL ROCK
                </span>
              </span>
            </span>
            <span className="relative mt-1 block">
              <span
                aria-hidden="true"
                className="animate-register absolute inset-0 block text-fire"
                style={{ animationDelay: "1.05s" }}
              >
                SE VIVE
              </span>
              <span className="relative block text-outline">SE VIVE</span>
            </span>
          </h1>

          <p
            className="animate-hero-fade mt-7 max-w-[30rem] text-[0.92rem] leading-relaxed text-steel/85 sm:text-base"
            style={{ animationDelay: "1.15s" }}
          >
            Canciones de provincia, guitarras al frente y una comunidad que
            canta más fuerte que el amplificador.
          </p>

          <div
            className="animate-hero-fade mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
            style={{ animationDelay: "1.3s" }}
          >
            <a href="#musica" className="btn btn-solid group">
              <Play
                size={14}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
              Escuchar ahora
            </a>
            <a href="#shows" className="btn btn-ghost group">
              <CalendarDays
                size={15}
                strokeWidth={1.6}
                className="text-amber/90 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              Ver shows
            </a>
          </div>
        </div>

        <div className="relative flex items-center justify-between gap-4 py-5 sm:py-6">
          <p className="hidden font-mono text-[9px] leading-relaxed tracking-[0.18em] text-ash sm:block">
            EST. 2018
            <br />
            GUALEGUAYCHÚ · AR
          </p>

          <a
            href="#historia"
            className="group mx-auto flex flex-col items-center gap-2"
            aria-label="Bajar a Nuestra Historia"
          >
            <span className="relative flex h-[34px] w-[21px] items-start justify-center rounded-full border border-white/25 py-2 transition-colors group-hover:border-fire/70">
              <span className="scroll-wheel block h-[5px] w-[2px] bg-fire" />
            </span>
            <span className="font-mono text-[8px] tracking-[0.3em] text-ash transition-colors group-hover:text-bone">
              SCROLL
            </span>
          </a>

          <p className="hidden text-right font-mono text-[9px] leading-relaxed tracking-[0.18em] text-ash sm:block">
            GIRA 2026
            <br />
            ARGENTINA · URUGUAY
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative z-10 overflow-hidden border-y border-white/10 bg-ink/65 py-2.5 backdrop-blur-md"
      >
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {marqueeShows.map((show) => {
                const date = parseShowDate(show.date);
                return (
                  <span
                    key={`${copy}-${show.id}`}
                    className="flex items-center gap-3 px-5 font-mono text-[9px] tracking-[0.18em] text-ash sm:gap-4 sm:px-7 sm:text-[10px]"
                  >
                    <span className="text-fire">✳</span>
                    <span className="text-bone/85">
                      {date.day} {date.monthShort}
                    </span>
                    <span>{show.city.toUpperCase()}</span>
                    <span className="text-white/40">
                      {show.country === "AR" ? "ARG" : "URU"}
                    </span>
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
