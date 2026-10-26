import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  subtitle,
  className,
  id,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  id?: string;
}) {
  return (
    <header className={cn("mb-12 md:mb-16", className)}>
      <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="mt-2 hidden h-3 w-3 shrink-0 bg-fire md:block"
          />
          <h2
            id={id}
            className="display text-[clamp(2.9rem,7.2vw,6.4rem)] leading-[0.82]"
          >
            {title}
          </h2>
        </div>
        {subtitle ? (
          <p className="max-w-md text-[0.9rem] leading-relaxed text-ash md:pb-1 md:text-right">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}

export function CropMarks({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <span className="crop-mark left-0 top-0" />
      <span className="crop-mark right-0 top-0" />
      <span className="crop-mark bottom-0 left-0" />
      <span className="crop-mark bottom-0 right-0" />
    </span>
  );
}
