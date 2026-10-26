"use client";

import { useRef, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

export function EmailCard({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div className="border border-white/12 bg-carbon p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
          EMAIL
        </p>
        <Mail size={16} strokeWidth={1.4} className="text-ash" aria-hidden="true" />
      </div>

      <a
        href={`mailto:${email}`}
        className="mt-4 block break-all font-mono text-[0.95rem] tracking-[-0.01em] text-bone transition-colors hover:text-fire"
      >
        {email}
      </a>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <p className="font-mono text-[8px] tracking-[0.12em] text-white/50">
          PRENSA / SHOWS / CONSULTAS
        </p>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-ash transition-colors hover:text-bone"
          aria-label={copied ? "Email copiado" : "Copiar email"}
        >
          {copied ? (
            <>
              <Check size={12} className="text-wa" aria-hidden="true" />
              COPIADO
            </>
          ) : (
            <>
              <Copy size={12} aria-hidden="true" />
              COPIAR
            </>
          )}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? "Email copiado al portapapeles" : ""}
        </span>
      </div>
    </div>
  );
}
