import {
  ArrowUpRight,
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/ui/social-icons";
import { ContactForm } from "@/components/site/contact-form";
import { EmailCard } from "@/components/site/email-card";
import type { SiteSettings } from "@/lib/types";
import { externalLinkProps, whatsappUrl } from "@/lib/utils";

const socialIcons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
} as const;

export function Contact({ settings }: { settings: SiteSettings }) {
  return (
    <section
      id="contacto"
      className="section relative overflow-hidden border-t border-white/10"
      aria-labelledby="contacto-title"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 ambient-fire opacity-25" />
      <div className="shell relative">
        <header className="mb-12 md:mb-16">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="mt-2 hidden h-3 w-3 shrink-0 bg-fire md:block" />
              <h2
                id="contacto-title"
                className="display text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.82]"
              >
                CONTACTO
              </h2>
            </div>
            <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:pb-1 md:text-right">
              Shows, prensa, entradas o simplemente rock. Escribinos y del otro
              lado hay alguien de La Hermandad.
            </p>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm settings={settings} />
          </div>

          <div className="flex flex-col gap-5 lg:col-span-4 lg:col-start-9">
            <a
              href={whatsappUrl(settings.whatsapp, settings.whatsappMessage)}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative overflow-hidden border border-wa/35 bg-carbon p-5 transition-colors duration-300 hover:border-wa hover:bg-wa/[0.06] sm:p-6"
            >
              <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-wa" />
              <span className="pointer-events-none absolute inset-0 scene-grain opacity-15" />
              <span className="relative flex items-start justify-between gap-4">
                <span>
                  <span className="font-mono text-[9px] tracking-[0.18em] text-wa/80">
                    RESPUESTA DIRECTA
                  </span>
                  <span className="display mt-3 block text-[1.8rem] leading-[0.95] text-bone">
                    ESCRIBINOS
                    <br />
                    POR WHATSAPP
                  </span>
                </span>
                <WhatsAppIcon className="h-[30px] w-[30px] shrink-0 text-wa transition-transform duration-300 group-hover:-translate-y-1" />
              </span>
              <span className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-mono text-[8px] tracking-[0.12em] text-ash">
                  LUN A VIE / 10—19 H
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-wa transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>

            <EmailCard email={settings.email} />

            <div className="border border-white/12 bg-carbon">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                  SEGUINOS EN REDES
                </p>
                <span aria-hidden="true" className="h-1 w-1 bg-fire" />
              </div>
              <ul>
                {settings.socials.map((social) => {
                  const Icon =
                    socialIcons[social.label as keyof typeof socialIcons];
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        {...externalLinkProps(social.href)}
                        className="group flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-3.5 transition-colors last:border-b-0 hover:bg-white/[0.03]"
                      >
                        <span className="flex items-center gap-3">
                          {Icon ? (
                            <Icon className="h-[15px] w-[15px] text-ash transition-colors group-hover:text-fire" />
                          ) : null}
                          <span className="font-mono text-[9px] tracking-[0.12em] text-bone">
                            {social.label.toUpperCase()}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 font-mono text-[8px] tracking-[0.08em] text-white/50">
                          {social.handle}
                          <ArrowUpRight
                            size={12}
                            className="text-ash transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fire"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="px-1 font-mono text-[8px] leading-relaxed tracking-[0.1em] text-white/50">
              PARA CONTRATACIONES Y CONSULTAS DE PRENSA:
              <br />
              <a
                href={`mailto:${settings.pressEmail}`}
                className="text-ash underline decoration-white/20 underline-offset-4 transition-colors hover:text-bone"
              >
                {settings.pressEmail}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
