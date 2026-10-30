"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, CalendarPlus, FileText, HandCoins, Images, Radio, Ticket } from "lucide-react";
import { splitShowsByDate } from "@/lib/shows";
import { useToday } from "@/lib/use-today";
import { cn } from "@/lib/utils";
import { useAdmin } from "./admin-provider";
import { ArchiveBadge, AdminPageHeader, StatusBadge } from "./ui";

function dateParts(date: string) {
  const parsed = new Date(`${date}T12:00:00-03:00`);
  const day = new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(parsed);
  const month = new Intl.DateTimeFormat("es-AR", {
    month: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  })
    .format(parsed)
    .replace(".", "")
    .toUpperCase();
  const year = new Intl.DateTimeFormat("es-AR", {
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(parsed);

  return { day, month, year };
}

export function DashboardHome() {
  const { data, session, isDemo } = useAdmin();
  const today = useToday();
  const { upcoming, past } = splitShowsByDate(data.shows, today);
  const activeUpcoming = upcoming.filter(
    (show) => show.status !== "paused",
  );
  const next = activeUpcoming[0] ?? null;
  const soldOut = activeUpcoming.filter(
    (show) => show.status === "sold-out",
  ).length;
  const active = activeUpcoming.length;
  const nextDate = next ? dateParts(next.date) : null;

  const stats = [
    {
      label: "FECHAS ACTIVAS",
      value: String(active).padStart(2, "0"),
      detail: `${String(past.length).padStart(2, "0")} EN ARCHIVO`,
    },
    { label: "SOLD OUT", value: String(soldOut).padStart(2, "0") },
    { label: "IMÁGENES", value: String(data.gallery.length).padStart(2, "0") },
    {
      label: "DESCARGABLES",
      value: String(data.epk.downloads.length).padStart(2, "0"),
    },
    {
      label: "FORMAS DE APORTE",
      value: String(data.support.tiers.length).padStart(2, "0"),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        index="01"
        title="Cabina"
        description="El estado de la gira y del archivo de la banda, de un vistazo. Todo lo que se publica en el sitio entra por acá."
        actions={
          <Link href="/admin/shows" className="btn btn-solid">
            GESTIONAR FECHAS
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        }
      />

      <section
        aria-label="Resumen de contenido"
        className="grid grid-cols-2 border-l border-t border-white/12 lg:grid-cols-5"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-b border-r border-white/12 px-4 py-5 sm:px-5"
          >
            <p className="font-mono text-[8px] tracking-[0.16em] text-ash">
              {stat.label}
            </p>
            <p className="display mt-2 text-[clamp(2.4rem,5vw,4rem)] leading-none text-bone">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <section className="relative overflow-hidden border border-white/12 bg-carbon">
            <div className="absolute inset-y-0 left-0 w-[3px] bg-fire" />
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-7">
              <p className="font-mono text-[9px] tracking-[0.18em] text-fire">
                PRÓXIMA FECHA
              </p>
              {next ? <StatusBadge status={next.status} /> : null}
            </div>

            {next && nextDate ? (
              <div className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:p-7">
                <div className="flex items-end gap-3 border-b border-white/10 pb-5 sm:block sm:border-b-0 sm:border-r sm:pb-0 sm:pr-8">
                  <p className="display text-[clamp(5rem,11vw,8.5rem)] leading-[0.7] text-bone">
                    {nextDate.day}
                  </p>
                  <div className="pb-1 sm:mt-2 sm:pb-0">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-fire">
                      {nextDate.month}
                    </p>
                    <p className="font-mono text-[9px] tracking-[0.14em] text-ash">
                      {nextDate.year}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-6">
                  <div>
                    <p className="display text-[clamp(2.2rem,4.8vw,4.2rem)] leading-[0.85] text-bone">
                      {next.city}
                    </p>
                    <p className="mt-2 text-[0.92rem] text-ash">
                      {next.venue}
                      {next.time ? ` / ${next.time} HS` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/admin/shows" className="btn btn-ghost">
                      EDITAR FECHA
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                    {next.ticketUrl ? (
                      <a
                        href={next.ticketUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.12em] text-ash transition-colors hover:text-amber"
                      >
                        <Ticket size={13} aria-hidden="true" />
                        VER VENTA
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 sm:p-7">
                <div className="flex flex-col items-start gap-3 text-amber">
                  <ArchiveBadge />
                  <p className="font-mono text-[10px] tracking-[0.16em]">
                    SIN FECHAS PROGRAMADAS EN RUTA
                  </p>
                  <p className="text-[0.84rem] text-ash">
                    Cuando agregues la próxima fecha, va a aparecer acá y en el sitio público.
                  </p>
                </div>
                <Link
                  href="/admin/shows?nueva=1"
                  className="btn btn-fire inline-flex items-center gap-2"
                >
                  <CalendarPlus size={14} aria-hidden="true" />
                  PROGRAMAR FECHA
                </Link>
              </div>
            )}
          </section>

          <section className="border border-white/12 bg-carbon">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-7">
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                RUTA / PRÓXIMAS FUNCIONES
              </p>
              <Link
                href="/admin/shows"
                className="font-mono text-[8px] tracking-[0.12em] text-amber transition-colors hover:text-bone"
              >
                VER TODAS
              </Link>
            </div>
            {past.length > 0 ? (
              <ul className="divide-y divide-white/10">
                {past.slice(0, 5).map((show) => {
                  const parts = dateParts(show.date);
                  return (
                    <li
                      key={show.id}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.025] sm:px-7"
                    >
                      <div className="flex w-14 items-baseline gap-1">
                        <span className="display text-2xl text-bone">
                          {parts.day}
                        </span>
                        <span className="font-mono text-[8px] text-fire/60">
                          {parts.month}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[0.86rem] text-bone/80">
                          {show.city}
                          <span className="text-ash/60"> / {show.venue}</span>
                        </p>
                        <p className="font-mono text-[8px] tracking-[0.1em] text-white/30">
                          {show.country === "AR" ? "ARGENTINA" : "URUGUAY"}
                          {show.time ? ` / ${show.time}` : ""}
                        </p>
                      </div>
                      <ArchiveBadge year={show.date.slice(0, 4)} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="px-5 py-8 text-[0.82rem] text-ash sm:px-7">
                No hay funciones realizadas.
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="border border-white/12 bg-carbon">
            <div className="border-b border-white/10 px-5 py-3.5">
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                ACCESOS DIRECTOS
              </p>
            </div>
            <div className="divide-y divide-white/10">
              {[
                {
                  href: "/admin/shows",
                  label: "FECHAS",
                  detail: `${active} publicadas`,
                  icon: CalendarDays,
                },
                {
                  href: "/admin/galeria",
                  label: "GALERÍA",
                  detail: `${data.gallery.length} imágenes`,
                  icon: Images,
                },
                {
                  href: "/admin/epk",
                  label: "PRESS KIT",
                  detail: `${data.epk.downloads.length} descargables`,
                  icon: FileText,
                },
                {
                  href: "/admin/apoyos",
                  label: "APORTES",
                  detail: `${data.support.tiers.length} formas`,
                  icon: HandCoins,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/[0.025]"
                  >
                    <Icon
                      size={15}
                      className="text-ash transition-colors group-hover:text-fire"
                      aria-hidden="true"
                    />
                    <span className="flex-1 font-mono text-[9px] tracking-[0.12em] text-bone">
                      {item.label}
                    </span>
                    <span className="font-mono text-[8px] text-white/35">
                      {item.detail}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-amber"
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="border border-white/12 bg-carbon">
            <div className="border-b border-white/10 px-5 py-3.5">
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                ESTADO DEL SISTEMA
              </p>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[8px] tracking-[0.12em] text-white/40">
                    CONTENIDO
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-[0.84rem] text-bone">
                    <Radio size={13} className="text-fire" aria-hidden="true" />
                    {isDemo ? "Modo demo local" : "Supabase conectado"}
                  </p>
                </div>
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5",
                    isDemo ? "bg-amber" : "bg-bone/60",
                  )}
                  aria-hidden="true"
                />
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="font-mono text-[8px] tracking-[0.12em] text-white/40">
                  ESCRITURA
                </p>
                <p className="mt-1 text-[0.84rem] text-bone">
                  {session.writeEnabled ? "Habilitada" : "Sólo lectura"}
                </p>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-ash">
                  {session.writeEnabled
                    ? "Los cambios invalidan el cache público al guardar."
                    : "Falta SUPABASE_SERVICE_ROLE_KEY en el entorno."}
                </p>
              </div>
              <div className="border-t border-white/10 pt-4">
                <p className="font-mono text-[8px] tracking-[0.12em] text-white/40">
                  SITIO PÚBLICO
                </p>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 inline-flex items-center gap-1.5 text-[0.84rem] text-bone transition-colors hover:text-amber"
                >
                  elclasico.com.ar
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
