import type { Show } from "@/lib/types";

export const SHOW_TIME_ZONE = "America/Argentina/Buenos_Aires";

const argentinaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: SHOW_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Día actual en Argentina como YYYY-MM-DD. */
export function todayInArgentina(now: Date = new Date()): string {
  const parts = argentinaDate.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  return `${year}-${month}-${day}`;
}

/** Próximas funciones: fecha ascendente y hora ascendente. */
export function sortUpcomingShows(shows: Show[]): Show[] {
  return [...shows].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;

    // Un horario sin confirmar va al final del día.
    if (!a.time && !b.time) return a.id.localeCompare(b.id);
    if (!a.time) return 1;
    if (!b.time) return -1;

    const byTime = a.time.localeCompare(b.time);
    return byTime !== 0 ? byTime : a.id.localeCompare(b.id);
  });
}

/** Archivo: fecha descendente y hora descendente (lo más reciente primero). */
export function sortPastShows(shows: Show[]): Show[] {
  return [...shows].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;

    // Un horario sin confirmar va al final del día.
    if (!a.time && !b.time) return a.id.localeCompare(b.id);
    if (!a.time) return 1;
    if (!b.time) return -1;

    const byTime = b.time.localeCompare(a.time);
    return byTime !== 0 ? byTime : a.id.localeCompare(b.id);
  });
}

export interface ShowBuckets {
  upcoming: Show[];
  past: Show[];
}

/**
 * Clasifica por día completo: una fecha de hoy sigue siendo próxima hasta las
 * 00:00 de Argentina. La hora solo se usa para ordenar dentro del mismo día.
 */
export function splitShowsByDate(
  shows: Show[],
  today: string = todayInArgentina(),
): ShowBuckets {
  const upcoming: Show[] = [];
  const past: Show[] = [];

  for (const show of shows) {
    if (show.date < today) past.push(show);
    else upcoming.push(show);
  }

  return {
    upcoming: sortUpcomingShows(upcoming),
    past: sortPastShows(past),
  };
}
