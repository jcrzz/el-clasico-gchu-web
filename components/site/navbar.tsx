"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Mail, Menu, X } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/social-icons";
import { cn, whatsappUrl } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const links = [
  { href: "#inicio", label: "INICIO" },
  { href: "#historia", label: "HISTORIA" },
  { href: "#la-hermandad", label: "LA HERMANDAD" },
  { href: "#musica", label: "MÚSICA" },
  { href: "#shows", label: "SHOWS" },
  { href: "#fotos", label: "FOTOS" },
  { href: "#epk", label: "EPK" },
  { href: "#contacto", label: "CONTACTO" },
];

export function Navbar({ settings }: { settings: SiteSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#inicio");
  const reduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = links
      .map((link) => document.querySelector<HTMLElement>(link.href))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menuRef.current) return;

      const focusables = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetParent !== null);

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
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled
            ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent",
        )}
      >
        <div className="mx-auto flex h-[76px] w-full max-w-[92rem] items-center justify-between gap-6 px-[clamp(1.25rem,4.2vw,4.5rem)]">
          <a
            href="#inicio"
            onClick={() => setOpen(false)}
            className="group flex shrink-0 items-baseline gap-2.5"
            aria-label="El Clásico — Inicio"
          >
            <span className="display text-[1.65rem] leading-none tracking-[0.01em] text-bone transition-colors group-hover:text-fire">
              EL CLÁSICO
            </span>
            <span
              aria-hidden="true"
              className="hidden h-1.5 w-1.5 bg-fire sm:block"
            />
            <span className="hidden font-mono text-[9px] tracking-[0.18em] text-ash lg:inline">
              GCHÚ · AR
            </span>
          </a>

          <nav className="hidden items-center gap-4 lg:flex xl:gap-6" aria-label="Secciones del sitio">
            {links.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative py-2 font-mono text-[10px] tracking-[0.13em] transition-colors",
                    isActive ? "text-bone" : "text-ash hover:text-bone",
                  )}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-px left-0 h-px bg-fire transition-transform duration-300",
                      isActive
                        ? "w-full scale-x-100"
                        : "w-full origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100",
                    )}
                  />
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 py-2 font-mono text-[10px] tracking-[0.16em] text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Abrir menú de navegación"
          >
            MENÚ
            <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "-2%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "-2%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink lg:hidden"
          >
            <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-fire/20 blur-[110px]" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-amber/10 blur-[100px]" />

            <div className="relative flex h-[76px] shrink-0 items-center justify-between px-5">
              <span className="display text-[1.65rem] leading-none text-bone">
                EL CLÁSICO
              </span>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-2 font-mono text-[10px] tracking-[0.16em] text-bone"
                aria-label="Cerrar menú"
              >
                CERRAR
                <X size={20} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Secciones del sitio"
              className="relative flex flex-1 flex-col justify-center px-5 py-8"
            >
              {links.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={reduceMotion ? false : { opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.06 + index * 0.035,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group flex items-center justify-between border-b border-white/10 py-3.5"
                >
                  <span
                    className={cn(
                      "display text-[clamp(2.2rem,8.6vw,3.6rem)] leading-none transition-colors",
                      active === link.href
                        ? "text-fire"
                        : "text-bone group-hover:text-fire",
                    )}
                  >
                    {link.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 shrink-0 bg-white/15 transition-colors group-hover:bg-fire"
                  />
                </motion.a>
              ))}
            </nav>

            <div className="relative shrink-0 border-t border-white/10 px-5 py-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href={whatsappUrl(settings.whatsapp, settings.whatsappMessage)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-wa"
                >
                  <WhatsAppIcon className="h-[15px] w-[15px]" />
                  WHATSAPP
                </a>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-ash"
                >
                  <Mail size={15} aria-hidden="true" />
                  {settings.email}
                </a>
                <a
                  href={settings.socials[0]?.href ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-ash"
                >
                  <InstagramIcon className="h-[15px] w-[15px]" />
                  INSTAGRAM
                </a>
              </div>
              <p className="mt-4 font-mono text-[9px] tracking-[0.2em] text-white/50">
                {settings.city.toUpperCase()} · {settings.province.toUpperCase()} · {settings.country.toUpperCase()}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
