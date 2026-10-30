"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { DEFAULT_VOLUME, usePlayer } from "@/components/audio/audio-provider";
import { cn, rangeStyle } from "@/lib/utils";

type VolumeControlSize = "sm" | "md";
type VolumeControlVariant = "auto" | "mobile" | "desktop";

const SIZES: Record<VolumeControlSize, { button: string; icon: number }> = {
  sm: { button: "h-8 w-8", icon: 14 },
  md: { button: "h-9 w-9", icon: 15 },
};

function isIOSDevice() {
  if (typeof navigator === "undefined") return false;
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function VolumeControl({
  size = "sm",
  variant = "auto",
  className,
}: {
  size?: VolumeControlSize;
  variant?: VolumeControlVariant;
  className?: string;
}) {
  const { volume, muted, changeVolume, toggleMute } = usePlayer();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();
  const panelId = useId();

  // El panel sólo existe después de una interacción del usuario, así que
  // detectar iOS en render no rompe la hidratación.
  const isIOS = isIOSDevice();
  const level = muted ? 0 : volume;
  const percent = Math.round(level * 100);
  const silent = level === 0;
  const Icon = silent ? VolumeX : Volume2;
  const sizes = SIZES[size];

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const desktop = window.matchMedia("(min-width: 640px)");
    const onMediaChange = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onMediaChange);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onMediaChange);
    };
  }, [open]);

  useEffect(() => {
    if (!open || isIOS) return;
    sliderRef.current?.focus({ preventScroll: true });
  }, [isIOS, open]);

  function toggleSound() {
    if (volume === 0) {
      changeVolume(DEFAULT_VOLUME);
      return;
    }
    toggleMute();
  }

  return (
    <div
      ref={wrapRef}
      className={cn("relative flex items-center gap-2", className)}
    >
      {variant === "desktop" ? null : (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Cerrar control de volumen" : "Ajustar volumen"}
          className={cn(
            "flex items-center justify-center border text-ash transition-colors hover:border-fire hover:text-bone sm:hidden",
            open ? "border-fire text-bone" : "border-white/12",
            sizes.button,
          )}
        >
          <Icon size={sizes.icon} aria-hidden="true" />
        </button>
      )}

      {variant === "mobile" ? null : (
        <>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={silent ? "Activar sonido" : "Silenciar"}
            aria-pressed={muted}
            className={cn(
              "hidden items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire hover:text-bone sm:flex",
              sizes.button,
            )}
          >
            <Icon size={sizes.icon} aria-hidden="true" />
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={level}
            onChange={(event) => changeVolume(Number(event.target.value))}
            aria-label="Volumen"
            className="audio-range hidden w-20 sm:block"
            style={rangeStyle(percent)}
          />
        </>
      )}

      <AnimatePresence>
        {open && variant !== "desktop" ? (
          <motion.div
            key="volume-panel"
            id={panelId}
            role="group"
            aria-label="Control de volumen"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{
              duration: reduceMotion ? 0.12 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute bottom-full right-0 z-30 mb-2 w-56 border border-white/15 bg-carbon p-2.5 shadow-[0_18px_45px_rgba(0,0,0,.6)] sm:hidden"
          >
            <div className="flex items-center justify-between font-mono text-[7px] tracking-[0.18em]">
              <span className="text-ash">VOLUMEN</span>
              <span className={silent ? "text-amber/90" : "text-bone"}>
                {percent}%
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSound}
                aria-label={silent ? "Activar sonido" : "Silenciar"}
                aria-pressed={muted}
                className="flex h-7 w-7 shrink-0 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire hover:text-bone"
              >
                <Icon size={13} aria-hidden="true" />
              </button>

              {isIOS ? (
                <p className="font-mono text-[7px] leading-relaxed tracking-[0.1em] text-amber/80">
                  EN IPHONE USÁ LOS BOTONES DEL TELÉFONO.
                </p>
              ) : (
                <input
                  ref={sliderRef}
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={level}
                  onChange={(event) =>
                    changeVolume(Number(event.target.value))
                  }
                  aria-label="Volumen"
                  className="audio-range min-w-0 flex-1"
                  style={rangeStyle(percent)}
                />
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
