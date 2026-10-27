import { siteName, siteUrl } from "@/lib/site";

const INK = "#070707";
const CARBON = "#111111";
const SURFACE = "#161616";
const BONE = "#f4f4f5";
const ASH = "#8b8b90";
const FIRE = "#e11d48";
const AMBER = "#f59e0b";
const LINE = "#2a2a2c";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatReceivedAt(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(date);
}

export function renderContactEmail({
  name,
  email,
  message,
  receivedAt = new Date(),
}: {
  name: string;
  email: string;
  message: string;
  receivedAt?: Date;
}) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");
  const dateLabel = escapeHtml(formatReceivedAt(receivedAt));
  const subject = `Nuevo contacto — ${name} / ${siteName}`;
  const preheader = `${name} escribió desde ${siteUrl}`;

  const text = [
    "EL CLÁSICO / CONTACTO WEB",
    "",
    `Nuevo mensaje recibido el ${formatReceivedAt(receivedAt)}`,
    "",
    `Nombre: ${name}`,
    `Email: ${email}`,
    "",
    "Mensaje:",
    message,
    "",
    `Respondé directamente a este correo para contestarle a ${name}.`,
    `${siteUrl}`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:${INK};color:${BONE};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${INK};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${CARBON};border:1px solid ${LINE};">
            <tr>
              <td style="height:5px;background:${FIRE};font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:26px 28px 18px;border-bottom:1px solid ${LINE};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:Arial,Helvetica,sans-serif;font-size:23px;line-height:1;font-weight:800;letter-spacing:1px;color:${BONE};text-transform:uppercase;">
                      El Clásico
                    </td>
                    <td align="right" style="font-family:'Courier New',monospace;font-size:10px;line-height:1.5;letter-spacing:1.5px;color:${FIRE};text-transform:uppercase;">
                      Contacto web
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px 8px;">
                <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:10px;line-height:1.5;letter-spacing:1.8px;color:${ASH};text-transform:uppercase;">
                  Nuevo mensaje / ${dateLabel}
                </p>
                <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:34px;line-height:1;font-weight:800;letter-spacing:-1px;color:${BONE};text-transform:uppercase;">
                  Alguien escribió
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
                  <tr>
                    <td width="50%" style="padding:16px 16px 16px 0;vertical-align:top;border-bottom:1px solid ${LINE};">
                      <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1.6px;color:${ASH};text-transform:uppercase;">Nombre</p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.4;color:${BONE};">${safeName}</p>
                    </td>
                    <td width="50%" style="padding:16px 0 16px 16px;vertical-align:top;border-bottom:1px solid ${LINE};border-left:1px solid ${LINE};">
                      <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1.6px;color:${ASH};text-transform:uppercase;">Email</p>
                      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.4;">
                        <a href="mailto:${safeEmail}" style="color:${AMBER};text-decoration:none;">${safeEmail}</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 30px;">
                <p style="margin:0 0 10px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1.6px;color:${ASH};text-transform:uppercase;">Mensaje</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${SURFACE};border-left:3px solid ${FIRE};">
                  <tr>
                    <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#d6d6da;">
                      ${safeMessage}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 24px;border-top:1px solid ${LINE};">
                <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:${ASH};">
                  Respondé directamente a este correo para contestarle a ${safeName}.
                </p>
                <a href="mailto:${safeEmail}" style="display:inline-block;padding:12px 18px;background:${FIRE};color:${INK};font-family:'Courier New',monospace;font-size:10px;font-weight:700;letter-spacing:1.5px;text-decoration:none;text-transform:uppercase;">
                  Responder a ${safeName}
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:${INK};border-top:1px solid ${LINE};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:'Courier New',monospace;font-size:9px;line-height:1.5;letter-spacing:1.2px;color:${ASH};text-transform:uppercase;">
                      El Clásico / La Hermandad
                    </td>
                    <td align="right" style="font-family:'Courier New',monospace;font-size:9px;line-height:1.5;letter-spacing:1.2px;">
                      <a href="${siteUrl}" style="color:${ASH};text-decoration:none;">elclasico.com.ar</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { html, text, subject };
}
