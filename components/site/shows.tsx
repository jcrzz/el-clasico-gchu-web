"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Ticket, TriangleAlert } from "lucide-react";
import type { CountryCode, Show } from "@/lib/types";
import { cn, countryName, parseShowDate, whatsappUrl } from "@/lib/utils";

type Filter = "all" | CountryCode;

const tabs: { key: Filter; label: string }[] = [
  { key: "all", label: "TODOS" },
  { key: "AR", label: "ARGENTINA" },
  { key: "UY", label: "URUGUAY" },
];

export function Shows({
  shows,
  whatsapp,
  whatsappMessage,
}: {
  shows: Show[];
  whatsapp: string;
  whatsappMessage: string;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const reduceMotion = useReducedMotion();

  const visibleShows = useMemo(
    () => shows.filter((show) => show.status !== "paused"),
    [shows],
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? visibleShows
        : visibleShows.filter((show) => show.country === filter),
    [filter, visibleShows],
  );

  const counts = useMemo(
    () => ({
      all: visibleShows.length,
      AR: visibleShows.filter((show) => show.country === "AR").length,
      UY: visibleShows.filter((show) => show.country === "UY").length,
    }),
    [visibleShows],
  );

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
            <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:pb-1 md:text-right">
              Encontranos en vivo. Vení a ser parte de La Hermandad.
            </p>
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
                  onClick={() => setFilter(tab.key)}
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
                    {String(counts[tab.key]).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="hidden font-mono text-[9px] tracking-[0.18em] text-ash sm:block">
            GIRA 2026
            <span className="mx-2 text-fire">/</span>
            {String(visibleShows.length).padStart(2, "0")} FECHAS
          </p>
        </div>

        <div className="hidden grid-cols-[160px_1fr_auto] gap-6 border-b border-white/15 pb-2 font-mono text-[8px] tracking-[0.2em] text-white/50 md:grid">
          <span>FECHA</span>
          <span>PLAZA / RECINTO</span>
          <span className="text-right">ENTRADAS</span>
        </div>

        {filtered.length ? (
          <motion.div layout className="relative">
            <AnimatePresence initial={false} mode="popLayout">
              {filtered.map((show) => {
                const date = parseShowDate(show.date);
                const soldOut = show.status === "sold-out";
                const freeEntry = show.freeEntry ?? false;
                if (process.env.NODE_ENV === "development") {
                  console.log("[shows] render", show.id, { freeEntry: show.freeEntry, status: show.status, ticketUrl: show.ticketUrl });
                }

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
                NO HAY FECHAS CONFIRMADAS EN ESTA PLAZA
              </p>
            </div>
            <p className="prose-rock">
              Estamos cerrando nuevas fechas. Escribinos y te avisamos apenas
              se anuncie el próximo show en tu ciudad.
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

        <p className="mt-5 font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/50">
          Las fechas y horarios pueden sufrir cambios. Las entradas se gestionan
          con la productora de cada plaza.
        </p>
      </div>
    </section>
  );
}
