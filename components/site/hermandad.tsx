import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  {
    title: "PASIÓN",
    text: "La música que nos une va más allá del escenario.",
  },
  {
    title: "COMUNIDAD",
    text: "Somos una familia que crece con cada show.",
  },
  {
    title: "FUEGO",
    text: "La energía que nos mueve no se apaga nunca.",
  },
];

const quotes = [
  {
    quote: "La primera vez que los escuché, supe que esto era diferente.",
    author: "Martín",
    detail: "Fan desde 2019",
  },
  {
    quote: "El Clásico no es solo una banda, es un sentimiento.",
    author: "Lucía",
    detail: "La Hermandad",
  },
];

export function Hermandad() {
  return (
    <section
      id="la-hermandad"
      className="section relative overflow-hidden border-t border-white/10 bg-carbon"
      aria-labelledby="hermandad-title"
    >
      <div className="pointer-events-none absolute -right-32 top-0 h-[520px] w-[520px] ambient-fire opacity-50" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 ambient-amber opacity-30" />

      <div className="shell relative">
        <SectionHeading
          id="hermandad-title"
          title="LA HERMANDAD"
          subtitle="Más que fans, somos familia. La Hermandad es el movimiento que nos conecta a través de la música, los shows y la energía que compartimos."
        />

        <div className="grid border-y border-white/12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative flex flex-col justify-between border-b border-white/10 p-7 sm:p-9 lg:border-b-0 lg:border-r lg:p-10">
            <div>
              <div className="flex items-center justify-between gap-4 font-mono text-[9px] tracking-[0.18em] text-ash">
                <span>MANIFIESTO / LA HERMANDAD</span>
                <span className="text-fire">01—03</span>
              </div>

              <p className="display mt-10 text-[clamp(2.7rem,4.9vw,4.75rem)] leading-[0.82] text-bone">
                LA HERMANDAD
                <br />
                NO SE EXPLICA.
                <br />
                <span className="text-fire">SE CANTA.</span>
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-16 lg:grid-cols-1">
              {quotes.map((item, index) => (
                <blockquote
                  key={item.author}
                  className={
                    index === 0
                      ? "relative"
                      : "relative border-t border-white/10 pt-8"
                  }
                >
                  <span
                    aria-hidden="true"
                    className="display block h-7 text-[3.6rem] leading-[0.7] text-fire"
                  >
                    “
                  </span>
                  <p className="display mt-1 max-w-md text-[clamp(1.35rem,1.8vw,1.7rem)] normal-case leading-[1.06] tracking-[-0.01em] text-bone">
                    {item.quote}
                  </p>
                  <footer className="mt-4 flex items-center gap-3">
                    <span aria-hidden="true" className="h-px w-6 bg-fire" />
                    <span className="font-mono text-[8px] tracking-[0.15em] text-ash">
                      <span className="text-bone/85">
                        {item.author.toUpperCase()}
                      </span>{" "}
                      — {item.detail.toUpperCase()}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            {pillars.map((pillar, index) => (
              <article
                key={pillar.title}
                className="group relative flex flex-1 flex-col justify-between border-b border-white/10 p-7 transition-colors duration-500 last:border-b-0 hover:bg-white/[0.025] sm:p-9 lg:p-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-fire transition-transform duration-500 group-hover:scale-y-100"
                />
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-fire">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.16em] text-white/50">
                    PILAR
                  </span>
                </div>

                <h3 className="display mt-10 text-[clamp(2.6rem,4.6vw,4.4rem)] leading-[0.8] text-bone transition-colors duration-500 group-hover:text-fire">
                  {pillar.title}
                </h3>
                <p className="mt-4 max-w-[22rem] text-[0.9rem] leading-relaxed text-ash">
                  {pillar.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
