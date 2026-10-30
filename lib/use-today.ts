"use client";

import { useEffect, useState } from "react";
import { todayInArgentina } from "./shows";

/**
 * Mantiene el día de Argentina actualizado en cliente. El valor inicial llega
 * del servidor para que la hidratación coincida; después se refresca solo.
 */
export function useToday(initialToday?: string) {
  const [today, setToday] = useState(() => initialToday ?? todayInArgentina());

  useEffect(() => {
    const sync = () => {
      const next = todayInArgentina();
      setToday((current) => (current === next ? current : next));
    };

    sync();
    const timer = window.setInterval(sync, 60_000);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") sync();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return today;
}
