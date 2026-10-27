import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LiveScene } from "@/components/art/live-scene";
import { LoginForm } from "@/components/admin/login-form";
import { CropMarks } from "@/components/ui/section-heading";
import { getAdminSession } from "@/lib/admin/auth";
import {
  hasConfiguredAdmins,
  isAdminDemoAvailable,
} from "@/lib/admin/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function LoginFallback() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-ink">
      <div className="text-center">
        <p className="display text-4xl text-bone">EL CLÁSICO</p>
        <p className="mt-3 font-mono text-[9px] tracking-[0.2em] text-ash">
          ABRIENDO LA CABINA
        </p>
      </div>
    </main>
  );
}

async function LoginGate() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink">
      <div className="grid min-h-dvh lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden min-h-dvh overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between">
          <LiveScene
            variant="band"
            className="absolute inset-0 h-full w-full opacity-70"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.55)_0%,rgba(7,7,7,0.18)_38%,rgba(7,7,7,0.92)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,7,0.72)_0%,transparent_55%,rgba(7,7,7,0.35)_100%)]" />
          <CropMarks className="z-10 m-6" />

          <div className="relative z-10 p-8 xl:p-12">
            <Link
              href="/"
              className="display inline-block text-[2.1rem] leading-none text-bone transition-colors hover:text-fire"
            >
              EL CLÁSICO
            </Link>
            <p className="mt-2 font-mono text-[8px] tracking-[0.2em] text-fire">
              BACKSTAGE / 2026
            </p>
          </div>

          <div className="relative z-10 px-8 pb-8 xl:px-12 xl:pb-12">
            <div className="relative">
              <span
                aria-hidden="true"
                className="display absolute -left-1 top-1 text-[clamp(6rem,12vw,11rem)] leading-[0.72] text-fire/70 mix-blend-screen"
              >
                CABINA
              </span>
              <p className="relative display text-[clamp(6rem,12vw,11rem)] leading-[0.72] text-bone">
                CABINA
              </p>
            </div>
            <div className="mt-8 flex items-end justify-between gap-8 border-t border-white/20 pt-5">
              <p className="max-w-sm font-mono text-[9px] leading-relaxed tracking-[0.1em] text-bone/70">
                CONTROL DE FECHAS, ARCHIVO VISUAL Y PRESS KIT.
                <br />
                SÓLO PERSONAL AUTORIZADO.
              </p>
              <span className="shrink-0 font-mono text-[8px] tracking-[0.18em] text-amber">
                34°S / 58°O
              </span>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-dvh flex-col justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="pointer-events-none absolute -right-24 top-0 h-[420px] w-[420px] ambient-fire opacity-25" />
          <div className="relative mx-auto w-full max-w-md">
            <div className="mb-12 flex items-center justify-between lg:hidden">
              <Link
                href="/"
                className="display text-[2rem] leading-none text-bone"
              >
                EL CLÁSICO
              </Link>
              <span className="font-mono text-[8px] tracking-[0.18em] text-fire">
                CABINA
              </span>
            </div>

            <LoginForm
              configured={isSupabaseConfigured()}
              demoAvailable={isAdminDemoAvailable()}
              adminsConfigured={hasConfiguredAdmins()}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginGate />
    </Suspense>
  );
}
