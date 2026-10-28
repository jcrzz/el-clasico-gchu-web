"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import { LiveScene } from "@/components/art/live-scene";
import { CropMarks } from "@/components/ui/section-heading";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

function SceneLayer({
  image,
  priority = false,
  sizes,
}: {
  image: GalleryImage;
  priority?: boolean;
  sizes?: string;
}) {
  if (image.src) {
    return (
      <Image
        src={image.src}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  return (
    <LiveScene
      variant={image.scene}
      mono={image.mono}
      className="h-full w-full"
    />
  );
}

function spanClasses(span: GalleryImage["span"], index: number) {
  if (span === "tall") {
    return "aspect-[4/5] md:col-span-5 md:row-span-2 md:aspect-auto";
  }
  if (span === "wide") {
    return "aspect-[16/10] md:col-span-7 md:aspect-auto";
  }
  return cn(
    "aspect-[4/3] md:aspect-auto",
    index % 2 === 0 ? "md:col-span-3" : "md:col-span-4",
  );
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const next = useCallback(() => {
    setOpenIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  }, [images.length]);

  const previous = useCallback(() => {
    setOpenIndex((current) =>
      current === null
        ? null
        : (current - 1 + images.length) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
        return;
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), a[href]",
          ),
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex, close, next, previous]);

  const openImage = (index: number) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setOpenIndex(index);
  };

  const active = openIndex === null ? null : images[openIndex];

  return (
    <section
      id="fotos"
      className="section relative border-t border-white/10"
      aria-labelledby="fotos-title"
    >
      <div className="shell relative">
        <header className="mb-12 md:mb-16">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="mt-2 hidden h-3 w-3 shrink-0 bg-fire md:block" />
              <h2
                id="fotos-title"
                className="display text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.82]"
              >
                GALERÍA DE FOTOS
              </h2>
            </div>
            <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:pb-1 md:text-right">
              Noches que quedan. Un archivo de humo, luces y gente cantando.
            </p>
          </div>
        </header>

        <div className="relative">
          <CropMarks className="-inset-3 hidden md:block" />
          <div className="grid grid-cols-1 gap-3 md:h-[680px] md:grid-cols-12 md:grid-rows-2 md:gap-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => openImage(index)}
                aria-label={`Ampliar foto: ${image.alt}`}
                data-caption={image.caption}
                className={cn(
                  "group relative isolate overflow-hidden border border-white/10 bg-carbon text-left",
                  spanClasses(image.span, index),
                )}
              >
                <span className="absolute inset-0 block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]">
                  <SceneLayer
                    image={image}
                    sizes={
                      image.span === "tall"
                        ? "(min-width: 1024px) 38vw, 100vw"
                        : "(min-width: 1024px) 55vw, 100vw"
                    }
                  />
                </span>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-ink/25" />
                <span className="absolute left-4 top-4 font-mono text-[9px] tracking-[0.18em] text-bone/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
                  <span className="max-w-[80%] font-mono text-[9px] leading-relaxed tracking-[0.12em] text-bone/80">
                    {image.caption.toUpperCase()}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 translate-y-1 items-center justify-center border border-white/25 bg-ink/40 text-bone opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:border-fire group-hover:bg-fire group-hover:text-ink group-hover:opacity-100">
                    <Maximize2 size={14} strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-300 group-hover:border-fire/40" />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="font-mono text-[8px] tracking-[0.18em] text-white/50">
            ARCHIVO VISUAL / GIRA 2026
          </p>
          <p className="font-mono text-[8px] tracking-[0.18em] text-white/50">
            CLICK PARA AMPLIAR / ← → PARA NAVEGAR
          </p>
        </div>
      </div>

      <AnimatePresence>
        {active ? (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Galería de fotos: ${active.alt}`}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink/98 backdrop-blur-xl"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div className="flex h-[68px] shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-6">
              <p className="hidden font-mono text-[9px] tracking-[0.18em] text-ash sm:block">
                EL CLÁSICO / ARCHIVO
              </p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-bone">
                {String((openIndex ?? 0) + 1).padStart(2, "0")}
                <span className="mx-1 text-white/50">/</span>
                <span className="text-ash">
                  {String(images.length).padStart(2, "0")}
                </span>
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="flex items-center gap-2 py-2 font-mono text-[9px] tracking-[0.16em] text-bone transition-colors hover:text-fire"
                aria-label="Cerrar galería"
              >
                CERRAR
                <X size={18} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-16 sm:py-8"
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <button
                type="button"
                onClick={previous}
                className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-ink/50 text-bone backdrop-blur-sm transition-colors hover:border-fire hover:bg-fire hover:text-ink sm:left-4"
                aria-label="Foto anterior"
              >
                <ArrowLeft size={17} strokeWidth={1.5} aria-hidden="true" />
              </button>

              <motion.div
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full max-h-[76vh] w-full max-w-5xl overflow-hidden border border-white/10"
              >
                <SceneLayer image={active} sizes="(min-width: 1024px) 80vw, 100vw" priority />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-ink/20" />
              </motion.div>

              <button
                type="button"
                onClick={next}
                className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center border border-white/20 bg-ink/50 text-bone backdrop-blur-sm transition-colors hover:border-fire hover:bg-fire hover:text-ink sm:right-4"
                aria-label="Foto siguiente"
              >
                <ArrowRight size={17} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <div className="shrink-0 border-t border-white/10 px-4 py-4 sm:px-6">
              <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[9px] leading-relaxed tracking-[0.12em] text-bone/80">
                  {active.alt}
                </p>
                <p className="font-mono text-[8px] tracking-[0.16em] text-white/50">
                  ← → NAVEGAR / ESC CERRAR
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
