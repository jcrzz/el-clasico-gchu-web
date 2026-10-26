import { cn } from "@/lib/utils";

export function StagePlot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 620"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Planta escénica de El Clásico: batería al centro, guitarra y bajo a los lados, voz al frente, PA y monitores."
    >
      <defs>
        <pattern id="plot-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#f4f4f5" strokeOpacity=".05" />
        </pattern>
      </defs>

      <rect width="1200" height="620" fill="#0b0b0b" />
      <rect width="1200" height="620" fill="url(#plot-grid)" />

      <rect
        x="56"
        y="56"
        width="1088"
        height="450"
        fill="#0e0e0f"
        stroke="#f4f4f5"
        strokeOpacity=".18"
      />

      <text
        x="78"
        y="92"
        fill="#f59e0b"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="13"
        letterSpacing="2.5"
      >
        ESCENARIO · 8 × 6 M
      </text>
      <text
        x="1122"
        y="92"
        fill="#8b8b90"
        textAnchor="end"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="11"
        letterSpacing="2"
      >
        NO A ESCALA
      </text>

      <rect x="126" y="180" width="168" height="108" fill="#e11d48" fillOpacity=".07" stroke="#e11d48" strokeOpacity=".4" />
      <text x="210" y="222" textAnchor="middle" fill="#f4f4f5" fontFamily="var(--font-jetbrains), monospace" fontSize="13" letterSpacing="2">GUITARRA</text>
      <text x="210" y="248" textAnchor="middle" fill="#8b8b90" fontFamily="var(--font-jetbrains), monospace" fontSize="10" letterSpacing="1.4">AMP · 4×12</text>

      <rect x="906" y="180" width="168" height="108" fill="#e11d48" fillOpacity=".07" stroke="#e11d48" strokeOpacity=".4" />
      <text x="990" y="222" textAnchor="middle" fill="#f4f4f5" fontFamily="var(--font-jetbrains), monospace" fontSize="13" letterSpacing="2">BAJO</text>
      <text x="990" y="248" textAnchor="middle" fill="#8b8b90" fontFamily="var(--font-jetbrains), monospace" fontSize="10" letterSpacing="1.4">AMP · 8×10</text>

      <rect x="506" y="152" width="188" height="150" fill="#f59e0b" fillOpacity=".06" stroke="#f59e0b" strokeOpacity=".42" />
      <circle cx="600" cy="204" r="28" fill="none" stroke="#f4f4f5" strokeOpacity=".4" />
      <circle cx="600" cy="204" r="19" fill="none" stroke="#f4f4f5" strokeOpacity=".25" />
      <text x="600" y="270" textAnchor="middle" fill="#f4f4f5" fontFamily="var(--font-jetbrains), monospace" fontSize="13" letterSpacing="2">BATERÍA</text>
      <text x="600" y="288" textAnchor="middle" fill="#8b8b90" fontFamily="var(--font-jetbrains), monospace" fontSize="9" letterSpacing="1.2">RISER 3 × 2,5 M</text>

      <rect x="530" y="382" width="140" height="62" fill="#f4f4f5" fillOpacity=".05" stroke="#f4f4f5" strokeOpacity=".35" />
      <text x="600" y="410" textAnchor="middle" fill="#f4f4f5" fontFamily="var(--font-jetbrains), monospace" fontSize="13" letterSpacing="2">VOZ</text>
      <text x="600" y="429" textAnchor="middle" fill="#8b8b90" fontFamily="var(--font-jetbrains), monospace" fontSize="9" letterSpacing="1.2">SM58</text>

      <rect x="336" y="398" width="72" height="34" fill="#f59e0b" fillOpacity=".12" stroke="#f59e0b" strokeOpacity=".5" />
      <rect x="792" y="398" width="72" height="34" fill="#f59e0b" fillOpacity=".12" stroke="#f59e0b" strokeOpacity=".5" />
      <text x="372" y="420" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-jetbrains), monospace" fontSize="9" letterSpacing="1">MIX 1</text>
      <text x="828" y="420" textAnchor="middle" fill="#f59e0b" fontFamily="var(--font-jetbrains), monospace" fontSize="9" letterSpacing="1">MIX 2</text>

      <g fill="#8b8b90" fontFamily="var(--font-jetbrains), monospace" fontSize="10" letterSpacing="2">
        <rect x="26" y="190" width="18" height="250" fill="#e11d48" fillOpacity=".1" stroke="#e11d48" strokeOpacity=".4" />
        <text x="35" y="470" textAnchor="middle" transform="rotate(-90 35 470)">PA IZQ</text>
        <rect x="1156" y="190" width="18" height="250" fill="#e11d48" fillOpacity=".1" stroke="#e11d48" strokeOpacity=".4" />
        <text x="1165" y="470" textAnchor="middle" transform="rotate(-90 1165 470)">PA DER</text>
      </g>

      <line x1="56" y1="506" x2="1144" y2="506" stroke="#f4f4f5" strokeOpacity=".25" strokeDasharray="6 6" />
      <text x="600" y="566" textAnchor="middle" fill="#8b8b90" fontFamily="var(--font-jetbrains), monospace" fontSize="11" letterSpacing="5">PÚBLICO</text>
      <path d="M560 592h80M600 578v28M590 598l10 10 10-10" stroke="#8b8b90" strokeOpacity=".5" fill="none" />

      <path d="M56 56v-16M56 56h16M1144 56v-16M1144 56h-16M56 506v16M56 506h16M1144 506v16M1144 506h-16" stroke="#f4f4f5" strokeOpacity=".3" />
    </svg>
  );
}
