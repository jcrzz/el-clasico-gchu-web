"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, Maximize2, X } from "lucide-react";
import { CropMarks, SectionHeading } from "@/components/ui/section-heading";
import type { Support as SupportContent, SupportTier } from "@/lib/types";
import { cn, externalLinkProps, whatsappUrl } from "@/lib/utils";

const FREE_ID = "__free__";
const MIN_FREE_AMOUNT = 500;
const amountFormat = new Intl.NumberFormat("es-AR");

function formatAmount(value: number) {
  return `$${amountFormat.format(value)}`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 7);
}

function subscribeToClient() {
  return () => {};
}

const rowFocus =
  "[&:has(input:focus-visible)]:outline [&:has(input:focus-visible)]:outline-2 [&:has(input:focus-visible)]:-outline-offset-2 [&:has(input:focus-visible)]:outline-amber";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } catch {
        // Algunos navegadores bloquean el portapapeles sin gesto explícito.
      }
      document.body.removeChild(area);
    }

    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copiar ${label}`}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[8px] tracking-[0.14em] transition-all duration-200",
        copied
          ? "border-ink bg-ink text-amber motion-safe:-rotate-2"
          : "border-ink/25 text-ink/60 hover:border-ink hover:text-ink",
      )}
    >
      {copied ? (
        <Check size={11} aria-hidden="true" />
      ) : (
        <Copy size={11} aria-hidden="true" />
      )}
      {copied ? "¡COPIADO!" : "COPIAR"}
      <span role="status" className="sr-only">
        {copied ? `${label} copiado al portapapeles` : ""}
      </span>
    </button>
  );
}

function TierOption({
  tier,
  index,
  selected,
  onSelect,
}: {
  tier: SupportTier;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer gap-4 border-b border-white/10 px-5 py-5 transition-colors sm:px-7",
        selected ? "bg-white/[0.04]" : "hover:bg-white/[0.02]",
        rowFocus,
      )}
    >
      <input
        type="radio"
        name="aporte"
        value={tier.id}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-0 left-0 w-[2px] origin-top bg-fire transition-transform duration-300",
          selected ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50",
        )}
      />

      <span
        aria-hidden="true"
        className="pt-1.5 font-mono text-[9px] tracking-[0.14em] text-white/30"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-4">
          <span
            className={cn(
              "display text-[clamp(1.3rem,2.1vw,1.85rem)] leading-none transition-colors",
              selected ? "text-fire" : "text-bone",
            )}
          >
            {tier.title}
          </span>
          <span
            className={cn(
              "display shrink-0 text-[clamp(1.25rem,1.9vw,1.7rem)] leading-none tabular-nums transition-colors",
              selected ? "text-fire" : "text-bone/80",
            )}
          >
            {formatAmount(tier.amount)}
          </span>
        </span>

        <span className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
          <span className="max-w-[24rem] text-[0.82rem] leading-relaxed text-ash">
            {tier.description}
          </span>
          {selected ? (
            <span className="border border-amber/40 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.16em] text-amber">
              ELEGIDO
            </span>
          ) : tier.featured ? (
            <span className="border border-fire/40 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.16em] text-fire">
              DESTACADO
            </span>
          ) : null}
        </span>
      </span>
    </label>
  );
}

function TransferPass({
  support,
  onShowQr,
}: {
  support: SupportContent;
  onShowQr: () => void;
}) {
  const alias = support.alias.toUpperCase();

  return (
    <div className="relative flex h-full flex-col bg-bone text-ink">
      <CropMarks className="text-ink/25" />

      <div className="flex items-center justify-between gap-4 border-b border-ink/15 bg-ink px-5 py-3 sm:px-7">
        <span className="font-mono text-[8px] tracking-[0.2em] text-bone/80">
          PASE DE BACKSTAGE
        </span>
        <span className="font-mono text-[8px] tracking-[0.18em] text-fire">
          Nº 001 / 2026
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6 sm:px-7 sm:py-7">
        <div>
          <p className="font-mono text-[8px] tracking-[0.2em] text-ink/45">
            ALIAS
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="break-all font-mono text-[clamp(0.95rem,2.1vw,1.3rem)] leading-none tracking-[0.01em] text-ink">
              {alias}
            </p>
            <CopyButton value={alias} label="el alias" />
          </div>
        </div>

        <div className="mt-5 border-t border-dashed border-ink/25 pt-5">
          <p className="font-mono text-[8px] tracking-[0.2em] text-ink/45">
            CVU / CBU
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="break-all font-mono text-[0.82rem] leading-none tracking-[0.04em] text-ink/85">
              {support.cvu}
            </p>
            <CopyButton value={support.cvu} label="el CVU" />
          </div>
        </div>

        <div className="mt-5 border-t border-ink/15 pt-5">
          <p className="font-mono text-[8px] tracking-[0.2em] text-ink/45">
            TITULAR
          </p>
          <p className="display mt-2 text-[clamp(1.35rem,2.4vw,1.8rem)] leading-none text-ink">
            {support.accountHolder}
          </p>
        </div>

        <div className="mt-auto flex items-start gap-4 border-t-2 border-dashed border-ink/30 pt-6 sm:gap-5">
          <div className="relative aspect-square w-[116px] shrink-0 border border-ink/20 bg-white p-2 sm:w-[132px]">
            {support.qrImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={support.qrImageUrl}
                alt={`Código QR para transferir a ${support.accountHolder}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/25 px-2 text-center">
                <span className="font-mono text-[7px] tracking-[0.16em] text-ink/40">
                  ESCANEÁ O COPIÁ
                </span>
                <span className="break-all font-mono text-[9px] leading-[1.4] tracking-[0.02em] text-ink/80">
                  {alias}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[8px] leading-relaxed tracking-[0.14em] text-ink/45">
              APORTE DIRECTO
              <br />
              SIN COMISIÓN
            </p>
            <p className="mt-2 max-w-[15rem] text-[0.78rem] leading-relaxed text-ink/70">
              {support.qrImageUrl
                ? "Escaneá desde la app de tu banco o copiá el alias. Transferencia directa, sin comisiones."
                : "Copiá el alias en la app de tu banco. Transferencia directa, sin comisiones."}
            </p>
            {support.qrImageUrl ? (
              <button
                type="button"
                onClick={onShowQr}
                className="mt-3 inline-flex items-center gap-2 border border-ink/25 px-2.5 py-1.5 font-mono text-[8px] tracking-[0.14em] text-ink/70 transition-colors hover:border-ink hover:bg-ink hover:text-bone"
              >
                <Maximize2 size={11} aria-hidden="true" />
                VER QR EN GRANDE
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/15 px-5 py-3 font-mono text-[7px] tracking-[0.16em] text-ink/50 sm:px-7">
        <span>APORTE VOLUNTARIO / SIN DÉBITOS</span>
        <span>GUALEGUAYCHÚ, AR</span>
      </div>
    </div>
  );
}

function QrDialog({
  open,
  onClose,
  support,
}: {
  open: boolean;
  onClose: () => void;
  support: SupportContent;
}) {
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const reduceMotion = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    }, 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
        ),
      ).filter((element) => element.offsetParent !== null);

      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!isClient || !support.qrImageUrl) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-sm border border-ink/20 bg-bone p-4 text-ink shadow-2xl shadow-black/70 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[8px] tracking-[0.18em] text-ink/45">
                  TRANSFERENCIA DIRECTA
                </p>
                <h3
                  id={titleId}
                  className="display mt-1.5 text-2xl leading-none text-ink"
                >
                  QR DE PAGO
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar el QR"
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-ink/25 text-ink/60 transition-colors hover:border-ink hover:bg-ink hover:text-bone"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 aspect-square w-full border border-ink/15 bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={support.qrImageUrl}
                alt={`Código QR para transferir a ${support.accountHolder}`}
                className="h-full w-full object-contain"
              />
            </div>

            <p className="mt-4 break-all font-mono text-[8px] leading-relaxed tracking-[0.12em] text-ink/55">
              {support.alias.toUpperCase()} /{" "}
              {support.accountHolder.toUpperCase()}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function Support({
  support,
  whatsapp,
}: {
  support: SupportContent;
  whatsapp: string;
}) {
  const tiers = support.tiers;
  const defaultTier = tiers.find((tier) => tier.featured) ?? tiers[0] ?? null;

  const [selectedId, setSelectedId] = useState(defaultTier?.id ?? FREE_ID);
  const [freeAmount, setFreeAmount] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  const selectedTier = tiers.find((tier) => tier.id === selectedId) ?? null;
  const isFree = selectedId === FREE_ID;
  const freeDigits = onlyDigits(freeAmount);
  const freeValue = freeDigits ? Number(freeDigits) : 0;
  const amount = isFree ? freeValue : (selectedTier?.amount ?? 0);
  const amountLabel = amount > 0 ? formatAmount(amount) : "";
  const rawLink = isFree
    ? support.freeAmountLink
    : (selectedTier?.paymentLink ?? "");
  const href =
    rawLink ||
    whatsappUrl(
      whatsapp,
      `Hola El Clásico, quiero aportar ${amountLabel || "un monto libre"} al proyecto.`,
    );
  const isWhatsappLink = /wa\.me|api\.whatsapp\.com/i.test(rawLink);
  const method = rawLink && !isWhatsappLink ? "POR MERCADO PAGO" : "POR WHATSAPP";
  const target = rawLink && !isWhatsappLink ? "Mercado Pago" : "WhatsApp";
  const disabled = isFree && freeValue < MIN_FREE_AMOUNT;

  return (
    <section
      id="apoyar"
      className="section relative overflow-hidden border-t border-white/10 bg-ink"
      aria-labelledby="apoyar-title"
    >
      <div className="pointer-events-none absolute -left-40 top-24 h-[460px] w-[460px] ambient-fire opacity-40" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 ambient-amber opacity-20" />

      <div className="shell relative">
        <SectionHeading
          id="apoyar-title"
          title="BANCÁ EL PROYECTO"
          subtitle="El Clásico es autogestión e independencia. Tu aporte va directo a grabar nuevos discos, mantener los equipos y llevar nuestra música a cada rincón."
        />

        <div className="grid border-y border-white/12 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="flex flex-col border-b border-white/12 bg-carbon lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-7">
              <p className="font-mono text-[9px] tracking-[0.18em] text-fire">
                ELEGÍ TU APORTE
              </p>
              <p className="font-mono text-[8px] tracking-[0.14em] text-white/40">
                {String(tiers.length + 1).padStart(2, "0")} FORMAS
              </p>
            </div>

            <fieldset className="flex-1">
              <legend className="sr-only">
                Elegí el monto de tu aporte al proyecto
              </legend>

              {tiers.map((tier, index) => (
                <TierOption
                  key={tier.id}
                  tier={tier}
                  index={index}
                  selected={!isFree && selectedId === tier.id}
                  onSelect={() => setSelectedId(tier.id)}
                />
              ))}

              <div
                className={cn(
                  "relative flex gap-4 px-5 py-5 transition-colors sm:px-7",
                  isFree ? "bg-white/[0.04]" : "hover:bg-white/[0.02]",
                  rowFocus,
                )}
              >
                <input
                  type="radio"
                  name="aporte"
                  value={FREE_ID}
                  checked={isFree}
                  onChange={() => setSelectedId(FREE_ID)}
                  id="aporte-libre"
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-y-0 left-0 w-[2px] origin-top bg-fire transition-transform duration-300",
                    isFree ? "scale-y-100" : "scale-y-0",
                  )}
                />

                <span
                  aria-hidden="true"
                  className="pt-1.5 font-mono text-[9px] tracking-[0.14em] text-white/30"
                >
                  {String(tiers.length + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <label
                      htmlFor="aporte-libre"
                      className={cn(
                        "display cursor-pointer text-[clamp(1.3rem,2.1vw,1.85rem)] leading-none transition-colors",
                        isFree ? "text-fire" : "text-bone",
                      )}
                    >
                      MONTO LIBRE
                    </label>

                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="font-mono text-[0.9rem] text-ash"
                      >
                        $
                      </span>
                      <input
                        id="aporte-libre-monto"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={freeDigits ? amountFormat.format(Number(freeDigits)) : ""}
                        onChange={(event) => {
                          setSelectedId(FREE_ID);
                          setFreeAmount(onlyDigits(event.target.value));
                        }}
                        onFocus={() => setSelectedId(FREE_ID)}
                        placeholder="7.500"
                        aria-label="Monto libre en pesos argentinos"
                        className="field w-24 text-right font-mono text-[0.95rem] tracking-[0.04em]"
                      />
                    </span>
                  </div>

                  <p className="mt-2.5 max-w-[24rem] text-[0.82rem] leading-relaxed text-ash">
                    El monto que puedas y quieras. Cada peso suma.
                  </p>
                </div>
              </div>
            </fieldset>

            <div className="border-t border-white/12 p-5 sm:p-7">
              <a
                href={href}
                {...externalLinkProps(href)}
                aria-disabled={disabled || undefined}
                onClick={(event) => {
                  if (disabled) event.preventDefault();
                }}
                className={cn(
                  "btn w-full justify-between gap-4 px-5 py-4 text-[0.68rem]",
                  disabled
                    ? "cursor-not-allowed border border-white/15 bg-white/[0.03] text-white/35"
                    : "btn-fire",
                )}
              >
                <span>
                  {disabled
                    ? "INGRESÁ UN MONTO PARA APORTAR"
                    : `APORTAR ${amountLabel} ${method}`}
                </span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>

              <p
                className={cn(
                  "mt-3 font-mono text-[8px] leading-relaxed tracking-[0.1em]",
                  disabled ? "text-amber" : "text-white/40",
                )}
              >
                {disabled
                  ? `El monto mínimo para el aporte libre es ${formatAmount(MIN_FREE_AMOUNT)}.`
                  : `Abre ${target} en una pestaña nueva.`}
              </p>
            </div>
          </div>

          <TransferPass support={support} onShowQr={() => setQrOpen(true)} />
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-4 font-mono text-[8px] leading-relaxed tracking-[0.14em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <span>
            NO HAY SUSCRIPCIONES NI DÉBITOS AUTOMÁTICOS: APORTÁS CUANDO QUERÉS.
          </span>
          <span className="text-fire">EL CLÁSICO / AUTOGESTIÓN DESDE 2018</span>
        </div>
      </div>

      <QrDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        support={support}
      />
    </section>
  );
}
