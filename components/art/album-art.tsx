import { cn } from "@/lib/utils";

export function AlbumArt({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Tapa del álbum Fuego Interior de El Clásico: una llama tallada en rojo y ámbar sobre fondo negro."
    >
      <defs>
        <pattern
          id="album-halftone"
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.15" fill="#070707" opacity=".62" />
        </pattern>
        <linearGradient id="album-haze" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#2a0710" />
          <stop offset="55%" stopColor="#120407" />
          <stop offset="100%" stopColor="#080606" />
        </linearGradient>
        <linearGradient id="album-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070707" stopOpacity="0" />
          <stop offset="100%" stopColor="#070707" stopOpacity=".96" />
        </linearGradient>
      </defs>

      <rect width="1000" height="1000" fill="url(#album-haze)" />

      {/* registration grid */}
      <g stroke="#f4f4f5" strokeOpacity=".055">
        <line x1="0" y1="250" x2="1000" y2="250" />
        <line x1="0" y1="500" x2="1000" y2="500" />
        <line x1="0" y1="750" x2="1000" y2="750" />
        <line x1="250" y1="0" x2="250" y2="1000" />
        <line x1="750" y1="0" x2="750" y2="1000" />
      </g>

      <circle
        cx="500"
        cy="570"
        r="330"
        fill="none"
        stroke="#f4f4f5"
        strokeOpacity=".08"
      />

      {compact ? (
        <g>
          <circle
            cx="500"
            cy="500"
            r="300"
            fill="#e11d48"
            opacity=".12"
            style={{ filter: "blur(40px)" }}
          />
          <g transform="translate(508 520)" opacity=".42">
            <path
              d="M0 -260C60 -180 120 -130 120 -40C120 70 70 150 0 170C-70 150 -120 70 -120 -40C-120 -110 -80 -160 -40 -200C-30 -140 0 -100 30 -70C20 -150 10 -210 0 -260Z"
              fill="#f59e0b"
            />
          </g>
          <g transform="translate(500 512)">
            <path
              d="M0 -260C60 -180 120 -130 120 -40C120 70 70 150 0 170C-70 150 -120 70 -120 -40C-120 -110 -80 -160 -40 -200C-30 -140 0 -100 30 -70C20 -150 10 -210 0 -260Z"
              fill="#dc2626"
            />
            <path
              d="M0 -120C30 -70 60 -40 60 0C60 50 30 90 0 100C-30 90 -60 50 -60 0C-60 -30 -40 -60 -20 -80C-14 -50 0 -30 14 -14C8 -60 4 -90 0 -120Z"
              fill="#f59e0b"
            />
          </g>
        </g>
      ) : (
      <g transform="translate(0 -110)">
        {/* offset plate, deliberately misregistered */}
        <g transform="translate(13 10)" opacity=".42">
          <path
            d="M500 812 L442 752 L458 706 L414 690 L436 630 L408 604 L452 596 L438 536 L480 566 L472 496 L508 540 L524 472 L550 548 L574 506 L584 590 L622 556 L616 638 L660 610 L640 690 L686 666 L660 736 L704 744 L658 790 L614 822 L576 786 L542 826 Z"
            fill="#f59e0b"
          />
        </g>

        {/* main woodcut flame */}
        <path
          d="M500 812 L442 752 L458 706 L414 690 L436 630 L408 604 L452 596 L438 536 L480 566 L472 496 L508 540 L524 472 L550 548 L574 506 L584 590 L622 556 L616 638 L660 610 L640 690 L686 666 L660 736 L704 744 L658 790 L614 822 L576 786 L542 826 Z"
          fill="#dc2626"
        />
        <path
          d="M500 812 L442 752 L458 706 L414 690 L436 630 L408 604 L452 596 L438 536 L480 566 L472 496 L508 540 L524 472 L550 548 L574 506 L584 590 L622 556 L616 638 L660 610 L640 690 L686 666 L660 736 L704 744 L658 790 L614 822 L576 786 L542 826 Z"
          fill="url(#album-halftone)"
          opacity=".32"
        />

        {/* inner tongues */}
        <path
          d="M500 790 L470 728 L484 688 L456 660 L478 616 L470 570 L500 612 L512 548 L534 610 L556 582 L552 654 L582 634 L570 700 L604 682 L586 740 L612 752 L574 784 L542 758 L520 792 Z"
          fill="#e11d48"
        />
        <path
          d="M500 776 L482 724 L496 690 L480 664 L500 636 L504 586 L522 636 L536 610 L542 674 L560 656 L550 708 L574 694 L560 742 L566 756 L536 746 L520 774 Z"
          fill="#f59e0b"
          opacity=".82"
        />

        {/* cut-out slashes */}
        <g fill="#0b0406">
          <path d="M438 610 L470 598 L492 646 L454 658 Z" opacity=".85" />
          <path d="M556 626 L590 614 L606 662 L568 674 Z" opacity=".8" />
          <path d="M492 700 L528 692 L540 724 L504 732 Z" opacity=".7" />
        </g>

        {/* side tongues */}
        <g fill="#dc2626">
          <path d="M366 812 L334 762 L350 728 L324 704 L348 664 L372 704 L384 760 L390 812 Z" opacity=".9" />
          <path d="M634 812 L622 768 L648 738 L638 698 L668 724 L682 776 L674 812 Z" opacity=".85" />
        </g>

        {/* sparks */}
        <g fill="#f59e0b">
          <path d="M322 470 l7 14 -7 14 -7 -14 Z" opacity=".75" />
          <path d="M702 430 l6 12 -6 12 -6 -12 Z" opacity=".6" />
          <path d="M642 512 l4 8 -4 8 -4 -8 Z" opacity=".5" />
          <path d="M356 566 l4 8 -4 8 -4 -8 Z" opacity=".45" />
          <path d="M748 586 l5 10 -5 10 -5 -10 Z" opacity=".5" />
          <path d="M286 646 l4 8 -4 8 -4 -8 Z" opacity=".35" />
          <path d="M704 336 l4 8 -4 8 -4 -8 Z" opacity=".45" />
        </g>
      </g>
      )}

      {!compact ? (
        <>
          <rect y="600" width="1000" height="110" fill="url(#album-fade)" />
          <rect y="694" width="1000" height="306" fill="#080606" />
          <line
            x1="0"
            y1="694"
            x2="1000"
            y2="694"
            stroke="#e11d48"
            strokeOpacity=".38"
          />

          <line
            x1="120"
            y1="96"
            x2="880"
            y2="96"
            stroke="#f4f4f5"
            strokeOpacity=".06"
          />

          <g
            fill="#f4f4f5"
            opacity=".72"
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="17"
            letterSpacing="4.2"
          >
            <text x="58" y="76">EL CLÁSICO</text>
            <text x="942" y="76" textAnchor="end">MMXXV</text>
          </g>

          <g
            fill="#f4f4f5"
            opacity=".4"
            fontFamily="var(--font-jetbrains), monospace"
            fontSize="11"
            letterSpacing="3.2"
          >
            <text x="58" y="126">LP — 06 TRACKS</text>
            <text x="942" y="126" textAnchor="end">GUALEGUAYCHÚ · AR</text>
          </g>

          <g
            fontFamily="var(--font-poster), sans-serif"
            fontWeight="800"
            fontSize="128"
            letterSpacing="-2"
          >
            <text x="60" y="818" fill="#e11d48" opacity=".85" transform="translate(7 5)">
              FUEGO
            </text>
            <text x="60" y="818" fill="#f4f4f5">
              FUEGO
            </text>
            <text x="56" y="926" fill="#e11d48" opacity=".85" transform="translate(7 5)">
              INTERIOR
            </text>
            <text x="56" y="926" fill="#f4f4f5">
              INTERIOR
            </text>
          </g>
        </>
      ) : null}

      <rect
        x="28"
        y="28"
        width="944"
        height="944"
        fill="none"
        stroke="#f4f4f5"
        strokeOpacity=".12"
      />
      <path
        d="M28 28h40M28 28v40M972 28h-40M972 28v40M28 972h40M28 972v-40M972 972h-40M972 972v-40"
        stroke="#f4f4f5"
        strokeOpacity=".3"
      />
    </svg>
  );
}
