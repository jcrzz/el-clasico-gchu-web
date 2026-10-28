"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LoaderCircle,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayer } from "@/components/audio/audio-provider";
import { AlbumCover } from "@/components/art/album-cover";
import { CropMarks } from "@/components/ui/section-heading";
import { SpotifyIcon, YouTubeIcon } from "@/components/ui/social-icons";
import type { Album } from "@/lib/types";
import { cn, formatTime } from "@/lib/utils";

const PANEL_ID = "discography-panel";

function rangeStyle(percent: number) {
  return {
    "--range-progress": `${Math.max(0, Math.min(100, percent))}%`,
  } as CSSProperties;
}

function Equalizer({
  playing,
  className,
}: {
  playing: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("flex h-3 items-end gap-[2px]", className)}
    >
      {[8, 12, 6, 10].map((height, index) => (
        <span
          key={height}
          className="eq-bar"
          data-paused={!playing}
          style={{ height, animationDelay: `${index * 110}ms` }}
        />
      ))}
    </span>
  );
}

function StatusBadge({
  pending,
  children,
}: {
  pending?: boolean;
  children: string;
}) {
  return (
    <span
      className={cn(
        "border px-2 py-1 font-mono text-[7px] tracking-[0.16em]",
        pending
          ? "border-amber/40 bg-amber/[0.06] text-amber/90"
          : "border-white/12 bg-white/[0.03] text-ash",
      )}
    >
      {children}
    </span>
  );
}

export function Music({ albums }: { albums: Album[] }) {
  const [viewIndex, setViewIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sessionRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const reduceMotion = useReducedMotion();

  const {
    current,
    status,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    error,
    knownDurations,
    playTrack,
    toggle,
    next,
    previous,
    seek,
    changeVolume,
    toggleMute,
    setSessionVisible,
  } = usePlayer();

  const viewAlbum = albums[viewIndex] ?? albums[0];
  const currentAlbumIndex = current
    ? albums.findIndex((album) => album.id === current.album.id)
    : -1;

  const shownAlbum = current?.album ?? viewAlbum;
  const shownTrack = current?.track ?? viewAlbum.tracks[0];
  const isLive = Boolean(current);
  const isPending = !shownTrack.audioUrl;
  const isPlayingCurrent = isLive && isPlaying;
  const pendingLabel =
    shownAlbum.status === "upcoming" ? "PRÓXIMAMENTE" : "AUDIO PENDIENTE";

  const totalDuration =
    (isLive ? duration : 0) ||
    shownTrack.durationSeconds ||
    knownDurations[shownTrack.id] ||
    0;
  const elapsed = isLive ? currentTime : 0;
  const progress = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0;
  const progressDisabled = !isLive || !current?.track.audioUrl;

  const statusLabel = error
    ? "AUDIO NO DISPONIBLE"
    : status === "playing"
      ? "REPRODUCIENDO"
      : status === "loading"
        ? "CARGANDO"
        : status === "paused"
          ? "EN PAUSA"
          : "SESIÓN EN ESPERA";

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    tabRefs.current[viewIndex]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [reduceMotion, viewIndex]);

  useEffect(() => {
    const node = sessionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSessionVisible(entry.isIntersecting),
      {
        threshold: 0.35,
        rootMargin: "-72px 0px -6% 0px",
      },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      setSessionVisible(false);
    };
  }, [setSessionVisible]);

  function goToAlbum(index: number) {
    const total = albums.length;
    setViewIndex(((index % total) + total) % total);
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const target = (index + direction + albums.length) % albums.length;
    setViewIndex(target);
    tabRefs.current[target]?.focus();
  }

  function handlePlay() {
    if (current) {
      toggle();
      return;
    }
    if (shownTrack.audioUrl) playTrack(shownAlbum, shownTrack);
  }

  return (
    <section
      id="musica"
      className="section relative overflow-hidden border-t border-white/10"
      aria-labelledby="musica-title"
    >
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] ambient-fire opacity-25" />
      <div className="shell relative">
        <header className="mb-10 md:mb-14">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="mt-2 hidden h-3 w-3 shrink-0 bg-fire md:block"
              />
              <h2
                id="musica-title"
                className="display text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.82]"
              >
                NUESTRA MÚSICA
              </h2>
            </div>
            <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:pb-1 md:text-right">
              Cinco discos, una misma trinchera. Elegí un tema y la sesión sigue
              sonando mientras recorrés la web.
            </p>
          </div>
        </header>

        <div className="mb-8 border-y border-white/10">
          <div className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => goToAlbum(viewIndex - 1)}
              className="hidden w-11 shrink-0 items-center justify-center border-r border-white/10 text-ash transition-colors hover:bg-white/[0.04] hover:text-fire sm:flex"
              aria-label="Disco anterior"
            >
              <ArrowLeft size={16} aria-hidden="true" />
            </button>

            <div
              role="tablist"
              aria-label="Discografía de El Clásico"
              className="no-scrollbar flex flex-1 snap-x snap-mandatory overflow-x-auto"
            >
              {albums.map((album, index) => {
                const active = index === viewIndex;
                return (
                  <button
                    key={album.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`album-tab-${album.id}`}
                    aria-selected={active}
                    aria-controls={PANEL_ID}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setViewIndex(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={cn(
                      "group relative flex shrink-0 snap-start items-center gap-3 border-r border-white/10 px-4 py-3.5 text-left transition-colors sm:px-5",
                      active
                        ? "bg-white/[0.045]"
                        : "hover:bg-white/[0.025]",
                    )}
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-[0.12em] transition-colors",
                        active ? "text-fire" : "text-ash group-hover:text-steel",
                      )}
                    >
                      {album.number}
                    </span>
                    <span aria-hidden="true" className="h-3 w-px bg-white/15" />
                    <span
                      className={cn(
                        "whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] transition-colors",
                        active ? "text-bone" : "text-ash group-hover:text-steel",
                      )}
                    >
                      {album.title}
                    </span>
                    {current?.album.id === album.id ? (
                      <Equalizer playing={isPlaying} className="h-2.5 text-fire" />
                    ) : null}
                    {active ? (
                      <motion.span
                        layoutId="album-tab-underline"
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[2px] bg-fire"
                        transition={{
                          duration: reduceMotion ? 0 : 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => goToAlbum(viewIndex + 1)}
              className="hidden w-11 shrink-0 items-center justify-center border-l border-white/10 text-ash transition-colors hover:bg-white/[0.04] hover:text-fire sm:flex"
              aria-label="Disco siguiente"
            >
              <ArrowRight size={16} aria-hidden="true" />
            </button>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent sm:hidden"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06] px-3 py-2">
            <p className="font-mono text-[8px] tracking-[0.18em] text-ash">
              DISC-{viewAlbum.number} / {String(albums.length).padStart(2, "0")}
            </p>
            <p className="font-mono text-[8px] tracking-[0.18em] text-ash">
              {viewAlbum.trackCount} CANCIONES ·{" "}
              <span
                className={
                  viewAlbum.status === "upcoming" ? "text-amber/90" : "text-steel"
                }
              >
                {viewAlbum.status === "upcoming" ? "PRÓXIMAMENTE" : "DISPONIBLE"}
              </span>
            </p>
          </div>
        </div>

        <div
          id={PANEL_ID}
          role="tabpanel"
          aria-labelledby={`album-tab-${viewAlbum.id}`}
          className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14 xl:gap-20"
        >
          <div className="lg:col-span-5">
            <div className="group relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
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
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={viewAlbum.id}
                        className="h-full w-full"
                        initial={
                          reduceMotion ? false : { opacity: 0, scale: 1.015 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        exit={
                          reduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.995 }
                        }
                        transition={{
                          duration: reduceMotion ? 0 : 0.32,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <AlbumCover album={viewAlbum} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.08),transparent_38%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </div>
            </div>

            <div className="relative z-10 mx-auto mt-6 w-full max-w-md border-t border-white/10 pt-4 lg:mx-0 lg:max-w-none">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={viewAlbum.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: reduceMotion ? 0 : 0.24 }}
                  >
                    <p className="font-mono text-[9px] tracking-[0.18em] text-fire">
                      DISCO {viewAlbum.number} /{" "}
                      {String(albums.length).padStart(2, "0")}
                    </p>
                    <h3 className="display mt-2 max-w-md text-[clamp(1.8rem,3.1vw,2.8rem)] leading-[0.86]">
                      {viewAlbum.title}
                    </h3>
                  </motion.div>
                </AnimatePresence>

                <p className="font-mono text-[9px] tracking-[0.16em] text-ash">
                  {viewAlbum.year ?? `LP ${viewAlbum.number}`}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                  {viewAlbum.trackCount} CANCIONES
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={viewAlbum.links.spotify}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Escuchar ${viewAlbum.title} en Spotify`}
                    className="flex items-center gap-1.5 border border-white/12 px-2 py-1.5 font-mono text-[8px] tracking-[0.1em] text-ash transition-colors hover:border-fire hover:text-bone"
                  >
                    <SpotifyIcon className="h-3 w-3" />
                    <span className="hidden xl:inline">SPOTIFY</span>
                  </a>
                  <a
                    href={viewAlbum.links.youtube}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Escuchar ${viewAlbum.title} en YouTube`}
                    className="flex items-center gap-1.5 border border-white/12 px-2 py-1.5 font-mono text-[8px] tracking-[0.1em] text-ash transition-colors hover:border-fire hover:text-bone"
                  >
                    <YouTubeIcon className="h-3 w-3" />
                    <span className="hidden xl:inline">YOUTUBE</span>
                  </a>
                  <a
                    href={viewAlbum.links.appleMusic}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Escuchar ${viewAlbum.title} en Apple Music`}
                    className="flex items-center gap-1.5 border border-white/12 px-2 py-1.5 font-mono text-[8px] tracking-[0.1em] text-ash transition-colors hover:border-fire hover:text-bone"
                  >
                    <Music2 size={12} aria-hidden="true" />
                    <span className="hidden xl:inline">APPLE</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-end justify-between gap-4 border-b border-white/20 pb-3">
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                TRACKLIST
              </p>
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                {viewAlbum.trackCount} PISTAS · LP
              </p>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.ol
                key={viewAlbum.id}
                aria-label={`Canciones de ${viewAlbum.title}`}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
              >
                {viewAlbum.tracks.map((track) => {
                  const isCurrent = current?.track.id === track.id;
                  const playable = Boolean(track.audioUrl);
                  const storedDuration =
                    knownDurations[track.id] ?? track.durationSeconds;
                  const rowPendingLabel =
                    viewAlbum.status === "upcoming"
                      ? "PRÓXIMAMENTE"
                      : "AUDIO PENDIENTE";

                  const content = (
                    <>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-y-0 left-0 w-[2px] bg-fire transition-transform duration-300",
                          isCurrent
                            ? "scale-y-100"
                            : "scale-y-0 group-hover:scale-y-100",
                        )}
                      />
                      <span
                        className={cn(
                          "pl-3 font-mono text-[11px] tracking-[0.1em] transition-colors sm:pl-4",
                          isCurrent
                            ? "text-fire"
                            : "text-ash group-hover:text-fire",
                        )}
                      >
                        {track.number}
                      </span>
                      <span
                        className={cn(
                          "display min-w-0 flex-1 truncate text-[clamp(1.15rem,2.1vw,1.65rem)] leading-none transition-all duration-300",
                          isCurrent
                            ? "text-bone"
                            : "text-steel/80 group-hover:translate-x-1 group-hover:text-bone",
                        )}
                      >
                        {track.title}
                      </span>

                      {playable ? (
                        <span className="hidden font-mono text-[10px] tracking-[0.1em] text-ash sm:block">
                          {storedDuration ? formatTime(storedDuration) : "--:--"}
                        </span>
                      ) : (
                        <span className="border border-amber/35 bg-amber/[0.05] px-1.5 py-0.5 font-mono text-[7px] tracking-[0.14em] text-amber/90">
                          {rowPendingLabel}
                        </span>
                      )}

                      <span
                        className={cn(
                          "hidden h-6 w-6 items-center justify-center border transition-colors sm:flex",
                          isCurrent
                            ? "border-fire bg-fire text-ink"
                            : playable
                              ? "border-white/15 text-ash group-hover:border-white/40 group-hover:text-bone"
                              : "border-white/10 text-amber/70",
                        )}
                        aria-hidden="true"
                      >
                        {isCurrent ? (
                          <Equalizer playing={isPlaying} className="h-2.5" />
                        ) : playable ? (
                          <span className="ml-[1px] block h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-current" />
                        ) : (
                          <span className="block h-1.5 w-1.5 bg-amber" />
                        )}
                      </span>
                    </>
                  );

                  return (
                    <li key={track.id}>
                      {playable ? (
                        <button
                          type="button"
                          onClick={() => playTrack(viewAlbum, track)}
                          aria-pressed={isCurrent}
                          aria-controls="sesion-de-escucha"
                          aria-label={
                            isCurrent && isPlaying
                              ? `Pausar ${track.title}`
                              : `Reproducir ${track.title} de ${viewAlbum.title}`
                          }
                          className={cn(
                            "group relative flex w-full items-center gap-3 border-b border-white/10 py-3.5 text-left transition-colors sm:gap-5",
                            isCurrent
                              ? "bg-white/[0.035]"
                              : "hover:bg-white/[0.025]",
                          )}
                        >
                          {content}
                        </button>
                      ) : (
                        <div
                          aria-disabled="true"
                          className="group relative flex w-full cursor-default items-center gap-3 border-b border-white/10 py-3.5 text-left opacity-80 sm:gap-5"
                        >
                          {content}
                        </div>
                      )}
                    </li>
                  );
                })}
              </motion.ol>
            </AnimatePresence>

            <div
              ref={sessionRef}
              id="sesion-de-escucha"
              className="relative mt-6 overflow-hidden border border-white/12 bg-carbon"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1.5 w-1.5",
                      isPlayingCurrent ? "bg-fire" : "bg-white/30",
                    )}
                  />
                  <p className="font-mono text-[8px] tracking-[0.2em] text-ash">
                    SESIÓN DE ESCUCHA
                  </p>
                  <span
                    role="status"
                    className={cn(
                      "border px-1.5 py-0.5 font-mono text-[7px] tracking-[0.16em]",
                      error
                        ? "border-fire/50 text-fire"
                        : isPlayingCurrent
                          ? "border-fire/40 text-fire"
                          : "border-white/10 text-ash",
                    )}
                  >
                    {statusLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 font-mono text-[7px] tracking-[0.16em] text-white/50">
                  <span>44.1 kHz</span>
                  <span aria-hidden="true" className="h-2 w-px bg-white/15" />
                  <span>24-BIT</span>
                  <span aria-hidden="true" className="h-2 w-px bg-white/15" />
                  <span className="text-amber/80">STEREO</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-white/10 bg-ink">
                    <AlbumCover album={shownAlbum} compact />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p
                        className={cn(
                          "font-mono text-[8px] tracking-[0.18em]",
                          isLive ? "text-fire" : "text-ash",
                        )}
                      >
                        {isLive ? statusLabel : "LISTO PARA SONAR"} —{" "}
                        {shownTrack.number} /{" "}
                        {String(shownAlbum.trackCount).padStart(2, "0")}
                      </p>
                      {current && current.album.id !== viewAlbum.id ? (
                        <button
                          type="button"
                          onClick={() => goToAlbum(currentAlbumIndex)}
                          className="border-b border-fire/50 font-mono text-[7px] tracking-[0.16em] text-fire transition-colors hover:text-amber"
                        >
                          VER DISCO {current.album.number}
                        </button>
                      ) : null}
                    </div>
                    <p className="display mt-1.5 truncate text-[clamp(1.35rem,2.4vw,1.9rem)] leading-none text-bone">
                      {shownTrack.title}
                    </p>
                    <p className="mt-1.5 truncate font-mono text-[9px] tracking-[0.12em] text-ash">
                      {shownAlbum.title}
                    </p>
                  </div>

                  {isPending ? (
                    <StatusBadge pending>{pendingLabel}</StatusBadge>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={previous}
                    disabled={!isLive}
                    aria-label="Tema anterior"
                    className="flex h-10 w-10 items-center justify-center border border-white/15 text-ash transition-colors hover:border-fire hover:text-bone disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <SkipBack size={16} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={handlePlay}
                    disabled={isPending}
                    aria-label={isPlayingCurrent ? "Pausar" : "Reproducir"}
                    className="flex h-12 w-12 items-center justify-center bg-fire text-ink transition-colors hover:bg-amber disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                  >
                    {status === "loading" && isLive ? (
                      <LoaderCircle size={20} className="animate-spin" aria-hidden="true" />
                    ) : isPlayingCurrent ? (
                      <Pause size={19} fill="currentColor" aria-hidden="true" />
                    ) : (
                      <Play
                        size={19}
                        fill="currentColor"
                        className="ml-[2px]"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    disabled={!isLive}
                    aria-label="Tema siguiente"
                    className="flex h-10 w-10 items-center justify-center border border-white/15 text-ash transition-colors hover:border-fire hover:text-bone disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <SkipForward size={16} aria-hidden="true" />
                  </button>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={muted ? "Activar sonido" : "Silenciar"}
                      aria-pressed={muted}
                      className="flex h-9 w-9 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire hover:text-bone"
                    >
                      {muted || volume === 0 ? (
                        <VolumeX size={15} aria-hidden="true" />
                      ) : (
                        <Volume2 size={15} aria-hidden="true" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={muted ? 0 : volume}
                      onChange={(event) =>
                        changeVolume(Number(event.target.value))
                      }
                      aria-label="Volumen"
                      className="audio-range hidden w-20 md:block"
                      style={rangeStyle((muted ? 0 : volume) * 100)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 shrink-0 font-mono text-[9px] tracking-[0.08em] text-ash">
                    {formatTime(isLive ? elapsed : 0)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(totalDuration, 1)}
                    step={0.1}
                    value={Math.min(elapsed, Math.max(totalDuration, 1))}
                    onChange={(event) => seek(Number(event.target.value))}
                    disabled={progressDisabled}
                    aria-label="Progreso de la canción"
                    aria-valuetext={`${formatTime(elapsed)} de ${formatTime(totalDuration)}`}
                    className="audio-range min-w-0 flex-1"
                    style={rangeStyle(progress)}
                  />
                  <span className="w-10 shrink-0 text-right font-mono text-[9px] tracking-[0.08em] text-ash">
                    {formatTime(totalDuration || null)}
                  </span>
                </div>

                {error ? (
                  <p role="status" className="font-mono text-[8px] tracking-[0.12em] text-fire">
                    {error}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="mt-3 flex items-center gap-2 font-mono text-[8px] tracking-[0.14em] text-white/35">
              <ArrowUpRight size={11} aria-hidden="true" />
              LA REPRODUCCIÓN CONTINÚA AL EXPLORAR OTRO DISCO O AL SALIR DE
              ESTA SECCIÓN.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
