import { Suspense, type ReactNode } from "react";
import { AdminProvider } from "@/components/admin/admin-provider";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminData } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/auth";

function AdminBoot() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink">
      <div className="w-full max-w-xs text-center">
        <p className="display text-4xl text-bone">EL CLÁSICO</p>
        <p className="mt-3 font-mono text-[9px] tracking-[0.2em] text-ash">
          ABRIENDO LA CABINA
        </p>
        <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
          <div className="h-full w-1/3 animate-pulse bg-fire" />
        </div>
      </div>
    </div>
  );
}

async function AdminGate({ children }: { children: ReactNode }) {
  const session = await requireAdmin();
  const data = await getAdminData(session);

  return (
    <AdminProvider session={session} initialData={data}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}

export default function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={<AdminBoot />}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
