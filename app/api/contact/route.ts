import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { settings } from "@/lib/mock-data";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
  company: z.string().max(200).optional().default(""),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "No pudimos leer el formulario. Probá de nuevo." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Revisá los datos y volvé a intentar." },
      { status: 400 },
    );
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot: bots complete hidden fields. Pretend success and drop the message.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY missing — demo mode", {
        name,
        email,
      });
      return NextResponse.json({ ok: true, demo: true });
    }

    return NextResponse.json(
      {
        error:
          "El formulario no está disponible en este momento. Escribinos por WhatsApp.",
      },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const to = process.env.CONTACT_TO_EMAIL ?? settings.email;
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "El Clásico <web@elclasico.com>";

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Nuevo mensaje de ${name} — elclasico.com`,
      text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="background:#070707;padding:32px;font-family:Arial,Helvetica,sans-serif;color:#f4f4f5">
          <div style="max-width:560px;margin:0 auto;border:1px solid #262626;background:#111111">
            <div style="height:4px;background:#e11d48"></div>
            <div style="padding:28px">
              <p style="margin:0 0 20px;font-size:11px;letter-spacing:2px;color:#8b8b90">EL CLÁSICO / CONTACTO WEB</p>
              <h1 style="margin:0 0 24px;font-size:26px;line-height:1.1;color:#f4f4f5">Nuevo mensaje</h1>
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:1.5px;color:#8b8b90">NOMBRE</p>
              <p style="margin:0 0 18px;font-size:16px;color:#f4f4f5">${safeName}</p>
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:1.5px;color:#8b8b90">EMAIL</p>
              <p style="margin:0 0 18px;font-size:16px;color:#f4f4f5"><a href="mailto:${safeEmail}" style="color:#f59e0b">${safeEmail}</a></p>
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:1.5px;color:#8b8b90">MENSAJE</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8">${safeMessage}</p>
              <p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #262626;font-size:11px;color:#8b8b90">Respondé directamente a este email para contestarle a ${safeName}.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] send failed", error);
    return NextResponse.json(
      {
        error:
          "No pudimos enviar el mensaje. Probá de nuevo en un momento o escribinos por WhatsApp.",
      },
      { status: 502 },
    );
  }
}
