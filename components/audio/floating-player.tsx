"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  LoaderCircle,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { VolumeControl } from "@/components/audio/volume-control";
import { AlbumCover } from "@/components/art/album-cover";
import { cn, formatTime, rangeStyle } from "@/lib/utils";
import { usePlayer } from "./audio-provider";

export function FloatingPlayer() {
  const {
    current,
    status,
    isPlaying,
    currentTime,
    duration,
    sessionVisible,
    toggle,
    next,
    previous,
    seek,
    stop,
  } = usePlayer();
  const reduceMotion = useReducedMotion();

  const visible = Boolean(current) && !sessionVisible;
  const totalDuration =
    (duration || current?.track.durationSeconds || 0) as number;
  const progress =
    totalDuration > 0 ? (Math.min(currentTime, totalDuration) / totalDuration) * 100 : 0;

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") stop();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stop, visible]);

  function scrollToSession() {
    document.getElementById("sesion-de-escucha")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }

  return (
    <>
      <AnimatePresence>
        {visible && current ? (
          <motion.div
            key="floating-player"
            role="region"
            aria-label="Reproductor flotante"
            initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={{
              duration: reduceMotion ? 0.15 : 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-800 bg-[#0a0a0a]/95 backdrop-blur-md"
          >
            <div className="mx-auto max-w-[100rem] px-4 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2.5 sm:px-6">
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_auto] sm:items-center sm:gap-6">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={scrollToSession}
                    className="group flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-label="Ir a la sesión de escucha"
                  >
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden border border-white/12">
                      <AlbumCover album={current.album} compact />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 shrink-0",
                            isPlaying ? "bg-fire" : "bg-white/30",
                          )}
                        />
                        <span className="truncate font-mono text-[7px] tracking-[0.18em] text-ash">
                          {isPlaying ? "REPRODUCIENDO" : "EN PAUSA"} · DISCO{" "}
                          {current.album.number}
                        </span>
                      </span>
                      <span className="display mt-1 block truncate text-[1.05rem] leading-none text-bone transition-colors group-hover:text-fire">
                        {current.track.title}
                      </span>
                      <span className="mt-1 block truncate font-mono text-[8px] tracking-[0.12em] text-ash">
                        {current.album.title}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={stop}
                    aria-label="Cerrar reproductor"
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire hover:text-fire sm:hidden"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>

                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={previous}
                    aria-label="Tema anterior"
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire hover:text-bone"
                  >
                    <SkipBack size={14} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={isPlaying ? "Pausar" : "Reproducir"}
                    className="flex h-10 w-10 shrink-0 items-center justify-center bg-fire text-ink transition-colors hover:bg-amber"
                  >
                    {status === "loading" ? (
                      <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
                    ) : isPlaying ? (
                      <Pause size={17} fill="currentColor" aria-hidden="true" />
                    ) : (
                      <Play
                        size={17}
                        fill="currentColor"
                        className="ml-[1px]"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={next}
                    aria-label="Tema siguiente"
                    className="flex h-8 w-8 shrink-0 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire hover:text-bone"
                  >
                    <SkipForward size={14} aria-hidden="true" />
                  </button>

                  <span className="hidden w-9 shrink-0 text-right font-mono text-[9px] text-ash sm:block">
                    {formatTime(currentTime)}
                  </span>

                  <input
                    type="range"
                    min={0}
                    max={Math.max(totalDuration, 1)}
                    step={0.1}
                    value={Math.min(currentTime, Math.max(totalDuration, 1))}
                    onChange={(event) => seek(Number(event.target.value))}
                    disabled={totalDuration <= 0}
                    aria-label="Progreso de la canción"
                    aria-valuetext={`${formatTime(currentTime)} de ${formatTime(totalDuration)}`}
                    className="audio-range min-w-0 flex-1"
                    style={rangeStyle(progress)}
                  />

                  <span className="hidden w-9 shrink-0 font-mono text-[9px] text-ash sm:block">
                    {formatTime(totalDuration || null)}
                  </span>

                  <VolumeControl size="sm" variant="mobile" className="sm:hidden" />
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <VolumeControl size="sm" variant="desktop" />
                  <button
                    type="button"
                    onClick={stop}
                    aria-label="Cerrar reproductor"
                    className="flex h-8 w-8 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire hover:text-fire"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {visible ? <div aria-hidden="true" className="h-32 sm:h-20" /> : null}
    </>
  );
}
