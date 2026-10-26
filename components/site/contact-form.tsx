"use client";

import { useState, type FormEvent } from "react";
import {
  Check,
  Loader2,
  Send,
  TriangleAlert,
} from "lucide-react";
import { whatsappUrl } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

type Status = "idle" | "sending" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const initialValues = { name: "", email: "", message: "", company: "" };

export function ContactForm({ settings }: { settings: SiteSettings }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  const update = (field: keyof typeof initialValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (field !== "company") {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === "error") {
      setStatus("idle");
      setFeedback("");
    }
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (values.name.trim().length < 2) {
      next.name = "Contanos cómo te llamás.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      next.email = "Necesitamos un email válido para responderte.";
    }
    if (values.message.trim().length < 10) {
      next.message = "Escribí al menos 10 caracteres.";
    }
    return next;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`contact-${firstError}`)?.focus();
      return;
    }

    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error ??
            "No pudimos enviar el mensaje. Probá de nuevo en un momento.",
        );
      }

      setStatus("success");
      setValues(initialValues);
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof Error
          ? error.message
          : "No pudimos enviar el mensaje. Probá de nuevo.",
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[380px] flex-col items-start justify-center border border-white/12 bg-carbon p-7 sm:p-9"
      >
        <span className="flex h-11 w-11 items-center justify-center border border-fire/50 bg-fire/10 text-fire">
          <Check size={20} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <p className="display mt-6 text-[2.2rem] leading-none text-bone">
          MENSAJE ENVIADO
        </p>
        <p className="mt-3 max-w-sm text-[0.9rem] leading-relaxed text-ash">
          Gracias por escribir. Te respondemos a la brevedad, al email que nos
          dejaste.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn btn-ghost mt-7"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="border border-white/12 bg-carbon p-6 sm:p-8"
      aria-describedby="contact-form-note"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
          FORMULARIO DE CONTACTO
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.14em] text-white/50">
          <span className="h-1 w-1 bg-fire" />
          RESPUESTA DIRECTA
        </span>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="font-mono text-[9px] tracking-[0.16em] text-ash"
          >
            NOMBRE
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            placeholder="Tu nombre"
            className="field mt-1"
          />
          {errors.name ? (
            <p
              id="contact-name-error"
              className="mt-2 font-mono text-[9px] leading-relaxed text-amber"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="font-mono text-[9px] tracking-[0.16em] text-ash"
          >
            EMAIL
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            placeholder="vos@email.com"
            className="field mt-1"
          />
          {errors.email ? (
            <p
              id="contact-email-error"
              className="mt-2 font-mono text-[9px] leading-relaxed text-amber"
            >
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="contact-message"
          className="font-mono text-[9px] tracking-[0.16em] text-ash"
        >
          MENSAJE
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : "contact-form-note"
          }
          placeholder="Contanos qué tenés en mente: un show, una entrevista, una colaboración."
          className="field mt-1 resize-y"
        />
        {errors.message ? (
          <p
            id="contact-message-error"
            className="mt-2 font-mono text-[9px] leading-relaxed text-amber"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company">Empresa</label>
        <input
          id="contact-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => update("company", event.target.value)}
        />
      </div>

      {status === "error" ? (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 border border-fire/30 bg-fire/[0.06] p-3"
        >
          <TriangleAlert
            size={15}
            className="mt-0.5 shrink-0 text-fire"
            aria-hidden="true"
          />
          <div>
            <p className="font-mono text-[9px] leading-relaxed tracking-[0.06em] text-bone/85">
              {feedback}
            </p>
            <a
              href={whatsappUrl(settings.whatsapp, settings.whatsappMessage)}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-block font-mono text-[9px] tracking-[0.06em] text-wa underline decoration-wa/40 underline-offset-4"
            >
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          id="contact-form-note"
          className="max-w-[15rem] font-mono text-[8px] leading-relaxed tracking-[0.1em] text-white/50"
        >
          TUS DATOS SÓLO SE USAN PARA RESPONDERTE.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-solid group w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Enviando
            </>
          ) : (
            <>
              Enviar mensaje
              <Send
                size={14}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
