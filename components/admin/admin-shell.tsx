"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  HandCoins,
  Images,
  LayoutDashboard,
  LogOut,
  Radio,
  RotateCcw,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { logoutAction } from "@/lib/admin/actions/auth";
import { cn } from "@/lib/utils";
import { useAdmin } from "./admin-provider";
import { Spinner } from "./ui";

const navItems = [
  { href: "/admin", label: "Cabina", index: "01", icon: LayoutDashboard },
  { href: "/admin/shows", label: "Fechas", index: "02", icon: CalendarDays },
  { href: "/admin/galeria", label: "Galería", index: "03", icon: Images },
  { href: "/admin/epk", label: "Press kit", index: "04", icon: FileText },
  { href: "/admin/apoyos", label: "Aportes", index: "05", icon: HandCoins },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "flex items-center gap-2.5 font-mono text-[9px] tracking-[0.14em] text-ash transition-colors hover:text-fire disabled:opacity-50",
        compact &&
          "h-9 w-9 justify-center border border-white/12 hover:border-fire/50",
      )}
      aria-label="Cerrar sesión"
    >
      {pending ? <Spinner /> : <LogOut size={14} aria-hidden="true" />}
      {compact ? null : "CERRAR SESIÓN"}
    </button>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data, session, isDemo, resetDemo } = useAdmin();
  const [resetArmed, setResetArmed] = useState(false);

  const activeShows = data.shows.filter(
    (show) => show.status !== "paused",
  ).length;
  const counts: Record<string, string> = {
    "/admin": String(activeShows).padStart(2, "0"),
    "/admin/shows": String(activeShows).padStart(2, "0"),
    "/admin/galeria": String(data.gallery.length).padStart(2, "0"),
    "/admin/epk": String(data.epk.downloads.length).padStart(2, "0"),
    "/admin/apoyos": String(data.support.tiers.length).padStart(2, "0"),
  };

  return (
    <div className="min-h-dvh bg-ink text-bone">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[288px] flex-col border-r border-white/12 bg-[#080808] lg:flex">
        <div className="border-b border-white/12 px-6 py-6">
          <Link
            href="/admin"
            className="display inline-block text-[2.25rem] leading-none text-bone transition-colors hover:text-fire"
          >
            EL CLÁSICO
          </Link>
          <div className="mt-2 flex items-center gap-2 font-mono text-[8px] tracking-[0.18em] text-ash">
            <Radio size={11} className="text-fire" aria-hidden="true" />
            CABINA / CONTROL DE CONTENIDO
          </div>
        </div>

        <nav aria-label="Secciones del panel" className="flex-1 px-3 py-6">
          <p className="px-3 pb-3 font-mono text-[8px] tracking-[0.2em] text-white/35">
            SETLIST DEL SITIO
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3.5 px-3 py-3.5 transition-colors",
                      active
                        ? "bg-white/[0.045] text-bone"
                        : "text-ash hover:bg-white/[0.025] hover:text-bone",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="admin-nav-active"
                        className="absolute inset-y-0 left-0 w-[2px] bg-fire"
                        transition={{ duration: 0.25 }}
                      />
                    ) : null}
                    <span className="w-6 font-mono text-[8px] tracking-[0.12em] text-white/30">
                      {item.index}
                    </span>
                    <Icon
                      size={15}
                      strokeWidth={1.6}
                      className={cn(
                        active ? "text-fire" : "text-ash group-hover:text-amber",
                      )}
                      aria-hidden="true"
                    />
                    <span className="flex-1 font-mono text-[10px] tracking-[0.1em]">
                      {item.label.toUpperCase()}
                    </span>
                    <span className="font-mono text-[8px] text-white/30">
                      {counts[item.href]}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 border-t border-white/10 pt-5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center justify-between px-3 py-2 font-mono text-[9px] tracking-[0.12em] text-ash transition-colors hover:text-amber"
            >
              VER SITIO PÚBLICO
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </nav>

        <div className="border-t border-white/12 p-4">
          <div className="border border-white/10 bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[8px] tracking-[0.16em] text-white/35">
                SESIÓN
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 font-mono text-[7px] tracking-[0.14em]",
                  isDemo ? "text-amber" : "text-bone/80",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1 w-1",
                    isDemo ? "bg-amber" : "bg-bone/60",
                  )}
                />
                {isDemo ? "DEMO" : "SUPABASE"}
              </span>
            </div>
            <p className="mt-2 truncate text-[0.72rem] text-bone/80">
              {session.email}
            </p>
            {!session.writeEnabled ? (
              <p className="mt-2 font-mono text-[7px] leading-relaxed tracking-[0.08em] text-amber">
                SÓLO LECTURA / FALTA SERVICE ROLE
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-between gap-3">
              <form action={logoutAction}>
                <LogoutButton />
              </form>
              {isDemo ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!resetArmed) {
                      setResetArmed(true);
                      return;
                    }
                    resetDemo();
                    setResetArmed(false);
                  }}
                  className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.1em] text-ash transition-colors hover:text-amber"
                >
                  <RotateCcw size={11} aria-hidden="true" />
                  {resetArmed ? "CONFIRMAR" : "RESET"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[288px]">
        <header className="sticky top-0 z-30 border-b border-white/12 bg-ink/90 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <Link
              href="/admin"
              className="display text-[1.65rem] leading-none text-bone"
            >
              EL CLÁSICO
            </Link>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "font-mono text-[7px] tracking-[0.14em]",
                  isDemo ? "text-amber" : "text-bone/80",
                )}
              >
                {isDemo ? "DEMO" : "SUPABASE"}
              </span>
              <form action={logoutAction}>
                <LogoutButton compact />
              </form>
            </div>
          </div>
          <nav
            aria-label="Secciones del panel"
            className="flex overflow-x-auto border-t border-white/10"
          >
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative shrink-0 px-4 py-3 font-mono text-[9px] tracking-[0.1em] transition-colors",
                    active ? "text-bone" : "text-ash",
                  )}
                >
                  {item.label.toUpperCase()}
                  {active ? (
                    <span className="absolute inset-x-4 bottom-0 h-[2px] bg-fire" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="admin-grid-bg min-h-dvh px-4 py-8 sm:px-6 lg:px-10 lg:py-10 xl:px-14">
          {isDemo ? (
            <div className="mb-6 flex flex-col gap-3 border border-amber/25 bg-amber/[0.055] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-mono text-[9px] leading-relaxed tracking-[0.06em] text-amber/90">
                MODO DEMO / Los cambios se guardan en este navegador. Los
                archivos viven sólo durante esta sesión.
              </p>
              <span className="font-mono text-[7px] tracking-[0.16em] text-amber/60">
                SIN SUPABASE
              </span>
            </div>
          ) : null}
          {!session.writeEnabled ? (
            <div className="mb-6 border border-fire/30 bg-fire/[0.05] px-4 py-3">
              <p className="font-mono text-[9px] leading-relaxed tracking-[0.06em] text-fire/90">
                MODO LECTURA / Agregá SUPABASE_SERVICE_ROLE_KEY para guardar
                cambios y subir archivos.
              </p>
            </div>
          ) : null}
          {children}
          <footer className="mt-10 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-2 font-mono text-[7px] tracking-[0.14em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
              <span>EL CLÁSICO / CABINA DE CONTENIDO</span>
              <span>GUALEGUAYCHÚ, ENTRE RÍOS / AR</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
