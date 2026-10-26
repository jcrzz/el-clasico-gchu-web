"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Music2 } from "lucide-react";
import { AlbumArt } from "@/components/art/album-art";
import { CropMarks } from "@/components/ui/section-heading";
import { SpotifyIcon, YouTubeIcon } from "@/components/ui/social-icons";
import type { Album } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Music({ album }: { album: Album }) {
  const [selected, setSelected] = useState(album.tracks[0]?.id ?? "");
  const panelId = useId();
  const current =
    album.tracks.find((track) => track.id === selected) ?? album.tracks[0];

  return (
    <section
      id="musica"
      className="section relative border-t border-white/10"
      aria-labelledby="musica-title"
    >
      <div className="shell relative">
        <header className="mb-12 md:mb-16">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="mt-2 hidden h-3 w-3 shrink-0 bg-fire md:block" />
              <h2
                id="musica-title"
                className="display text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.82]"
              >
                NUESTRA MÚSICA
              </h2>
            </div>
            <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:pb-1 md:text-right">
              Rock que nace del alma. Escuchá nuestras canciones.
            </p>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14 xl:gap-20">
          <div className="lg:col-span-5">
            <div className="group relative">
              <div
                aria-hidden="true"
                className="absolute right-0 top-1/2 z-0 hidden aspect-square w-[90%] -translate-y-1/2 translate-x-3 rounded-full border border-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[12%] md:block"
                style={{
                  background:
                    "repeating-radial-gradient(circle at center, #0a0a0a 0 2px, #151515 2px 4px, #080808 4px 7px)",
                  boxShadow: "0 30px 80px rgba(0,0,0,.65)",
                }}
              >
                <div className="absolute inset-[36%] flex items-center justify-center rounded-full bg-fire">
                  <span className="display text-[clamp(1rem,2vw,1.6rem)] text-ink">
                    EC
                  </span>
                </div>
                <div className="absolute inset-[49%] rounded-full bg-ink" />
              </div>

              <div className="relative z-10">
                <CropMarks className="-inset-3" />
                <div className="relative overflow-hidden border border-white/12 bg-ink">
                  <div className="aspect-square w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]">
                    <AlbumArt />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.08),transparent_38%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4">
              <p className="font-mono text-[10px] tracking-[0.18em] text-ash">
                {album.year} · {album.trackCount} CANCIONES
              </p>
              <a
                href={album.spotifyUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="group/link flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-bone transition-colors hover:text-fire"
              >
                <SpotifyIcon className="h-3.5 w-3.5" />
                ESCUCHAR EN SPOTIFY
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-end justify-between gap-4 border-b border-white/20 pb-3">
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                TRACKLIST
              </p>
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                {album.year} · LP
              </p>
            </div>

            <ol aria-label="Canciones de Fuego Interior">
              {album.tracks.map((track) => {
                const isActive = track.id === selected;
                return (
                  <li key={track.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(track.id)}
                      aria-pressed={isActive}
                      aria-controls={panelId}
                      className={cn(
                        "group relative flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition-colors sm:gap-6 sm:py-[1.1rem]",
                        isActive
                          ? "bg-white/[0.035]"
                          : "hover:bg-white/[0.025]",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-y-0 left-0 w-[2px] bg-fire transition-transform duration-300",
                          isActive ? "scale-y-100" : "scale-y-0",
                        )}
                      />
                      <span
                        className={cn(
                          "pl-3 font-mono text-[11px] tracking-[0.1em] transition-colors sm:pl-4",
                          isActive
                            ? "text-fire"
                            : "text-ash group-hover:text-fire",
                        )}
                      >
                        {track.number}
                      </span>
                      <span
                        className={cn(
                          "display flex-1 text-[clamp(1.35rem,2.4vw,1.85rem)] leading-none transition-all duration-300",
                          isActive
                            ? "text-bone"
                            : "text-steel/80 group-hover:translate-x-1 group-hover:text-bone",
                        )}
                      >
                        {track.title}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.1em] text-ash">
                        {track.duration}
                      </span>
                      <span
                        className={cn(
                          "hidden h-6 w-6 items-center justify-center border transition-colors sm:flex",
                          isActive
                            ? "border-fire bg-fire text-ink"
                            : "border-white/15 text-ash group-hover:border-white/40 group-hover:text-bone",
                        )}
                        aria-hidden="true"
                      >
                        {isActive ? (
                          <span className="flex items-end gap-[2px]">
                            <span className="block h-2 w-[2px] animate-pulse bg-ink" />
                            <span className="block h-3 w-[2px] animate-pulse bg-ink [animation-delay:120ms]" />
                            <span className="block h-1.5 w-[2px] animate-pulse bg-ink [animation-delay:240ms]" />
                          </span>
                        ) : (
                          <span className="ml-[1px] block h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-current" />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div
              id={panelId}
              aria-live="polite"
              className="relative mt-6 overflow-hidden border border-white/12 bg-carbon"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2.5">
                <p className="font-mono text-[8px] tracking-[0.2em] text-ash">
                  {album.spotifyEmbedUrl ? "REPRODUCTOR OFICIAL" : "SESIÓN DE ESCUCHA"}
                </p>
                <div className="flex items-center gap-2.5 font-mono text-[7px] tracking-[0.16em] text-white/50">
                  <span>44.1 kHz</span>
                  <span aria-hidden="true" className="h-2 w-px bg-white/15" />
                  <span>24-BIT</span>
                  <span aria-hidden="true" className="h-2 w-px bg-white/15" />
                  <span className="text-amber/80">STEREO</span>
                </div>
              </div>

              {album.spotifyEmbedUrl ? (
                <iframe
                  title={`${album.title} en Spotify`}
                  src={album.spotifyEmbedUrl}
                  width="100%"
                  height="352"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block w-full"
                />
              ) : (
                <div className="grid gap-5 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-white/10">
                      <AlbumArt compact />
                    </div>
                    <div>
                      <p className="font-mono text-[8px] tracking-[0.18em] text-fire">
                        SELECCIONADO — {current.number}
                      </p>
                      <p className="display mt-1 text-[1.4rem] leading-none text-bone">
                        {current.title}
                      </p>
                      <p className="mt-1.5 font-mono text-[9px] tracking-[0.12em] text-ash">
                        {current.duration} · {album.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={album.spotifyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[9px] tracking-[0.12em] text-bone transition-colors hover:border-fire hover:bg-fire hover:text-ink"
                    >
                      <SpotifyIcon className="h-3.5 w-3.5" />
                      SPOTIFY
                    </a>
                    <a
                      href={album.youtubeUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[9px] tracking-[0.12em] text-bone transition-colors hover:border-fire hover:bg-fire hover:text-ink"
                    >
                      <YouTubeIcon className="h-3.5 w-3.5" />
                      YOUTUBE
                    </a>
                    <a
                      href={album.appleMusicUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[9px] tracking-[0.12em] text-bone transition-colors hover:border-fire hover:bg-fire hover:text-ink"
                    >
                      <Music2 size={14} aria-hidden="true" />
                      APPLE
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
