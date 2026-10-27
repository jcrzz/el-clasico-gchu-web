"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  FlaskConical,
  KeyRound,
  Loader2,
  LogIn,
  ShieldAlert,
} from "lucide-react";
import {
  demoLoginAction,
  loginAction,
  type LoginState,
} from "@/lib/admin/actions/auth";

const initialLoginState: LoginState = { error: "" };

function LoginSubmit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="btn btn-solid group w-full disabled:cursor-not-allowed disabled:opacity-40"
    >
      {pending ? (
        <>
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          Verificando
        </>
      ) : (
        <>
          Entrar a la cabina
          <LogIn
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}

function DemoSubmit() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-ghost w-full border-amber/40 text-amber hover:border-amber hover:text-amber disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" aria-hidden="true" />
      ) : (
        <FlaskConical size={14} aria-hidden="true" />
      )}
      Entrar en modo demo
    </button>
  );
}

export function LoginForm({
  configured,
  demoAvailable,
  adminsConfigured,
}: {
  configured: boolean;
  demoAvailable: boolean;
  adminsConfigured: boolean;
}) {
  const [loginState, loginFormAction] = useActionState(
    loginAction,
    initialLoginState,
  );
  const [demoState, demoFormAction] = useActionState(
    demoLoginAction,
    initialLoginState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/12 pb-4">
        <p className="font-mono text-[9px] tracking-[0.18em] text-fire">
          ACCESO RESTRINGIDO
        </p>
        <span className="flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-white/40">
          <span className="h-1 w-1 bg-amber" />
          PERSONAL DE GIRA
        </span>
      </div>

      <h1 className="display text-[clamp(2.8rem,6vw,4.6rem)] leading-[0.82] text-bone">
        ENTRAR A<br />
        <span className="text-fire">LA CABINA</span>
      </h1>
      <p className="mt-4 max-w-sm text-[0.86rem] leading-relaxed text-ash">
        Shows, fotos y press kit. El backstage digital de El Clásico.
      </p>

      {configured ? (
        <form action={loginFormAction} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="font-mono text-[9px] tracking-[0.16em] text-ash"
            >
              EMAIL
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="nombre@elclasico.com"
              className="field mt-1"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="font-mono text-[9px] tracking-[0.16em] text-ash"
            >
              CONTRASEÑA
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="field mt-1 pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute right-0 bottom-0 flex h-11 w-10 items-center justify-center text-ash transition-colors hover:text-amber"
              >
                {showPassword ? (
                  <EyeOff size={15} aria-hidden="true" />
                ) : (
                  <Eye size={15} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {loginState.error ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 border border-fire/35 bg-fire/[0.06] p-3"
            >
              <ShieldAlert
                size={14}
                className="mt-0.5 shrink-0 text-fire"
                aria-hidden="true"
              />
              <p className="font-mono text-[9px] leading-relaxed tracking-[0.04em] text-bone/80">
                {loginState.error}
              </p>
            </div>
          ) : null}

          <LoginSubmit disabled={false} />

          {!adminsConfigured ? (
            <p className="font-mono text-[8px] leading-relaxed tracking-[0.08em] text-amber/80">
              ADMIN_EMAILS está vacío. En producción nadie podrá entrar hasta
              configurarlo.
            </p>
          ) : null}
        </form>
      ) : (
        <div className="mt-8 border border-white/12 bg-white/[0.02] p-5">
          <div className="flex items-start gap-3">
            <KeyRound
              size={16}
              className="mt-0.5 shrink-0 text-amber"
              aria-hidden="true"
            />
            <div>
              <p className="font-mono text-[9px] tracking-[0.12em] text-bone">
                SUPABASE SIN CONFIGURAR
              </p>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-ash">
                Completá{" "}
                <code className="font-mono text-amber">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                y las claves en{" "}
                <code className="font-mono text-amber">.env.local</code> para
                habilitar el login real.
              </p>
            </div>
          </div>
        </div>
      )}

      {demoAvailable ? (
        <form action={demoFormAction} className="mt-5">
          {demoState.error ? (
            <p
              role="alert"
              className="mb-3 font-mono text-[9px] leading-relaxed text-fire"
            >
              {demoState.error}
            </p>
          ) : null}
          <DemoSubmit />
          <p className="mt-3 text-center font-mono text-[8px] leading-relaxed tracking-[0.08em] text-white/40">
            Sólo desarrollo. Los cambios quedan en este navegador.
          </p>
        </form>
      ) : null}

      {!configured && !demoAvailable ? (
        <div className="mt-5 flex items-start gap-2.5 border border-fire/25 bg-fire/[0.05] p-3">
          <ShieldAlert
            size={14}
            className="mt-0.5 shrink-0 text-fire"
            aria-hidden="true"
          />
          <p className="font-mono text-[9px] leading-relaxed tracking-[0.04em] text-bone/75">
            El modo demo no está disponible en producción. Configurá Supabase
            para acceder al panel.
          </p>
        </div>
      ) : null}

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-ash transition-colors hover:text-amber"
      >
        <ArrowLeft size={13} aria-hidden="true" />
        VOLVER AL SITIO
      </Link>
    </div>
  );
}
