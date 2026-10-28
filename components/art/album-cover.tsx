import type { Album, AlbumCoverVariant } from "@/lib/types";
import { cn } from "@/lib/utils";

type Palette = {
  bg: string;
  deep: string;
  accent: string;
  secondary: string;
  bone: string;
};

const palettes: Record<AlbumCoverVariant, Palette> = {
  flame: {
    bg: "#080505",
    deep: "#100507",
    accent: "#e11d48",
    secondary: "#f59e0b",
    bone: "#f4f4f5",
  },
  trench: {
    bg: "#060809",
    deep: "#0a0e10",
    accent: "#e11d48",
    secondary: "#b7b7bc",
    bone: "#f4f4f5",
  },
  rot: {
    bg: "#090806",
    deep: "#100d07",
    accent: "#f59e0b",
    secondary: "#8b8b90",
    bone: "#f4f4f5",
  },
  blood: {
    bg: "#080404",
    deep: "#120608",
    accent: "#dc2626",
    secondary: "#f4f4f5",
    bone: "#f4f4f5",
  },
  flag: {
    bg: "#070707",
    deep: "#0c0b08",
    accent: "#f59e0b",
    secondary: "#b7b7bc",
    bone: "#f4f4f5",
  },
};

const FLAME =
  "M0 -260C60 -180 120 -130 120 -40C120 70 70 150 0 170C-70 150 -120 70 -120 -40C-120 -110 -80 -160 -40 -200C-30 -140 0 -100 30 -70C20 -150 10 -210 0 -260Z";

const INNER_FLAME =
  "M0 -120C30 -70 60 -40 60 0C60 50 30 90 0 100C-30 90 -60 50 -60 0C-60 -30 -40 -60 -20 -80C-14 -50 0 -30 14 -14C8 -60 4 -90 0 -120Z";

function Registration({ color }: { color: string }) {
  return (
    <>
      <g stroke={color} strokeOpacity=".055">
        <line x1="0" y1="250" x2="1000" y2="250" />
        <line x1="0" y1="500" x2="1000" y2="500" />
        <line x1="0" y1="750" x2="1000" y2="750" />
        <line x1="250" y1="0" x2="250" y2="1000" />
        <line x1="750" y1="0" x2="750" y2="1000" />
      </g>
      <circle
        cx="500"
        cy="410"
        r="330"
        fill="none"
        stroke={color}
        strokeOpacity=".075"
      />
    </>
  );
}

function Frame({ color }: { color: string }) {
  return (
    <>
      <rect
        x="28"
        y="28"
        width="944"
        height="944"
        fill="none"
        stroke={color}
        strokeOpacity=".14"
      />
      <path
        d="M28 28h40M28 28v40M972 28h-40M972 28v40M28 972h40M28 972v-40M972 972h-40M972 972v-40"
        stroke={color}
        strokeOpacity=".34"
      />
    </>
  );
}

function FlameMotif({ palette, dotId }: { palette: Palette; dotId: string }) {
  return (
    <g>
      <circle cx="500" cy="420" r="245" fill={palette.accent} opacity=".15" style={{ filter: "blur(46px)" }} />
      <g transform="translate(500 440) scale(1.03)">
        <g transform="translate(14 10)" opacity=".45">
          <path d={FLAME} fill={palette.secondary} />
        </g>
        <path d={FLAME} fill={palette.accent} />
        <path d={FLAME} fill={`url(#${dotId})`} opacity=".38" />
        <path d={INNER_FLAME} fill="#e11d48" />
        <path d={INNER_FLAME} fill={palette.secondary} opacity=".5" transform="scale(.72)" />
        <g fill={palette.bg}>
          <path d="M-62 -34l32 -12 22 48-38 12z" opacity=".8" />
          <path d="M56 -20l34 -12 16 48-38 12z" opacity=".75" />
          <path d="M-8 60l36 -8 12 32-36 8z" opacity=".65" />
        </g>
      </g>
      <g fill={palette.secondary}>
        <path d="M322 300l7 14-7 14-7-14z" opacity=".7" />
        <path d="M702 276l6 12-6 12-6-12z" opacity=".55" />
        <path d="M642 380l4 8-4 8-4-8z" opacity=".5" />
        <path d="M356 420l4 8-4 8-4-8z" opacity=".42" />
        <path d="M748 466l5 10-5 10-5-10z" opacity=".45" />
        <path d="M286 506l4 8-4 8-4-8z" opacity=".32" />
      </g>
    </g>
  );
}

function TrenchMotif({ palette }: { palette: Palette }) {
  const wire = (y: number, opacity: number) => (
    <g key={y} stroke={palette.bone} strokeOpacity={opacity} fill="none">
      <path d={`M74 ${y}Q500 ${y + 26} 926 ${y}`} />
      {[150, 290, 430, 570, 710, 850].map((x) => (
        <g key={x} strokeWidth="3">
          <line x1={x - 9} y1={y + 2} x2={x + 9} y2={y + 16} />
          <line x1={x + 9} y1={y + 2} x2={x - 9} y2={y + 16} />
        </g>
      ))}
    </g>
  );

  return (
    <g>
      <polygon points="120,130 420,568 640,568 220,130" fill={palette.secondary} opacity=".06" />
      <polygon points="880,130 560,568 760,568 960,250" fill={palette.accent} opacity=".08" />
      <g stroke={palette.bone} strokeOpacity=".28" strokeWidth="5">
        <line x1="184" y1="206" x2="184" y2="570" />
        <line x1="500" y1="168" x2="500" y2="570" />
        <line x1="816" y1="206" x2="816" y2="570" />
      </g>
      <g stroke={palette.bone} strokeOpacity=".16">
        <line x1="74" y1="570" x2="926" y2="570" strokeWidth="3" />
        <line x1="74" y1="604" x2="926" y2="604" />
      </g>
      {wire(304, 0.34)}
      {wire(402, 0.26)}
      {wire(500, 0.2)}
      <g fill={palette.secondary} opacity=".3">
        {Array.from({ length: 9 }).map((_, index) => (
          <rect
            key={index}
            x={150 + (index % 3) * 240}
            y={520 - Math.floor(index / 3) * 38}
            width="214"
            height="34"
          />
        ))}
      </g>
      <g fill={palette.accent} opacity=".8">
        <rect x="470" y="238" width="60" height="10" />
        <rect x="494" y="214" width="12" height="58" />
      </g>
      <text
        x="500"
        y="344"
        textAnchor="middle"
        fill={palette.bone}
        opacity=".16"
        fontFamily="var(--font-poster), sans-serif"
        fontWeight="800"
        fontSize="150"
        letterSpacing="4"
      >
        02
      </text>
    </g>
  );
}

function RotMotif({ palette }: { palette: Palette }) {
  return (
    <g>
      <circle cx="500" cy="400" r="230" fill="none" stroke={palette.accent} strokeWidth="3" strokeOpacity=".55" />
      <circle
        cx="500"
        cy="400"
        r="184"
        fill="none"
        stroke={palette.secondary}
        strokeWidth="1.5"
        strokeOpacity=".3"
        strokeDasharray="16 12"
      />
      <circle cx="500" cy="400" r="130" fill={palette.accent} opacity=".08" />
      <g fill={palette.accent}>
        <path d="M352 596c8 26 4 58 18 82 8 14 22 6 20 -12 -4 -26 -16 -48 -18 -72z" opacity=".7" />
        <path d="M470 620c3 40 -6 70 2 96 5 15 18 10 18 -8 0 -30 -8 -58 -6 -88z" opacity=".6" />
        <path d="M590 606c10 22 8 54 22 72 9 12 20 2 16 -14 -7 -24 -22 -42 -24 -62z" opacity=".55" />
        <path d="M668 560c12 18 14 44 28 58 10 10 18 -2 12 -16 -10 -20 -26 -32 -28 -48z" opacity=".45" />
      </g>
      <g stroke={palette.bone} strokeOpacity=".3" fill="none">
        <path d="M286 246l88 76-28 54 74 22-16 62 90 18" />
        <path d="M714 258l-70 70 34 48-62 34" />
      </g>
      <g fill={palette.secondary} opacity=".5">
        {[
          [312, 360],
          [690, 330],
          [650, 520],
          [360, 520],
          [500, 220],
          [500, 586],
        ].map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r={index % 2 ? 4 : 6} />
        ))}
      </g>
      <text
        x="92"
        y="500"
        transform="rotate(-90 92 500)"
        fill={palette.secondary}
        opacity=".13"
        fontFamily="var(--font-poster), sans-serif"
        fontWeight="800"
        fontSize="96"
        letterSpacing="6"
      >
        PUDRA
      </text>
    </g>
  );
}

function BloodMotif({ palette }: { palette: Palette }) {
  return (
    <g>
      <g transform="rotate(-24 500 400)">
        <polygon points="224,356 724,236 758,304 272,430" fill={palette.secondary} opacity=".9" />
        <polygon points="224,356 724,236 736,260 246,382" fill={palette.accent} opacity=".95" />
        <polygon points="164,376 238,352 286,428 208,454" fill={palette.bone} opacity=".22" />
        <rect x="196" y="366" width="58" height="74" fill={palette.accent} opacity=".7" />
      </g>
      <g fill={palette.accent}>
        <circle cx="690" cy="520" r="7" />
        <circle cx="714" cy="558" r="4" />
        <circle cx="676" cy="586" r="5" />
        <path d="M702 496c6 22 2 44 10 60 5 10 12 2 10 -10 -4 -20 -10 -36 -12 -50z" opacity=".8" />
        <path d="M646 596c4 18 0 38 8 50 5 8 11 0 9 -10 -4 -16 -9 -30 -9 -40z" opacity=".65" />
      </g>
      <path
        d="M180 214L812 548"
        stroke={palette.accent}
        strokeWidth="2"
        strokeOpacity=".5"
        strokeDasharray="18 10"
      />
      <g fill={palette.bone} opacity=".18">
        <text
          x="500"
          y="338"
          textAnchor="middle"
          fontFamily="var(--font-poster), sans-serif"
          fontWeight="800"
          fontSize="170"
          letterSpacing="2"
        >
          04
        </text>
      </g>
    </g>
  );
}

function FlagMotif({ palette }: { palette: Palette }) {
  return (
    <g>
      <g opacity=".85">
        <rect x="108" y="150" width="264" height="470" fill={palette.accent} opacity=".78" />
        <rect x="372" y="150" width="256" height="470" fill={palette.secondary} opacity=".32" />
        <rect x="628" y="150" width="264" height="470" fill={palette.bone} opacity=".12" />
      </g>
      <g fill={palette.bone} opacity=".42">
        {Array.from({ length: 26 }).map((_, index) => (
          <rect
            key={index}
            x={392 + index * 8}
            y="452"
            width={index % 4 === 0 ? 4 : 2}
            height={index % 5 === 0 ? 96 : 72}
          />
        ))}
      </g>
      <g transform="rotate(-8 500 382)">
        <line x1="322" y1="244" x2="272" y2="188" stroke={palette.secondary} strokeWidth="2" strokeOpacity=".5" />
        <circle cx="344" cy="270" r="13" fill={palette.bg} stroke={palette.bone} strokeOpacity=".4" />
        <rect
          x="298"
          y="266"
          width="404"
          height="220"
          fill={palette.deep}
          stroke={palette.bone}
          strokeOpacity=".32"
        />
        <rect x="298" y="266" width="404" height="6" fill={palette.accent} />
        <text
          x="330"
          y="322"
          fill={palette.secondary}
          fontFamily="var(--font-jetbrains), monospace"
          fontSize="18"
          letterSpacing="6"
        >
          PRECIO
        </text>
        <text
          x="330"
          y="396"
          fill={palette.accent}
          fontFamily="var(--font-poster), sans-serif"
          fontWeight="800"
          fontSize="76"
          letterSpacing="1"
        >
          NO SE VENDE
        </text>
        <text
          x="330"
          y="446"
          fill={palette.bone}
          opacity=".55"
          fontFamily="var(--font-jetbrains), monospace"
          fontSize="15"
          letterSpacing="4"
        >
          CONSULTAR / GIRA 2026
        </text>
      </g>
      <path d="M690 550L810 478" stroke={palette.bone} strokeOpacity=".2" strokeWidth="2" />
    </g>
  );
}

function Motif({
  variant,
  palette,
  dotId,
}: {
  variant: AlbumCoverVariant;
  palette: Palette;
  dotId: string;
}) {
  if (variant === "flame") return <FlameMotif palette={palette} dotId={dotId} />;
  if (variant === "trench") return <TrenchMotif palette={palette} />;
  if (variant === "rot") return <RotMotif palette={palette} />;
  if (variant === "blood") return <BloodMotif palette={palette} />;
  return <FlagMotif palette={palette} />;
}

export function AlbumCover({
  album,
  compact = false,
  className,
}: {
  album: Album;
  compact?: boolean;
  className?: string;
}) {
  const palette = palettes[album.cover];
  const uid = `cover-${album.id}`;
  const dotId = `${uid}-dots`;
  const fadeId = `${uid}-fade`;
  const hazeId = `${uid}-haze`;
  const lines = album.coverLines;
  const fontSize = lines.length >= 3 ? 92 : 108;
  const lineHeight = fontSize * 0.94;
  const startY = lines.length >= 3 ? 748 : 796;

  return (
    <svg
      viewBox="0 0 1000 1000"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Portada del disco ${album.number}, ${album.title}, de El Clásico.`}
    >
      <defs>
        <pattern id={dotId} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill={palette.bg} opacity=".7" />
        </pattern>
        <linearGradient id={hazeId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={palette.deep} />
          <stop offset="58%" stopColor={palette.bg} />
          <stop offset="100%" stopColor="#060606" />
        </linearGradient>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.deep} stopOpacity="0" />
          <stop offset="100%" stopColor={palette.deep} stopOpacity=".98" />
        </linearGradient>
      </defs>

      <rect width="1000" height="1000" fill={palette.bg} />
      <rect width="1000" height="1000" fill={`url(#${hazeId})`} />
      <Registration color={palette.bone} />

      {compact ? (
        <>
          <g transform="translate(500 452) scale(.72) translate(-500 -410)">
            <Motif variant={album.cover} palette={palette} dotId={dotId} />
          </g>
          <rect y="818" width="1000" height="182" fill={palette.deep} />
          <rect y="818" width="1000" height="3" fill={palette.accent} opacity=".6" />
          <text
            x="58"
            y="930"
            fill={palette.bone}
            fontFamily="var(--font-poster), sans-serif"
            fontWeight="800"
            fontSize="136"
            letterSpacing="-2"
          >
            {album.number}
          </text>
          <text
            x="940"
            y="928"
            textAnchor="end"
            fill={palette.accent}
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="20"
            letterSpacing="4"
          >
            EC
          </text>
          <Frame color={palette.bone} />
        </>
      ) : (
        <>
          <Motif variant={album.cover} palette={palette} dotId={dotId} />

          <rect y="600" width="1000" height="120" fill={`url(#${fadeId})`} />
          <rect y="682" width="1000" height="318" fill={palette.deep} />
          <line x1="0" y1="682" x2="1000" y2="682" stroke={palette.accent} strokeOpacity=".5" />

          <line x1="120" y1="96" x2="880" y2="96" stroke={palette.bone} strokeOpacity=".08" />

          <g
            fill={palette.bone}
            opacity=".74"
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="17"
            letterSpacing="4.2"
          >
            <text x="58" y="76">EL CLÁSICO</text>
            <text x="942" y="76" textAnchor="end">{`EC-${album.number}`}</text>
          </g>

          <g
            fill={palette.bone}
            opacity=".42"
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="11"
            letterSpacing="3"
          >
            <text x="58" y="126">{`LP ${album.number} — ${album.trackCount} TRACKS`}</text>
            <text x="942" y="126" textAnchor="end">GUALEGUAYCHÚ · AR</text>
          </g>

          <g
            fontFamily="var(--font-poster), sans-serif"
            fontWeight="800"
            fontSize={fontSize}
            letterSpacing="-2"
          >
            {lines.map((line, index) => {
              const y = startY + index * lineHeight;
              return (
                <g key={line}>
                  <text
                    x="68"
                    y={y}
                    fill={palette.accent}
                    opacity=".82"
                    transform="translate(7 6)"
                  >
                    {line}
                  </text>
                  <text x="60" y={y} fill={palette.bone}>
                    {line}
                  </text>
                </g>
              );
            })}
          </g>

          <g
            fill={palette.bone}
            opacity=".34"
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="10"
            letterSpacing="2.6"
          >
            <text x="60" y="966">EL CLÁSICO · ROCK</text>
            <text x="940" y="966" textAnchor="end">{album.status === "upcoming" ? "PRÓXIMAMENTE" : "DISCOS OFICIALES"}</text>
          </g>

          <Frame color={palette.bone} />
        </>
      )}
    </svg>
  );
}
