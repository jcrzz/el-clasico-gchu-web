import { cn } from "@/lib/utils";

export type LiveSceneVariant =
  | "hero"
  | "history"
  | "guitar"
  | "band"
  | "drummer"
  | "vocalist";

interface LiveSceneProps {
  variant: LiveSceneVariant;
  className?: string;
  mono?: boolean;
}

const backgrounds: Record<LiveSceneVariant, string> = {
  hero: [
    "radial-gradient(ellipse 58% 58% at 50% 48%, rgba(225,29,72,.34), transparent 72%)",
    "radial-gradient(ellipse 42% 38% at 80% 16%, rgba(245,158,11,.2), transparent 70%)",
    "radial-gradient(ellipse 38% 34% at 16% 28%, rgba(225,29,72,.2), transparent 72%)",
    "linear-gradient(180deg,#050505 0%,#0a0305 52%,#150306 100%)",
  ].join(","),
  history: [
    "radial-gradient(ellipse 55% 50% at 62% 44%, rgba(244,244,245,.12), transparent 70%)",
    "radial-gradient(ellipse 45% 45% at 40% 52%, rgba(225,29,72,.16), transparent 72%)",
    "linear-gradient(180deg,#0a0a0a 0%,#0e0c0d 60%,#050505 100%)",
  ].join(","),
  guitar: [
    "radial-gradient(ellipse 55% 45% at 62% 42%, rgba(225,29,72,.44), transparent 70%)",
    "radial-gradient(ellipse 32% 28% at 24% 74%, rgba(245,158,11,.2), transparent 70%)",
    "linear-gradient(160deg,#0a0405 0%,#120305 55%,#050505 100%)",
  ].join(","),
  band: [
    "radial-gradient(ellipse 58% 55% at 50% 46%, rgba(225,29,72,.38), transparent 72%)",
    "radial-gradient(ellipse 40% 42% at 18% 20%, rgba(245,158,11,.18), transparent 70%)",
    "linear-gradient(180deg,#060606 0%,#0b0305 58%,#120306 100%)",
  ].join(","),
  drummer: [
    "radial-gradient(ellipse 52% 55% at 50% 44%, rgba(225,29,72,.42), transparent 72%)",
    "radial-gradient(ellipse 36% 32% at 78% 18%, rgba(245,158,11,.16), transparent 70%)",
    "linear-gradient(180deg,#080404 0%,#130306 100%)",
  ].join(","),
  vocalist: [
    "radial-gradient(ellipse 36% 50% at 50% 38%, rgba(244,244,245,.24), transparent 70%)",
    "radial-gradient(ellipse 55% 60% at 50% 60%, rgba(225,29,72,.1), transparent 72%)",
    "linear-gradient(180deg,#111 0%,#080808 55%,#050505 100%)",
  ].join(","),
};

const FIRE = "#e11d48";
const AMBER = "#f59e0b";
const BONE = "#f4f4f5";

function AmpStack({
  x,
  y,
  scale = 1,
  flip = false,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      {/* cabinet */}
      <rect
        x="-104"
        y="-250"
        width="208"
        height="250"
        fill="#080606"
        stroke={BONE}
        strokeOpacity=".14"
        strokeWidth="2"
      />
      <rect
        x="-88"
        y="-234"
        width="176"
        height="150"
        fill="#0c0908"
        stroke={BONE}
        strokeOpacity=".08"
      />
      <g stroke={BONE} strokeOpacity=".045" strokeWidth="1">
        {Array.from({ length: 9 }).map((_, index) => (
          <line
            key={`h-${index}`}
            x1="-88"
            y1={-234 + index * 17}
            x2="88"
            y2={-234 + index * 17}
          />
        ))}
        {Array.from({ length: 9 }).map((_, index) => (
          <line
            key={`v-${index}`}
            x1={-88 + index * 22}
            y1="-234"
            x2={-88 + index * 22}
            y2="-84"
          />
        ))}
      </g>
      <rect
        x="-34"
        y="-176"
        width="68"
        height="26"
        fill="#0a0807"
        stroke={AMBER}
        strokeOpacity=".28"
      />
      <text
        x="0"
        y="-158"
        textAnchor="middle"
        fontFamily="var(--font-poster), sans-serif"
        fontSize="16"
        fontWeight="800"
        fill={BONE}
        opacity=".38"
        letterSpacing="2"
      >
        EC
      </text>
      <rect
        x="-88"
        y="-66"
        width="176"
        height="52"
        fill="#0a0807"
        stroke={BONE}
        strokeOpacity=".06"
      />
      <g fill="#050404">
        <rect x="-98" y="-6" width="22" height="10" />
        <rect x="76" y="-6" width="22" height="10" />
      </g>

      {/* head */}
      <rect
        x="-104"
        y="-330"
        width="208"
        height="80"
        fill="#0a0707"
        stroke={BONE}
        strokeOpacity=".16"
        strokeWidth="2"
      />
      <rect x="-104" y="-330" width="208" height="9" fill={BONE} opacity=".06" />
      <g fill="#0d0a09" stroke={BONE} strokeOpacity=".16">
        {Array.from({ length: 6 }).map((_, index) => (
          <circle key={index} cx={-70 + index * 24} cy="-286" r="7" />
        ))}
      </g>
      <circle cx="64" cy="-286" r="4" fill={AMBER} opacity=".9" />
      <rect
        x="-58"
        y="-316"
        width="116"
        height="10"
        fill="#050404"
        stroke={BONE}
        strokeOpacity=".12"
      />
      <path
        d="M-104-330V-80"
        stroke={FIRE}
        strokeOpacity=".45"
        strokeWidth="2"
      />
      <path
        d="M104-330V-80"
        stroke={AMBER}
        strokeOpacity=".18"
        strokeWidth="1.5"
      />
    </g>
  );
}

function DrumKit({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* kick */}
      <circle
        cx="0"
        cy="-128"
        r="104"
        fill="#080606"
        stroke={FIRE}
        strokeOpacity=".35"
        strokeWidth="3"
      />
      <circle
        cx="0"
        cy="-128"
        r="92"
        fill="#0b0808"
        stroke={BONE}
        strokeOpacity=".12"
      />
      <circle
        cx="0"
        cy="-128"
        r="76"
        fill="none"
        stroke={BONE}
        strokeOpacity=".07"
      />
      <text
        x="0"
        y="-112"
        textAnchor="middle"
        fontFamily="var(--font-poster), sans-serif"
        fontSize="44"
        fontWeight="800"
        fill={BONE}
        opacity=".18"
        letterSpacing="2"
      >
        EC
      </text>
      {Array.from({ length: 10 }).map((_, index) => {
        const angle = (index / 10) * Math.PI * 2;
        return (
          <circle
            key={`bolt-${index}`}
            cx={Math.cos(angle) * 100}
            cy={-128 + Math.sin(angle) * 100}
            r="3"
            fill={BONE}
            opacity=".22"
          />
        );
      })}
      <path
        d="M-70-24L-92 0M70-24L92 0"
        stroke="#151212"
        strokeWidth="5"
      />

      {/* snare */}
      <g transform="translate(-176 -110)">
        <ellipse
          cx="0"
          cy="0"
          rx="74"
          ry="24"
          fill="#0a0808"
          stroke={BONE}
          strokeOpacity=".18"
        />
        <path
          d="M-74 0V34C-74 50 74 50 74 34V0"
          fill="#080606"
          stroke={BONE}
          strokeOpacity=".12"
        />
        <ellipse
          cx="0"
          cy="34"
          rx="74"
          ry="24"
          fill="#0a0808"
          stroke={BONE}
          strokeOpacity=".1"
        />
        <line x1="0" y1="58" x2="0" y2="110" stroke="#151212" strokeWidth="4" />
        <path d="M-44 110L0 74L44 110" fill="none" stroke="#151212" strokeWidth="4" />
      </g>

      {/* floor tom */}
      <g transform="translate(176 -110)">
        <ellipse
          cx="0"
          cy="0"
          rx="68"
          ry="22"
          fill="#0a0808"
          stroke={BONE}
          strokeOpacity=".16"
        />
        <path
          d="M-68 0V74C-68 92 68 92 68 74V0"
          fill="#080606"
          stroke={BONE}
          strokeOpacity=".1"
        />
        <ellipse
          cx="0"
          cy="74"
          rx="68"
          ry="22"
          fill="#0a0808"
          stroke={BONE}
          strokeOpacity=".08"
        />
        <line x1="-40" y1="92" x2="-52" y2="110" stroke="#151212" strokeWidth="4" />
        <line x1="40" y1="92" x2="52" y2="110" stroke="#151212" strokeWidth="4" />
      </g>

      {/* rack tom */}
      <g transform="translate(0 -238)">
        <ellipse
          cx="0"
          cy="0"
          rx="62"
          ry="20"
          fill="#0a0808"
          stroke={BONE}
          strokeOpacity=".16"
        />
        <path
          d="M-62 0V56C-62 72 62 72 62 56V0"
          fill="#080606"
          stroke={BONE}
          strokeOpacity=".1"
        />
        <ellipse
          cx="0"
          cy="56"
          rx="62"
          ry="20"
          fill="#0a0808"
          stroke={BONE}
          strokeOpacity=".08"
        />
      </g>

      {/* cymbals */}
      <g transform="translate(-206 -286)">
        <ellipse cx="0" cy="0" rx="92" ry="22" fill={AMBER} opacity=".08" />
        <ellipse
          cx="0"
          cy="0"
          rx="92"
          ry="22"
          fill="none"
          stroke={AMBER}
          strokeOpacity=".55"
          strokeWidth="2"
        />
        <ellipse
          cx="0"
          cy="-3"
          rx="56"
          ry="13"
          fill="none"
          stroke={BONE}
          strokeOpacity=".1"
        />
        <line x1="0" y1="18" x2="0" y2="286" stroke="#141212" strokeWidth="4" />
        <path d="M-40 286L0 246L40 286" fill="none" stroke="#141212" strokeWidth="4" />
      </g>
      <g transform="translate(214 -262)">
        <ellipse cx="0" cy="0" rx="84" ry="20" fill={AMBER} opacity=".07" />
        <ellipse
          cx="0"
          cy="0"
          rx="84"
          ry="20"
          fill="none"
          stroke={AMBER}
          strokeOpacity=".45"
          strokeWidth="2"
        />
        <line x1="0" y1="16" x2="0" y2="262" stroke="#141212" strokeWidth="4" />
        <path d="M-36 262L0 226L36 262" fill="none" stroke="#141212" strokeWidth="4" />
      </g>

      {/* hi-hat */}
      <g transform="translate(-140 -206)">
        <ellipse
          cx="0"
          cy="0"
          rx="62"
          ry="15"
          fill="none"
          stroke={FIRE}
          strokeOpacity=".35"
          strokeWidth="2"
        />
        <ellipse
          cx="0"
          cy="8"
          rx="62"
          ry="15"
          fill="none"
          stroke={FIRE}
          strokeOpacity=".25"
          strokeWidth="2"
        />
        <line x1="0" y1="16" x2="0" y2="206" stroke="#141212" strokeWidth="3" />
      </g>
    </g>
  );
}

function Crowd({ opacity = 1 }: { opacity?: number }) {
  const heads = [
    [30, 906, 38],
    [110, 940, 46],
    [196, 892, 34],
    [284, 946, 44],
    [356, 900, 32],
    [430, 952, 48],
    [510, 898, 34],
    [596, 944, 42],
    [672, 902, 31],
    [744, 950, 46],
    [830, 896, 35],
    [914, 942, 43],
    [992, 904, 32],
    [1072, 952, 47],
    [1156, 898, 35],
    [1238, 944, 44],
    [1318, 902, 33],
    [1404, 948, 45],
    [1490, 900, 36],
    [1560, 940, 42],
  ];

  const arms = [
    [70, 890, -18],
    [240, 880, 22],
    [398, 886, -12],
    [552, 882, 16],
    [704, 888, -20],
    [864, 880, 14],
    [1018, 886, -16],
    [1180, 882, 18],
    [1340, 888, -12],
    [1500, 882, 20],
  ];

  return (
    <g opacity={opacity}>
      {heads.map(([cx, cy, r], index) => (
        <g key={`body-${index}`}>
          <path
            d={`M${cx - r * 2.1} 1000C${cx - r * 1.8} ${cy + r * 1.3} ${cx - r * 0.9} ${cy + r * 1.05} ${cx} ${cy + r * 1.05}C${cx + r * 0.9} ${cy + r * 1.05} ${cx + r * 1.8} ${cy + r * 1.3} ${cx + r * 2.1} 1000Z`}
            fill="#050505"
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="#050505"
            stroke={FIRE}
            strokeOpacity=".1"
            strokeWidth="1.5"
          />
          {index % 6 === 0 ? (
            <g fill="#050505">
              <rect x={cx - r * 1.05} y={cy - r * 0.35} width={r * 2.1} height="7" />
              <rect x={cx - r * 0.62} y={cy - r * 0.95} width={r * 1.24} height={r * 0.7} />
            </g>
          ) : null}
          {index % 9 === 4 ? (
            <path
              d={`M${cx + r * 0.7} ${cy + r * 0.6}L${cx + r * 1.8} ${cy - r * 0.2}`}
              stroke="#050505"
              strokeWidth={r * 0.32}
              strokeLinecap="square"
            />
          ) : null}
        </g>
      ))}

      {arms.map(([x, y, tilt], index) => (
        <g key={`arm-${index}`} transform={`translate(${x} ${y}) rotate(${tilt})`}>
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-64"
            stroke="#050505"
            strokeWidth="13"
            strokeLinecap="square"
          />
          <ellipse cx="0" cy="-72" rx="8" ry="12" fill="#050505" />
          {index % 3 === 0 ? (
            <rect x="-3" y="-88" width="6" height="10" fill={AMBER} opacity=".55" />
          ) : null}
        </g>
      ))}

      <rect x="0" y="962" width="1600" height="38" fill="#050505" />
    </g>
  );
}

function StageWide({ mono, crowd }: { mono?: boolean; crowd?: boolean }) {
  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        "absolute inset-0 h-full w-full",
        mono && "grayscale contrast-125",
      )}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="stage-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0607" />
          <stop offset="60%" stopColor="#0d0708" />
          <stop offset="100%" stopColor="#050404" />
        </linearGradient>
        <linearGradient id="stage-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c0809" />
          <stop offset="100%" stopColor="#040303" />
        </linearGradient>
      </defs>

      <rect width="1600" height="1000" fill="url(#stage-wall)" />

      {/* back wall seams */}
      <g stroke={BONE} strokeOpacity=".035">
        {[120, 280, 440, 600, 760, 920, 1080, 1240, 1400, 1560].map((x) => (
          <line key={`seam-${x}`} x1={x} y1="100" x2={x} y2="840" />
        ))}
      </g>

      {/* backdrop monogram */}
      <g opacity=".6">
        <circle
          cx="800"
          cy="430"
          r="250"
          fill="none"
          stroke={BONE}
          strokeOpacity=".055"
          strokeWidth="2"
        />
        <circle
          cx="800"
          cy="430"
          r="232"
          fill="none"
          stroke={FIRE}
          strokeOpacity=".12"
          strokeWidth="1"
        />
        <text
          x="800"
          y="480"
          textAnchor="middle"
          fontFamily="var(--font-poster), sans-serif"
          fontWeight="800"
          fontSize="210"
          fill="none"
          stroke={BONE}
          strokeOpacity=".06"
          strokeWidth="2"
          letterSpacing="8"
        >
          EC
        </text>
      </g>

      <ellipse
        cx="800"
        cy="430"
        rx="520"
        ry="290"
        fill={FIRE}
        opacity=".16"
        style={{ filter: "blur(80px)" }}
      />
      <ellipse
        cx="1270"
        cy="170"
        rx="260"
        ry="190"
        fill={AMBER}
        opacity=".1"
        style={{ filter: "blur(70px)" }}
      />

      {/* lighting beams */}
      <g style={{ filter: "blur(5px)" }}>
        <polygon points="190,-80 390,-80 640,820 300,820" fill={AMBER} opacity=".05" />
        <polygon points="500,-80 610,-80 880,840 660,840" fill={BONE} opacity=".04" />
        <polygon points="1010,-80 1120,-80 900,840 720,840" fill={FIRE} opacity=".07" />
        <polygon points="1220,-80 1400,-80 1330,830 990,830" fill={AMBER} opacity=".045" />
      </g>

      {/* truss */}
      <line x1="0" y1="64" x2="1600" y2="64" stroke="#141212" strokeWidth="12" />
      <line x1="0" y1="92" x2="1600" y2="92" stroke="#0d0d0d" strokeWidth="6" />
      <g stroke="#1c1c1c" strokeWidth="2">
        {Array.from({ length: 40 }).map((_, index) => (
          <line
            key={`truss-${index}`}
            x1={index * 40}
            y1={index % 2 === 0 ? "64" : "92"}
            x2={(index + 1) * 40}
            y2={index % 2 === 0 ? "92" : "64"}
          />
        ))}
      </g>

      {/* lamps */}
      {[180, 470, 790, 1110, 1420].map((x, index) => (
        <g key={`lamp-${x}`}>
          <rect
            x={x - 18}
            y="96"
            width="36"
            height="26"
            fill="#0c0c0c"
            stroke="#1f1f1f"
          />
          <rect x={x - 26} y="90" width="52" height="8" fill="#0c0c0c" />
          <circle
            cx={x}
            cy="130"
            r={index % 2 === 0 ? 11 : 9}
            fill={index % 3 === 0 ? AMBER : FIRE}
            opacity=".85"
            style={{ filter: "blur(1px)" }}
          />
          <circle
            cx={x}
            cy="130"
            r="38"
            fill={index % 3 === 0 ? AMBER : FIRE}
            opacity=".13"
            style={{ filter: "blur(20px)" }}
          />
        </g>
      ))}

      {/* stage floor */}
      <path
        d="M0 840 C 220 828 360 852 520 840 C 700 826 900 852 1080 840 C 1260 828 1430 850 1600 838 L1600 1000 L0 1000 Z"
        fill="url(#stage-floor)"
      />
      <path
        d="M0 840 C 220 828 360 852 520 840 C 700 826 900 852 1080 840 C 1260 828 1430 850 1600 838"
        fill="none"
        stroke={BONE}
        strokeOpacity=".08"
      />

      {/* amp stacks */}
      <AmpStack x={210} y={842} scale={1.02} />
      <AmpStack x={1390} y={842} scale={1.02} flip />

      {/* drum riser */}
      <rect x="600" y="768" width="400" height="76" fill="#0a0707" />
      <rect
        x="600"
        y="768"
        width="400"
        height="76"
        fill="none"
        stroke={BONE}
        strokeOpacity=".08"
      />
      <rect x="600" y="768" width="400" height="9" fill={BONE} opacity=".05" />
      <text
        x="800"
        y="834"
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontSize="9"
        fill={BONE}
        opacity=".18"
        letterSpacing="6"
      >
        EL CLÁSICO
      </text>

      <DrumKit x={800} y={842} />

      {/* mic stand */}
      <g transform="translate(640 842)">
        <line x1="0" y1="0" x2="0" y2="-270" stroke="#161212" strokeWidth="6" />
        <line x1="0" y1="-270" x2="54" y2="-300" stroke="#161212" strokeWidth="5" />
        <rect
          x="48"
          y="-322"
          width="16"
          height="38"
          rx="8"
          fill="#0a0a0a"
          stroke={AMBER}
          strokeOpacity=".35"
          transform="rotate(18 56 -303)"
        />
        <path
          d="M-26 0L0 -16L26 0"
          fill="none"
          stroke="#161212"
          strokeWidth="4"
        />
      </g>

      {/* monitor wedges */}
      <g transform="translate(470 852)">
        <path
          d="M-70 0L-44 -54L44 -54L70 0Z"
          fill="#0a0807"
          stroke={BONE}
          strokeOpacity=".12"
        />
        <path d="M-44-54L44-54L32-44L-32-44Z" fill={BONE} opacity=".05" />
        <rect x="-30" y="-36" width="60" height="12" fill="#050404" opacity=".8" />
      </g>
      <g transform="translate(1130 852)">
        <path
          d="M-70 0L-44 -54L44 -54L70 0Z"
          fill="#0a0807"
          stroke={BONE}
          strokeOpacity=".12"
        />
        <path d="M-44-54L44-54L32-44L-32-44Z" fill={BONE} opacity=".05" />
        <rect x="-30" y="-36" width="60" height="12" fill="#050404" opacity=".8" />
      </g>

      {/* cables */}
      <g fill="none">
        <path
          d="M300 842C380 904 480 886 560 842"
          stroke="#1a1010"
          strokeWidth="4"
        />
        <path
          d="M1300 842C1200 904 1080 886 1000 842"
          stroke="#1a1010"
          strokeWidth="4"
        />
        <path
          d="M640 842C660 912 760 928 820 896"
          stroke={FIRE}
          strokeOpacity=".14"
          strokeWidth="3"
        />
      </g>

      <ellipse
        cx="800"
        cy="852"
        rx="700"
        ry="46"
        fill={FIRE}
        opacity=".08"
        style={{ filter: "blur(28px)" }}
      />

      {crowd ? <Crowd /> : null}
    </svg>
  );
}

function GuitarCloseUp() {
  const body =
    "M-560-70C-590-130-650-170-720-170C-830-170-920-100-920 0C-920 110-840 190-740 190C-660 190-600 140-570 70L-560 54Z";

  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="guitar-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1c0b0d" />
          <stop offset="55%" stopColor="#0d0708" />
          <stop offset="100%" stopColor="#050404" />
        </linearGradient>
        <linearGradient id="guitar-neck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0a09" />
          <stop offset="100%" stopColor="#070505" />
        </linearGradient>
        <pattern
          id="guitar-halftone"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.1" fill="#050404" opacity=".65" />
        </pattern>
      </defs>

      <rect width="900" height="1200" fill="#080506" />
      <ellipse
        cx="380"
        cy="540"
        rx="340"
        ry="320"
        fill={FIRE}
        opacity=".14"
        style={{ filter: "blur(90px)" }}
      />
      <ellipse
        cx="120"
        cy="1020"
        rx="260"
        ry="180"
        fill={AMBER}
        opacity=".08"
        style={{ filter: "blur(80px)" }}
      />

      <g transform="translate(560 640) rotate(-28)">
        {/* misregistered plate */}
        <path
          d={body}
          fill="none"
          stroke={FIRE}
          strokeOpacity=".38"
          strokeWidth="3"
          transform="translate(14 10)"
        />

        {/* body */}
        <path
          d={body}
          fill="url(#guitar-body)"
          stroke={FIRE}
          strokeOpacity=".32"
          strokeWidth="2"
        />
        <path
          d="M-560-70C-590-130-650-170-720-170C-830-170-920-100-920 0"
          fill="none"
          stroke={BONE}
          strokeOpacity=".16"
          strokeWidth="2"
        />

        {/* pickguard */}
        <path
          d="M-600-30C-650-70-730-80-790-40C-850 0-860 70-820 120C-780 170-700 170-640 130L-590 100Z"
          fill="#120c0c"
          stroke={BONE}
          strokeOpacity=".08"
        />

        {/* bridge */}
        <rect
          x="-780"
          y="-50"
          width="24"
          height="100"
          fill="#0d0b0a"
          stroke={BONE}
          strokeOpacity=".18"
        />
        <g fill={BONE} opacity=".28">
          {Array.from({ length: 6 }).map((_, index) => (
            <rect
              key={`saddle-${index}`}
              x="-776"
              y={-40 + index * 14}
              width="16"
              height="4"
            />
          ))}
        </g>

        {/* pickups */}
        <g fill="#0b0908" stroke={BONE} strokeOpacity=".14">
          <rect x="-730" y="-58" width="58" height="116" />
          <rect x="-660" y="-58" width="44" height="116" />
        </g>
        <g fill={BONE} opacity=".26">
          {Array.from({ length: 6 }).map((_, index) => (
            <rect
              key={`pole-a-${index}`}
              x={-720 + index * 8}
              y="-46"
              width="3"
              height="7"
            />
          ))}
          {Array.from({ length: 6 }).map((_, index) => (
            <rect
              key={`pole-b-${index}`}
              x={-654 + index * 6}
              y="-46"
              width="3"
              height="7"
            />
          ))}
        </g>

        {/* controls */}
        <circle
          cx="-790"
          cy="112"
          r="16"
          fill="#0d0b0a"
          stroke={AMBER}
          strokeOpacity=".32"
        />
        <circle
          cx="-748"
          cy="140"
          r="12"
          fill="#0d0b0a"
          stroke={AMBER}
          strokeOpacity=".2"
        />

        {/* neck */}
        <rect
          x="-600"
          y="-34"
          width="1500"
          height="68"
          fill="url(#guitar-neck)"
          stroke={FIRE}
          strokeOpacity=".24"
          strokeWidth="2"
        />
        <rect x="-600" y="-30" width="1500" height="60" fill="#0d0a09" />
        <rect x="-600" y="-30" width="1500" height="4" fill={BONE} opacity=".08" />

        {/* frets */}
        {Array.from({ length: 24 }).map((_, index) => (
          <rect
            key={`fret-${index}`}
            x={-548 + index * 62}
            y="-30"
            width="3"
            height="60"
            fill="#d7d7db"
            opacity=".22"
          />
        ))}

        {/* inlays */}
        {[3, 5, 7, 9, 12, 15, 17, 19, 21].map((fret) => (
          <circle
            key={`inlay-${fret}`}
            cx={-548 + (fret - 1) * 62 + 31}
            cy="0"
            r="5"
            fill={BONE}
            opacity={fret === 12 ? ".32" : ".22"}
          />
        ))}

        {/* strings */}
        {Array.from({ length: 6 }).map((_, index) => (
          <line
            key={`string-${index}`}
            x1="-778"
            y1={-28 + index * 10.4}
            x2="900"
            y2={-24 + index * 9.2}
            stroke={BONE}
            strokeOpacity={0.16 + index * 0.026}
            strokeWidth={index < 3 ? 1.1 : 1.7}
          />
        ))}

        {/* body grain */}
        <path d={body} fill="url(#guitar-halftone)" opacity=".38" />
        <g stroke={BONE} strokeOpacity=".08">
          <line x1="-900" y1="76" x2="-830" y2="128" />
          <line x1="-860" y1="46" x2="-800" y2="94" />
          <line x1="-720" y1="-132" x2="-660" y2="-96" />
        </g>
      </g>

      <path
        d="M0 0L250 0C150 220 290 390 180 630C80 850 160 1010 80 1200L0 1200Z"
        fill="#050404"
        opacity=".62"
        style={{ filter: "blur(26px)" }}
      />
      <path
        d="M900 0L690 0C790 210 650 430 760 650C860 850 740 1050 820 1200L900 1200Z"
        fill="#050404"
        opacity=".66"
        style={{ filter: "blur(26px)" }}
      />
    </svg>
  );
}

function MicCloseUp({ mono = true }: { mono?: boolean }) {
  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        "absolute inset-0 h-full w-full",
        mono && "grayscale contrast-125",
      )}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mic-chrome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2a2526" />
          <stop offset="22%" stopColor="#d7d3cf" />
          <stop offset="46%" stopColor="#77706b" />
          <stop offset="70%" stopColor="#e8e2db" />
          <stop offset="100%" stopColor="#332d2d" />
        </linearGradient>
        <linearGradient id="mic-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#161111" />
          <stop offset="35%" stopColor="#393231" />
          <stop offset="62%" stopColor="#0c0909" />
          <stop offset="100%" stopColor="#241d1d" />
        </linearGradient>
        <pattern
          id="mic-halftone"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.1" fill="#050404" opacity=".62" />
        </pattern>
      </defs>

      <rect width="900" height="1200" fill="#070506" />
      <polygon
        points="330,0 600,0 760,760 180,760"
        fill={BONE}
        opacity=".05"
        style={{ filter: "blur(18px)" }}
      />
      <ellipse
        cx="450"
        cy="360"
        rx="300"
        ry="260"
        fill={BONE}
        opacity=".12"
        style={{ filter: "blur(80px)" }}
      />
      <ellipse
        cx="640"
        cy="920"
        rx="300"
        ry="260"
        fill={FIRE}
        opacity=".12"
        style={{ filter: "blur(90px)" }}
      />

      {/* stand */}
      <line x1="450" y1="1200" x2="450" y2="760" stroke="#141212" strokeWidth="10" />
      <line x1="444" y1="1200" x2="444" y2="760" stroke={BONE} strokeOpacity=".08" strokeWidth="3" />
      <ellipse
        cx="450"
        cy="1160"
        rx="120"
        ry="20"
        fill="#0a0808"
        stroke={BONE}
        strokeOpacity=".08"
      />
      <path
        d="M330 1200L450 1120L570 1200"
        fill="none"
        stroke="#141212"
        strokeWidth="8"
      />

      {/* yoke */}
      <path
        d="M360 690C330 620 330 520 360 480"
        fill="none"
        stroke="#1a1616"
        strokeWidth="12"
      />
      <path
        d="M540 690C570 620 570 520 540 480"
        fill="none"
        stroke="#1a1616"
        strokeWidth="12"
      />
      <line x1="450" y1="760" x2="450" y2="700" stroke="#1a1616" strokeWidth="12" />

      <g transform="rotate(-6 450 560)">
        {/* body */}
        <path
          d="M392 520L508 520L486 800L414 800Z"
          fill="url(#mic-body)"
          stroke={BONE}
          strokeOpacity=".18"
        />
        <rect x="392" y="520" width="116" height="14" fill="#0c0a0a" />
        <rect x="404" y="770" width="92" height="18" fill="#0c0a0a" />

        {/* head */}
        <rect
          x="356"
          y="300"
          width="188"
          height="240"
          rx="28"
          fill="url(#mic-chrome)"
          stroke={BONE}
          strokeOpacity=".3"
          strokeWidth="2"
        />
        <path
          d="M356 328C356 292 390 282 450 282C510 282 544 292 544 328"
          fill="url(#mic-chrome)"
          stroke={BONE}
          strokeOpacity=".3"
        />
        {Array.from({ length: 9 }).map((_, index) => (
          <line
            key={`slat-${index}`}
            x1="366"
            y1={326 + index * 22}
            x2="534"
            y2={326 + index * 22}
            stroke="#0a0808"
            strokeOpacity=".55"
            strokeWidth="5"
          />
        ))}
        <rect x="370" y="310" width="10" height="220" rx="5" fill={BONE} opacity=".18" />
        <rect x="520" y="318" width="7" height="204" rx="3" fill="#0a0808" opacity=".5" />
        <rect x="386" y="540" width="128" height="16" fill={BONE} opacity=".22" />

        {/* switch */}
        <rect
          x="470"
          y="620"
          width="22"
          height="44"
          rx="4"
          fill="#0a0808"
          stroke={AMBER}
          strokeOpacity=".3"
        />

        {/* cable */}
        <path
          d="M450 800C470 900 520 960 620 1000C720 1040 760 1100 700 1160"
          fill="none"
          stroke="#0b0909"
          strokeWidth="10"
        />
        <path
          d="M450 800C470 900 520 960 620 1000C720 1040 760 1100 700 1160"
          fill="none"
          stroke={BONE}
          strokeOpacity=".06"
          strokeWidth="3"
        />

        {/* texture */}
        <rect
          x="356"
          y="300"
          width="188"
          height="240"
          rx="28"
          fill="url(#mic-halftone)"
          opacity=".35"
        />
      </g>

      <path
        d="M0 0L210 0C110 260 250 470 140 760C60 960 130 1080 60 1200L0 1200Z"
        fill="#050404"
        opacity=".6"
        style={{ filter: "blur(26px)" }}
      />
      <path
        d="M900 0L700 0C800 240 660 480 770 700C870 900 750 1060 830 1200L900 1200Z"
        fill="#050404"
        opacity=".64"
        style={{ filter: "blur(26px)" }}
      />
    </svg>
  );
}

function DrummerScene() {
  return (
    <svg
      viewBox="0 0 900 1200"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="snare-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2222" />
          <stop offset="100%" stopColor="#121010" />
        </linearGradient>
        <linearGradient id="snare-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1212" />
          <stop offset="100%" stopColor="#070505" />
        </linearGradient>
        <linearGradient id="cymbal-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2c18" />
          <stop offset="55%" stopColor="#1a140d" />
          <stop offset="100%" stopColor="#0a0806" />
        </linearGradient>
        <pattern
          id="drum-halftone"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.2" fill="#050404" opacity=".6" />
        </pattern>
      </defs>

      <rect width="900" height="1200" fill="#080506" />
      <ellipse
        cx="430"
        cy="700"
        rx="400"
        ry="360"
        fill={FIRE}
        opacity=".18"
        style={{ filter: "blur(90px)" }}
      />
      <ellipse
        cx="730"
        cy="250"
        rx="230"
        ry="200"
        fill={AMBER}
        opacity=".08"
        style={{ filter: "blur(70px)" }}
      />
      <polygon
        points="210,0 520,0 720,1200 60,1200"
        fill={BONE}
        opacity=".04"
        style={{ filter: "blur(16px)" }}
      />

      {/* cymbal */}
      <g transform="translate(650 330) rotate(-10)">
        <ellipse cx="0" cy="0" rx="310" ry="88" fill="url(#cymbal-face)" />
        <ellipse
          cx="0"
          cy="0"
          rx="310"
          ry="88"
          fill="none"
          stroke={AMBER}
          strokeOpacity=".32"
          strokeWidth="2"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="250"
          ry="68"
          fill="none"
          stroke={BONE}
          strokeOpacity=".08"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="180"
          ry="48"
          fill="none"
          stroke={BONE}
          strokeOpacity=".06"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="70"
          ry="20"
          fill="#141010"
          stroke={BONE}
          strokeOpacity=".16"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="310"
          ry="88"
          fill="url(#drum-halftone)"
          opacity=".28"
        />
        <path
          d="M-300 10C-180 54 180 54 300 10"
          fill="none"
          stroke={BONE}
          strokeOpacity=".1"
          strokeWidth="2"
        />
      </g>

      {/* cymbal stand */}
      <line x1="650" y1="418" x2="650" y2="980" stroke="#151212" strokeWidth="7" />
      <line x1="646" y1="418" x2="646" y2="980" stroke={BONE} strokeOpacity=".06" strokeWidth="2" />
      <path
        d="M580 1030L650 968L720 1030"
        fill="none"
        stroke="#151212"
        strokeWidth="7"
      />

      {/* snare */}
      <g transform="translate(380 760)">
        <ellipse
          cx="0"
          cy="0"
          rx="260"
          ry="86"
          fill="url(#snare-head)"
          stroke={BONE}
          strokeOpacity=".2"
          strokeWidth="3"
        />
        <path
          d="M-260 0V90C-260 140 260 140 260 90V0"
          fill="url(#snare-shell)"
          stroke={BONE}
          strokeOpacity=".12"
          strokeWidth="2"
        />
        <ellipse
          cx="0"
          cy="90"
          rx="260"
          ry="86"
          fill="#0a0808"
          stroke={BONE}
          strokeOpacity=".1"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="260"
          ry="86"
          fill="url(#drum-halftone)"
          opacity=".34"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="260"
          ry="86"
          fill="none"
          stroke={BONE}
          strokeOpacity=".3"
          strokeWidth="4"
        />
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          return (
            <circle
              key={`lug-${index}`}
              cx={Math.cos(angle) * 248}
              cy={Math.sin(angle) * 78}
              r="5"
              fill={BONE}
              opacity=".28"
            />
          );
        })}
        <rect
          x="214"
          y="34"
          width="36"
          height="32"
          fill="#0d0a0a"
          stroke={BONE}
          strokeOpacity=".16"
        />
        <text
          x="0"
          y="18"
          textAnchor="middle"
          fontFamily="var(--font-poster), sans-serif"
          fontWeight="800"
          fontSize="54"
          fill={BONE}
          opacity=".16"
          letterSpacing="3"
        >
          EC
        </text>
        <line x1="0" y1="170" x2="0" y2="330" stroke="#151212" strokeWidth="8" />
        <path
          d="M-90 410L0 330L90 410"
          fill="none"
          stroke="#151212"
          strokeWidth="8"
        />
        <path
          d="M-60 380L0 330L60 380"
          fill="none"
          stroke="#151212"
          strokeWidth="5"
        />
      </g>

      {/* sticks */}
      <g stroke="#d7d0c8" strokeLinecap="round">
        <line x1="170" y1="592" x2="568" y2="832" strokeWidth="12" opacity=".78" />
        <line x1="206" y1="664" x2="606" y2="798" strokeWidth="10" opacity=".55" />
      </g>
      <g fill="#d7d0c8" opacity=".5">
        <ellipse cx="568" cy="832" rx="9" ry="6" transform="rotate(30 568 832)" />
        <ellipse cx="606" cy="798" rx="8" ry="5" transform="rotate(18 606 798)" />
      </g>

      {/* stage line + debris */}
      <line x1="0" y1="1054" x2="900" y2="1054" stroke={BONE} strokeOpacity=".06" />
      <g fill={BONE} opacity=".18">
        <circle cx="120" cy="1110" r="2" />
        <circle cx="760" cy="1084" r="3" />
        <circle cx="820" cy="1020" r="2" />
      </g>

      <path
        d="M0 0L190 0C100 260 230 470 130 740C60 940 120 1080 50 1200L0 1200Z"
        fill="#050404"
        opacity=".6"
        style={{ filter: "blur(26px)" }}
      />
      <path
        d="M900 0L710 0C810 250 670 470 780 710C880 930 760 1070 840 1200L900 1200Z"
        fill="#050404"
        opacity=".62"
        style={{ filter: "blur(26px)" }}
      />
    </svg>
  );
}

export function LiveScene({ variant, className, mono }: LiveSceneProps) {
  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ backgroundImage: backgrounds[variant] }}
      aria-hidden="true"
    >
      {variant === "guitar" ? (
        <GuitarCloseUp />
      ) : variant === "vocalist" ? (
        <MicCloseUp mono={mono ?? true} />
      ) : variant === "drummer" ? (
        <DrummerScene />
      ) : (
        <StageWide
          mono={mono ?? variant === "history"}
          crowd={variant !== "band"}
        />
      )}

      <div className="scene-grain pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,7,7,.82)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
    </div>
  );
}
