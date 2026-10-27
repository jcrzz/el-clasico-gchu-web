"use client";

import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShowStatus } from "@/lib/types";

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      size={14}
      className={cn("animate-spin", className)}
      aria-hidden="true"
    />
  );
}

export function AdminNotice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "success" | "error";
  children: ReactNode;
  className?: string;
}) {
  const Icon =
    tone === "error" ? AlertTriangle : tone === "success" ? CheckCircle2 : Info;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 border p-3.5",
        tone === "error" && "border-fire/35 bg-fire/[0.06]",
        tone === "success" && "border-amber/30 bg-amber/[0.055]",
        tone === "info" && "border-white/15 bg-white/[0.025]",
        className,
      )}
    >
      <Icon
        size={15}
        className={cn(
          "mt-0.5 shrink-0",
          tone === "error" && "text-fire",
          tone === "success" && "text-amber",
          tone === "info" && "text-bone/60",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 font-mono text-[10px] leading-relaxed tracking-[0.04em] text-bone/80">
        {children}
      </div>
    </div>
  );
}

export function AdminSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div>
        <p className="font-mono text-[10px] tracking-[0.12em] text-bone/85">
          {label}
        </p>
        {description ? (
          <p className="mt-1 text-[11px] leading-relaxed text-ash">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 border transition-colors duration-200",
          checked
            ? "border-fire/70 bg-fire/20"
            : "border-white/20 bg-white/[0.03]",
          disabled && "cursor-not-allowed opacity-40",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-200",
            checked ? "left-6 bg-fire" : "left-1.5 bg-ash",
          )}
        />
      </button>
    </div>
  );
}

export function StatusBadge({ status }: { status: ShowStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[8px] tracking-[0.14em]",
        status === "available" && "border-amber/25 bg-amber/[0.06] text-amber",
        status === "sold-out" && "border-fire/35 bg-fire/[0.08] text-fire",
        status === "paused" && "border-white/15 bg-white/[0.03] text-ash",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1 w-1",
          status === "available" && "bg-amber",
          status === "sold-out" && "bg-fire",
          status === "paused" && "bg-ash",
        )}
      />
      {status === "available"
        ? "A LA VENTA"
        : status === "sold-out"
          ? "SOLD OUT"
          : "PAUSADO"}
    </span>
  );
}

export function AdminPageHeader({
  index,
  title,
  description,
  actions,
}: {
  index: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="border-b border-white/12 pb-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[0.2em] text-fire">
            {index} / CABINA
          </p>
          <h1 className="display mt-2 text-[clamp(2.8rem,6.2vw,5.6rem)] leading-[0.82] text-bone">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-[0.85rem] leading-relaxed text-ash">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function AdminEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.015] px-6 py-12 text-center">
      <span
        aria-hidden="true"
        className="h-2 w-2 rotate-45 border border-fire"
      />
      <p className="display mt-5 text-2xl text-bone/80">{title}</p>
      <p className="mt-2 max-w-sm text-[0.8rem] leading-relaxed text-ash">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

const subscribeToClient = () => () => {};

export function AdminDialog({
  open,
  onClose,
  title,
  eyebrow,
  description,
  children,
  footer,
  variant = "drawer",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "drawer" | "center";
}) {
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      focusables?.[0]?.focus();
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
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);

      if (focusables.length === 0) return;

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
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex bg-ink/80 backdrop-blur-sm"
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
            aria-describedby={description ? descriptionId : undefined}
            initial={
              reduceMotion
                ? false
                : variant === "drawer"
                  ? { x: "100%" }
                  : { opacity: 0, y: 14, scale: 0.98 }
            }
            animate={
              variant === "drawer"
                ? { x: 0 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              reduceMotion
                ? undefined
                : variant === "drawer"
                  ? { x: "100%" }
                  : { opacity: 0, y: 10, scale: 0.98 }
            }
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "flex w-full flex-col border-white/15 bg-carbon shadow-2xl shadow-black/60",
              variant === "drawer"
                ? "ml-auto h-full max-w-xl border-l"
                : "m-auto max-h-[calc(100dvh-2rem)] max-w-lg border",
            )}
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/12 px-5 py-5 sm:px-7">
              <div>
                <p className="font-mono text-[8px] tracking-[0.18em] text-fire">
                  {eyebrow}
                </p>
                <h2
                  id={titleId}
                  className="display mt-2 text-[clamp(1.9rem,4vw,3rem)] leading-none text-bone"
                >
                  {title}
                </h2>
                {description ? (
                  <p
                    id={descriptionId}
                    className="mt-2 max-w-md text-[0.78rem] leading-relaxed text-ash"
                  >
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/15 text-ash transition-colors hover:border-fire/60 hover:text-fire"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {children}
            </div>
            {footer ? (
              <div className="border-t border-white/12 bg-ink/35 px-5 py-4 sm:px-7">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Eliminar",
  pending = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  pending?: boolean;
}) {
  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title={title}
      eyebrow="CONFIRMACIÓN"
      description={description}
      variant="center"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="btn btn-fire disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? <Spinner /> : null}
            {confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-[0.85rem] leading-relaxed text-ash">
        Esta acción no se puede deshacer. Revisá la información antes de
        confirmar.
      </p>
    </AdminDialog>
  );
}
