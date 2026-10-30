import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function rangeStyle(percent: number) {
  return {
    "--range-progress": `${Math.max(0, Math.min(100, percent))}%`,
  } as CSSProperties;
}

const months = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

const weekdays = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

export function parseShowDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return {
    day: String(day).padStart(2, "0"),
    month: months[month - 1] ?? "",
    monthShort: (months[month - 1] ?? "").slice(0, 3),
    year: String(year),
    weekday: weekdays[date.getUTCDay()] ?? "",
    iso: isoDate,
  };
}

export function countryName(code: "AR" | "UY") {
  return code === "AR" ? "Argentina" : "Uruguay";
}

export function whatsappUrl(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function externalLinkProps(href: string) {
  if (!href.startsWith("http")) return {};
  return { target: "_blank", rel: "noreferrer noopener" };
}

export function formatTime(seconds: number | null | undefined) {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) {
    return "--:--";
  }

  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}
