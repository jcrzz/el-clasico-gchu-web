"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const milestones = [
  {
    year: "2018",
    title: "EL INICIO",
    body: "El Clásico nace en Gualeguaychú con la visión de llevar el rock a un nuevo nivel.",
  },
  {
    year: "2019",
    title: "PRIMEROS SHOWS",
    body: "Los primeros escenarios locales marcan el comienzo de algo grande.",
  },
  {
    year: "2021",
    title: "PRIMER EP",
    body: "Se lanza el primer material discográfico que captura la esencia de la banda.",
  },
  {
    year: "2023",
    title: "LA GIRA",
    body: "El Clásico lleva su sonido a escenarios de toda la región.",
  },
  {
    year: "2025",
    title: "NUEVO ÁLBUM",
    body: "Un nuevo capítulo con canciones que consolidan la identidad sonora de la banda.",
  },
];

function Milestone({
  year,
  title,
  body,
  index,
}: {
  year: string;
  title: string;
  body: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px -18% 0px" });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="group relative ml-[3px] border-l border-white/15 pb-11 pl-8 last:pb-0 sm:pl-10"
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={
          inView
            ? {
                backgroundColor: "#e11d48",
                scale: 1,
              }
            : { backgroundColor: "#3a3a3f", scale: 0.75 }
        }
        transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : index * 0.05 }}
        className="absolute -left-[5px] top-[7px] h-2.5 w-2.5"
      />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <p className="font-mono text-[11px] tracking-[0.18em] text-fire">
          {year}
        </p>
        <span className="font-mono text-[9px] tracking-[0.16em] text-white/50">
          {String(index + 1).padStart(2, "0")} / 05
        </span>
      </div>
      <h3 className="mt-2 text-[clamp(1.9rem,3.3vw,2.75rem)] leading-none transition-colors group-hover:text-fire">
        {title}
      </h3>
      <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-ash">
        {body}
      </p>
    </div>
  );
}

export function Timeline() {
  return (
    <div className="pt-1">
      {milestones.map((milestone, index) => (
        <Milestone
          key={milestone.year}
          {...milestone}
          index={index}
        />
      ))}
    </div>
  );
}
