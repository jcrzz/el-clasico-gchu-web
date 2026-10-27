import { Resend } from "resend";
import { z } from "zod";
import { settings } from "@/lib/mock-data";
import { renderContactEmail } from "./contact-template";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Contanos cómo te llamás.").max(80),
  email: z
    .string()
    .trim()
    .email("Necesitamos un email válido para responderte.")
    .max(160),
  message: z
    .string()
    .trim()
    .min(10, "Escribí al menos 10 caracteres.")
    .max(4000),
  company: z.string().max(200).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;

export type ContactResult =
  | { ok: true; demo?: boolean }
  | { ok: false; error: string; status: number };

function parseRecipients(value: string | undefined) {
  return (value ?? settings.email)
    .split(",")
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

export async function sendContactEmail(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Revisá los datos y volvé a intentar.",
    };
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot: a bot completed the hidden field. Pretend success and drop it.
  if (company) return { ok: true };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY missing — demo mode", {
        name,
        email,
        message,
      });
      return { ok: true, demo: true };
    }

    return {
      ok: false,
      status: 503,
      error:
        "El formulario no está disponible en este momento. Escribinos por WhatsApp.",
    };
  }

  const resend = new Resend(apiKey);
  const to = parseRecipients(process.env.CONTACT_TO_EMAIL);
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "El Clásico <web@elclasico.com>";
  const template = renderContactEmail({ name, email, message });

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });

    if (error) {
      console.error("[contact] Resend error", error);
      return {
        ok: false,
        status: 502,
        error:
          "No pudimos enviar el mensaje. Probá de nuevo en un momento o escribinos por WhatsApp.",
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("[contact] send failed", error);
    return {
      ok: false,
      status: 502,
      error:
        "No pudimos enviar el mensaje. Probá de nuevo en un momento o escribinos por WhatsApp.",
    };
  }
}
