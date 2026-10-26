import { LiveScene } from "@/components/art/live-scene";
import {
  CropMarks,
  SectionHeading,
} from "@/components/ui/section-heading";
import { Timeline } from "@/components/site/timeline";

export function History() {
  return (
    <section
      id="historia"
      className="section relative border-t border-white/10"
      aria-labelledby="historia-title"
    >
      <div className="pointer-events-none absolute left-0 top-1/3 h-[420px] w-[420px] -translate-x-1/2 ambient-fire opacity-40" />
      <div className="shell relative">
        <SectionHeading
          id="historia-title"
          title="NUESTRA HISTORIA"
          subtitle="Desde las calles de Gualeguaychú hasta los escenarios más grandes, este es nuestro camino."
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative">
                <CropMarks className="-inset-3" />
                <figure className="relative overflow-hidden border border-white/12">
                  <div className="relative aspect-[4/5] w-full">
                    <LiveScene variant="history" className="absolute inset-0" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                      <span className="border border-white/20 bg-ink/60 px-2.5 py-1.5 font-mono text-[8px] tracking-[0.2em] text-bone/80 backdrop-blur-sm">
                        ARCHIVO EN VIVO
                      </span>
                      <span className="bg-fire px-2 py-1 font-mono text-[8px] tracking-[0.16em] text-ink">
                        2025
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/40 to-transparent p-4 pt-16 sm:p-5">
                      <figcaption className="font-mono text-[9px] leading-relaxed tracking-[0.14em] text-bone/75">
                        CENTRO CULTURAL
                        <br />
                        GUALEGUAYCHÚ · ENTRE RÍOS
                      </figcaption>
                    </div>
                  </div>
                </figure>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                <p className="font-mono text-[9px] tracking-[0.16em] text-ash">
                  FIG. 01 — EL ESCENARIO ANTES DEL SHOW
                </p>
                <p className="font-mono text-[9px] tracking-[0.16em] text-ash">
                  2018 / 2025
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Timeline />
          </div>
        </div>
      </div>
    </section>
  );
}
