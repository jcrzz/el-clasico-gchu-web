import {
  ArrowUpRight,
  Download,
  FileText,
  Map,
} from "lucide-react";
import { StagePlot } from "@/components/art/stage-plot";
import { CropMarks } from "@/components/ui/section-heading";
import type { Epk as EpkType } from "@/lib/types";
import { externalLinkProps } from "@/lib/utils";

export function Epk({ epk }: { epk: EpkType }) {
  const riderDownload = epk.downloads.find(
    (download) => download.id === "d-rider",
  );

  return (
    <section
      id="epk"
      className="section relative overflow-hidden border-t border-white/10 bg-carbon"
      aria-labelledby="epk-title"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 ambient-amber opacity-20" />
      <div className="shell relative">
        <header className="mb-12 md:mb-16">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="mt-2 hidden h-3 w-3 shrink-0 bg-fire md:block" />
              <h2
                id="epk-title"
                className="display text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.82]"
              >
                PRESS KIT
              </h2>
            </div>
            <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:pb-1 md:text-right">
              Material profesional para prensa, productoras y organizadores de
              eventos.
            </p>
          </div>
        </header>

        <div className="border-y border-white/12 py-8 md:py-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="font-mono text-[9px] tracking-[0.2em] text-ash">
                BIOGRAFÍA
              </p>
              <p className="display mt-4 text-[clamp(2rem,3.4vw,3rem)] leading-[0.92] text-bone">
                ROCK DE ACÁ.
                <br />
                HECHO PARA <span className="text-fire">ARDER.</span>
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-5 gap-y-4">
                {epk.facts.slice(0, 4).map((fact) => (
                  <div key={fact.label}>
                    <dt className="font-mono text-[8px] tracking-[0.16em] text-white/50">
                      {fact.label.toUpperCase()}
                    </dt>
                    <dd className="mt-1 text-[0.78rem] leading-snug text-steel/85">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-[1.05rem] leading-[1.75] text-bone/90 sm:text-[1.12rem]">
                {epk.bio[0]}
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {epk.bio.slice(1).map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="text-[0.86rem] leading-[1.75] text-ash"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <article className="flex flex-col border border-white/12 bg-ink/55 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h3 className="display text-[2rem] leading-none text-bone">
                  RIDER TÉCNICO
                </h3>
                <p className="mt-2 font-mono text-[8px] tracking-[0.16em] text-ash">
                  REQUERIMIENTOS MÍNIMOS DE ESCENARIO
                </p>
              </div>
              <FileText
                size={26}
                strokeWidth={1.2}
                className="shrink-0 text-fire"
                aria-hidden="true"
              />
            </div>

            <ol className="mt-2 flex-1">
              {epk.rider.map((item, index) => (
                <li
                  key={item.item}
                  className="group grid grid-cols-[26px_1fr] gap-4 border-b border-white/[0.07] py-3.5 last:border-b-0"
                >
                  <span className="pt-0.5 font-mono text-[9px] tracking-[0.08em] text-fire">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.1em] text-bone/90">
                      {item.item.toUpperCase()}
                    </p>
                    <p className="mt-1 text-[0.78rem] leading-relaxed text-ash">
                      {item.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <a
              href={riderDownload?.url ?? "/press/el-clasico-rider.pdf"}
              download
              className="mt-5 inline-flex items-center justify-between gap-3 border-t border-white/10 pt-4 font-mono text-[9px] tracking-[0.14em] text-ash transition-colors hover:text-fire"
            >
              DESCARGAR RIDER COMPLETO
              <Download size={14} aria-hidden="true" />
            </a>
          </article>

          <article className="flex flex-col border border-white/12 bg-ink/55 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h3 className="display text-[2rem] leading-none text-bone">
                  STAGE PLOT
                </h3>
                <p className="mt-2 font-mono text-[8px] tracking-[0.16em] text-ash">
                  PLANTA ESCÉNICA / 5 MÚSICOS
                </p>
              </div>
              <Map
                size={26}
                strokeWidth={1.2}
                className="shrink-0 text-amber"
                aria-hidden="true"
              />
            </div>

            <div className="relative mt-5 flex-1 border border-white/10">
              <CropMarks className="-inset-2" />
              <StagePlot className="h-full w-full" />
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
              <p className="font-mono text-[8px] tracking-[0.14em] text-ash">
                PDF / PLANTA + RIDER
              </p>
              <a
                href={epk.stagePlotUrl}
                download
                className="group inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-bone transition-colors hover:text-amber"
              >
                DESCARGAR PLANO
                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </article>
        </div>

        <div className="mt-14 md:mt-16">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h3 className="display text-[1.7rem] leading-none text-bone">
              DESCARGAS
            </h3>
            <p className="font-mono text-[8px] tracking-[0.18em] text-ash">
              MATERIAL DE PRENSA / LIBRE DE USO CON CRÉDITO
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
            {epk.downloads.map((file) => (
              <a
                key={file.id}
                href={file.url}
                download
                {...externalLinkProps(file.url)}
                className="group relative flex min-h-[190px] flex-col justify-between bg-ink p-5 transition-colors duration-300 hover:bg-fire sm:min-h-[210px]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="border border-white/20 px-2 py-1 font-mono text-[8px] tracking-[0.12em] text-ash transition-colors group-hover:border-ink/40 group-hover:text-ink">
                    {file.format}
                  </span>
                  <Download
                    size={16}
                    strokeWidth={1.5}
                    className="text-ash transition-all duration-300 group-hover:translate-y-0.5 group-hover:text-ink"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h4 className="display text-[1.65rem] leading-none text-bone transition-colors group-hover:text-ink">
                    {file.title}
                  </h4>
                  <p className="mt-2 text-[0.76rem] leading-relaxed text-ash transition-colors group-hover:text-ink/85">
                    {file.description}
                  </p>
                  <p className="mt-4 font-mono text-[8px] tracking-[0.14em] text-white/50 transition-colors group-hover:text-ink/80">
                    DESCARGA DIRECTA / {file.format}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="relative mt-6 overflow-hidden bg-fire text-ink sm:mt-8">
          <div className="pointer-events-none absolute inset-0 scene-grain opacity-20" />
          <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-end md:justify-between md:p-10">
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] text-ink">
                CONTRATACIONES Y PRENSA
              </p>
              <h3 className="display mt-3 max-w-2xl text-[clamp(2rem,4.5vw,3.7rem)] leading-[0.9]">
                ¿QUERÉS QUE EL CLÁSICO TOQUE EN TU CIUDAD?
              </h3>
              <p className="mt-3 max-w-xl text-[0.86rem] leading-relaxed text-ink">
                Para contrataciones y consultas de prensa escribinos a
                contacto@elclasico.com. Respondemos en 48 horas.
              </p>
            </div>
            <a
              href="mailto:contacto@elclasico.com?subject=Contrataciones%20El%20Cl%C3%A1sico"
              className="group inline-flex shrink-0 items-center gap-3 border border-ink/30 px-4 py-3 font-mono text-[10px] tracking-[0.12em] text-ink transition-colors hover:bg-ink hover:text-bone"
            >
              CONTACTO@ELCLASICO.COM
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
