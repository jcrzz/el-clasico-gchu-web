import { ArrowUp, Mail } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import type { SiteSettings } from "@/lib/types";
import { whatsappUrl } from "@/lib/utils";

const navLeft = [
  { href: "#inicio", label: "INICIO" },
  { href: "#historia", label: "HISTORIA" },
  { href: "#la-hermandad", label: "LA HERMANDAD" },
  { href: "#musica", label: "MÚSICA" },
];

const navRight = [
  { href: "#shows", label: "SHOWS" },
  { href: "#fotos", label: "FOTOS" },
  { href: "#epk", label: "EPK" },
  { href: "#contacto", label: "CONTACTO" },
];

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]">
      <div className="shell relative pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <a
              href="#inicio"
              className="display inline-block text-[clamp(2.2rem,4vw,3.2rem)] leading-none text-bone transition-colors hover:text-fire"
            >
              EL CLÁSICO
            </a>
            <p className="mt-4 max-w-xs text-[0.86rem] leading-relaxed text-ash">
              Rock desde Gualeguaychú, Entre Ríos, Argentina.
            </p>
            <p className="mt-6 font-mono text-[8px] tracking-[0.2em] text-white/50">
              EST. 2018 / LA HERMANDAD
            </p>
            <div className="mt-6 inline-flex items-center gap-3 border border-white/12 px-3 py-2">
              <span className="h-1.5 w-1.5 bg-fire" aria-hidden="true" />
              <span className="font-mono text-[8px] tracking-[0.16em] text-ash">
                GIRA 2026 / ARGENTINA + URUGUAY
              </span>
            </div>
          </div>

          <nav
            aria-label="Navegación del pie"
            className="grid grid-cols-2 gap-x-8 gap-y-0 md:col-span-4"
          >
            {[navLeft, navRight].map((column, index) => (
              <div key={index}>
                <p className="mb-4 font-mono text-[8px] tracking-[0.2em] text-white/50">
                  {index === 0 ? "EXPLORAR" : "MÁS"}
                </p>
                <ul>
                  {column.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="group flex items-center justify-between gap-2 border-b border-white/[0.06] py-2.5 font-mono text-[9px] tracking-[0.12em] text-ash transition-colors hover:text-bone"
                      >
                        {link.label}
                        <span
                          aria-hidden="true"
                          className="h-px w-3 bg-white/15 transition-all duration-300 group-hover:w-5 group-hover:bg-fire"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="md:col-span-3">
            <p className="mb-4 font-mono text-[8px] tracking-[0.2em] text-white/50">
              CONTACTO
            </p>
            <a
              href={`mailto:${settings.email}`}
              className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.04em] text-bone transition-colors hover:text-fire"
            >
              <Mail size={13} strokeWidth={1.4} aria-hidden="true" />
              {settings.email}
            </a>
            <a
              href={whatsappUrl(settings.whatsapp, settings.whatsappMessage)}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.04em] text-wa"
            >
              <WhatsAppIcon className="h-[13px] w-[13px]" />
              WHATSAPP
            </a>

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {settings.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-[8px] tracking-[0.14em] text-ash underline decoration-white/15 underline-offset-4 transition-colors hover:text-bone"
                  >
                    {social.label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-6 font-mono text-[8px] leading-relaxed tracking-[0.1em] text-white/50">
              {settings.city.toUpperCase()} / {settings.province.toUpperCase()}
              <br />
              {settings.country.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[8px] tracking-[0.08em] text-white/50">
            © 2026 El Clásico. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5 font-mono text-[8px] tracking-[0.14em] text-white/50">
            <span>SITIO OFICIAL</span>
            <a
              href="#inicio"
              className="group flex items-center gap-1.5 transition-colors hover:text-bone"
            >
              VOLVER ARRIBA
              <ArrowUp
                size={12}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="relative overflow-hidden border-t border-white/[0.06]">
        <p
          className="display translate-y-[16%] select-none whitespace-nowrap px-4 text-[clamp(4rem,19vw,17rem)] leading-[0.72] text-transparent"
          style={{ WebkitTextStroke: "1px rgba(244,244,245,0.07)" }}
        >
          EL CLÁSICO
        </p>
      </div>
    </footer>
  );
}
