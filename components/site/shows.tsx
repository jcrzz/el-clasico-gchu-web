"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Archive,
  ArrowUpRight,
  ChevronDown,
  Ticket,
  TriangleAlert,
} from "lucide-react";
import { splitShowsByDate } from "@/lib/shows";
import type { CountryCode, Show } from "@/lib/types";
import { useToday } from "@/lib/use-today";
import { cn, countryName, parseShowDate, whatsappUrl } from "@/lib/utils";

type Filter = "all" | CountryCode;

const ARCHIVE_LIMIT = 6;

const tabs: { key: Filter; label: string }[] = [
  { key: "all", label: "TODOS" },
  { key: "AR", label: "ARGENTINA" },
  { key: "UY", label: "URUGUAY" },
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function Shows({
  shows,
  serverToday,
  whatsapp,
  whatsappMessage,
}: {
  shows: Show[];
  serverToday: string;
  whatsapp: string;
  whatsappMessage: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [archiveExpanded, setArchiveExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const today = useToday(serverToday);

  const { upcoming, past } = useMemo(() => {
    const published = shows.filter((show) => show.status !== "paused");
    return splitShowsByDate(published, today);
  }, [shows, today]);

  const filteredUpcoming = useMemo(
    () =>
      filter === "all"
        ? upcoming
        : upcoming.filter((show) => show.country === filter),
    [filter, upcoming],
  );

  const filteredPast = useMemo(
    () =>
      filter === "all" ? past : past.filter((show) => show.country === filter),
    [filter, past],
  );

  const counts = useMemo(
    () => ({
      all: upcoming.length,
      AR: upcoming.filter((show) => show.country === "AR").length,
      UY: upcoming.filter((show) => show.country === "UY").length,
    }),
    [upcoming],
  );

  const archiveGroups = useMemo(() => {
    const visible = archiveExpanded
      ? filteredPast
      : filteredPast.slice(0, ARCHIVE_LIMIT);
    const groups: { year: string; shows: Show[] }[] = [];

    for (const show of visible) {
      const year = show.date.slice(0, 4);
      const last = groups[groups.length - 1];
      if (last?.year === year) last.shows.push(show);
      else groups.push({ year, shows: [show] });
    }

    return groups;
  }, [archiveExpanded, filteredPast]);

  const visiblePastCount = archiveExpanded
    ? filteredPast.length
    : Math.min(filteredPast.length, ARCHIVE_LIMIT);
  const hiddenPastCount = filteredPast.length - visiblePastCount;

  const archiveYearRange = useMemo(() => {
    if (!filteredPast.length) return "";
    const newest = filteredPast[0].date.slice(0, 4);
    const oldest = filteredPast[filteredPast.length - 1].date.slice(0, 4);
    return newest === oldest ? newest : `${oldest}—${newest}`;
  }, [filteredPast]);

  const hasUpcoming = upcoming.length > 0;

  return (
    <section
      id="shows"
      className="section relative border-t border-white/10 bg-carbon"
      aria-labelledby="shows-title"
    >
      <div className="pointer-events-none absolute right-0 top-24 h-[380px] w-[520px] ambient-fire opacity-30" />
      <div className="shell relative">
        <header className="mb-12 md:mb-14">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="mt-2 hidden h-3 w-3 shrink-0 bg-fire md:block" />
              <h2
                id="shows-title"
                className="display text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.82]"
              >
                PRÓXIMOS SHOWS
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-end">
              <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:text-right">
                Encontranos en vivo. Vení a ser parte de La Hermandad.
              </p>
              {past.length ? (
                <a
                  href="#archivo"
                  className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 font-mono text-[8px] tracking-[0.14em] text-ash transition-colors hover:border-amber/60 hover:text-amber"
                >
                  <Archive size={11} aria-hidden="true" />
                  ARCHIVO [{pad(past.length)}]
                  <ChevronDown size={11} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        </header>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div
            role="group"
            aria-label="Filtrar shows por país"
            className="no-scrollbar flex w-full overflow-x-auto sm:w-auto"
          >
            {tabs.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(tab.key);
                    setArchiveExpanded(false);
                  }}
                  className={cn(
                    "-ml-px flex items-center gap-2 border px-4 py-2.5 font-mono text-[9px] tracking-[0.14em] transition-colors first:ml-0 sm:px-5",
                    active
                      ? "border-bone bg-bone text-ink"
                      : "border-white/15 text-ash hover:border-white/35 hover:text-bone",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "font-mono text-[8px]",
                      active ? "text-ink/70" : "text-white/50",
                    )}
                  >
                    {pad(counts[tab.key])}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="hidden font-mono text-[9px] tracking-[0.18em] text-ash sm:block">
            GIRA 2026
            <span className="mx-2 text-fire">/</span>
            {pad(upcoming.length)} PRÓXIMAS
          </p>
        </div>

        <div className="hidden grid-cols-[160px_1fr_auto] gap-6 border-b border-white/15 pb-2 font-mono text-[8px] tracking-[0.2em] text-white/50 md:grid">
          <span>FECHA</span>
          <span>PLAZA / RECINTO</span>
          <span className="text-right">ENTRADAS</span>
        </div>

        {filteredUpcoming.length ? (
          <motion.div layout className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {filteredUpcoming.map((show) => {
                const date = parseShowDate(show.date);
                const soldOut = show.status === "sold-out";
                const freeEntry = show.freeEntry ?? false;

                return (
                  <motion.article
                    key={show.id}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="show-row group grid grid-cols-[64px_1fr] items-center gap-x-4 gap-y-4 border-b border-white/10 py-5 md:grid-cols-[160px_1fr_auto] md:gap-6 md:py-6"
                  >
                    <div className="flex items-baseline gap-3 md:border-r md:border-dashed md:border-white/15 md:pr-6">
                      <p className="display text-[2.75rem] leading-[0.75] text-bone transition-colors duration-300 group-hover:text-fire md:text-[3.1rem]">
                        {date.day}
                      </p>
                      <div className="font-mono text-[8px] leading-[1.5] tracking-[0.14em] text-ash">
                        <p className="text-bone/75">{date.month}</p>
                        <p>{date.year}</p>
                        <p className="mt-1 text-white/50">{date.weekday}</p>
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="border border-white/20 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.08em] text-ash">
                          {show.country}
                        </span>
                        <h3 className="display truncate text-[clamp(1.5rem,2.7vw,2rem)] leading-none text-bone">
                          {show.city}
                          <span className="text-ash">, {countryName(show.country)}</span>
                        </h3>
                      </div>
                      <p className="mt-1.5 truncate font-mono text-[10px] tracking-[0.08em] text-ash">
                        {show.venue}
                        {show.time ? (
                          <span className="text-white/50"> · {show.time}</span>
                        ) : null}
                      </p>
                    </div>

                    <div className="col-span-2 md:col-span-1 md:justify-self-end">
                      {freeEntry ? (
                        <span className="inline-flex w-full items-center justify-center gap-2 border border-white/20 px-4 py-3 font-mono text-[9px] tracking-[0.14em] text-bone md:w-auto">
                          <Ticket size={13} aria-hidden="true" />
                          ENTRADA LIBRE Y GRATUITA
                        </span>
                      ) : soldOut ? (
                        <span className="inline-flex w-full items-center justify-center gap-2 border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-[9px] tracking-[0.14em] text-ash/60 md:w-auto">
                          <Ticket size={13} aria-hidden="true" />
                          AGOTADO
                        </span>
                      ) : (
                        <a
                          href={show.ticketUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group/ticket flex w-full items-center justify-center gap-2 border border-white/20 px-4 py-3 font-mono text-[9px] tracking-[0.14em] text-bone transition-colors duration-300 hover:border-fire hover:bg-fire hover:text-ink md:w-auto"
                        >
                          COMPRAR ENTRADAS
                          <ArrowUpRight
                            size={13}
                            className="transition-transform duration-300 group-hover/ticket:-translate-y-0.5 group-hover/ticket:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </a>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-start gap-5 border-b border-white/10 py-14">
            <div className="flex items-center gap-3 text-amber">
              <TriangleAlert size={18} strokeWidth={1.5} aria-hidden="true" />
              <p className="font-mono text-[10px] tracking-[0.16em]">
                {hasUpcoming
                  ? "NO HAY FECHAS CONFIRMADAS EN ESTA PLAZA"
                  : "SIN FECHAS PROGRAMADAS EN RUTA"}
              </p>
            </div>
            <p className="prose-rock">
              {hasUpcoming
                ? "Estamos cerrando nuevas fechas. Escribinos y te avisamos apenas se anuncie el próximo show en tu ciudad."
                : "Estamos cerrando nuevas fechas. Escribinos y te avisamos apenas se anuncie la próxima función."}
            </p>
            <a
              href={whatsappUrl(whatsapp, whatsappMessage)}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost"
            >
              Avisame del próximo show
            </a>
          </div>
        )}

        {past.length ? (
          <section
            id="archivo"
            aria-labelledby="archive-title"
            className="mt-16 scroll-mt-28 border-t border-white/10 pt-10 md:mt-20 md:pt-12"
          >
            <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
              <div>
                <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-fire">
                  <Archive size={13} aria-hidden="true" />
                  BITÁCORA / TOUR ARCHIVE
                </div>
                <h3
                  id="archive-title"
                  className="display mt-3 text-[clamp(2rem,4.5vw,3.6rem)] leading-[0.85] text-bone/90"
                >
                  ARCHIVO DE RUTA
                </h3>
              </div>
              <p className="font-mono text-[9px] leading-relaxed tracking-[0.16em] text-ash md:text-right">
                {pad(filteredPast.length)} FUNCIONES REALIZADAS
                <span className="mx-2 text-fire">/</span>
                {archiveYearRange ? `REGISTRO ${archiveYearRange}` : "SIN REGISTROS"}
              </p>
            </div>

            {filteredPast.length ? (
              <>
                <div>
                  {archiveGroups.map((group) => (
                    <div key={group.year}>
                      <div className="flex items-center gap-4 border-b border-white/10 py-3.5">
                        <span className="display text-[2rem] leading-none text-white/20">
                          {group.year}
                        </span>
                        <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
                        <span className="font-mono text-[8px] tracking-[0.16em] text-white/35">
                          {pad(group.shows.length)} FUNCIONES
                        </span>
                      </div>

                      {group.shows.map((show) => {
                        const date = parseShowDate(show.date);

                        return (
                          <article
                            key={show.id}
                            className="group grid grid-cols-[64px_1fr] items-center gap-x-4 gap-y-4 border-b border-neutral-800/80 py-4 opacity-75 transition-opacity duration-300 hover:opacity-100 md:grid-cols-[150px_1fr_auto] md:gap-6 md:py-5"
                          >
                            <div className="flex items-baseline gap-3 md:border-r md:border-dashed md:border-white/10 md:pr-6">
                              <p className="display text-[2.2rem] leading-[0.75] text-bone/80 md:text-[2.5rem]">
                                {date.day}
                              </p>
                              <div className="font-mono text-[8px] leading-[1.5] tracking-[0.14em] text-ash/80">
                                <p className="text-bone/60">{date.month}</p>
                                <p>{date.year}</p>
                                <p className="mt-1 text-white/35">{date.weekday}</p>
                              </div>
                            </div>

                            <div className="min-w-0">
                              <h4 className="display truncate text-[clamp(1.25rem,2.2vw,1.65rem)] leading-none text-bone/85">
                                {show.city}
                                <span className="text-ash/80">
                                  , {countryName(show.country)}
                                </span>
                              </h4>
                              <p className="mt-1.5 truncate font-mono text-[10px] tracking-[0.08em] text-ash/80">
                                {show.venue}
                                {show.time ? (
                                  <span className="text-white/35"> · {show.time}</span>
                                ) : null}
                              </p>
                            </div>

                            <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 md:col-span-1 md:justify-self-end">
                              <span className="stencil inline-flex items-center gap-2 border border-white/15 bg-white/[0.02] px-3 py-2 text-[10px] tracking-[0.16em] text-ash/90">
                                <span
                                  aria-hidden="true"
                                  className="h-1 w-1 bg-fire/70"
                                />
                                SHOW REALIZADO
                              </span>
                              <span className="font-mono text-[8px] tracking-[0.12em] text-white/30">
                                ARCHIVO // {date.year}
                              </span>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {filteredPast.length > ARCHIVE_LIMIT ? (
                  <button
                    type="button"
                    onClick={() => setArchiveExpanded((current) => !current)}
                    aria-expanded={archiveExpanded}
                    className="group mt-5 flex w-full items-center justify-between gap-4 border border-white/15 px-4 py-3 font-mono text-[9px] tracking-[0.14em] text-ash transition-colors hover:border-amber/60 hover:text-amber"
                  >
                    <span>
                      {archiveExpanded
                        ? "CONTRAER ARCHIVO"
                        : `VER ARCHIVO COMPLETO [+${pad(hiddenPastCount)}]`}
                    </span>
                    <ChevronDown
                      size={14}
                      aria-hidden="true"
                      className={cn(
                        "transition-transform duration-300",
                        archiveExpanded && "rotate-180",
                      )}
                    />
                  </button>
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-start gap-3 border-b border-white/10 py-10">
                <p className="font-mono text-[10px] tracking-[0.16em] text-amber">
                  SIN REGISTROS EN ESTA PLAZA
                </p>
                <p className="prose-rock">
                  Todavía no hay funciones realizadas en este país. Mirá el
                  archivo completo para recorrer la ruta.
                </p>
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="btn btn-ghost mt-1"
                >
                  VER TODO EL ARCHIVO
                </button>
              </div>
            )}
          </section>
        ) : null}

        <p className="mt-5 font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/50">
          Las fechas y horarios pueden sufrir cambios. Las entradas se gestionan
          con la productora de cada plaza.
        </p>
      </div>
    </section>
  );
}
