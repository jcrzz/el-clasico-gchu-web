"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  ArrowUpRight,
  ImagePlus,
  Plus,
  QrCode,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createSupportQrUploadUrlAction,
  finalizeSupportQrUploadAction,
  removeSupportQrAction,
  saveSupportAction,
} from "@/lib/admin/actions/content";
import type { Support } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAdmin } from "./admin-provider";
import {
  AdminNotice,
  AdminPageHeader,
  AdminSwitch,
  Spinner,
} from "./ui";

const acceptedTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSize = 4 * 1024 * 1024;
const amountFormat = new Intl.NumberFormat("es-AR");

interface TierDraft {
  id: string;
  title: string;
  description: string;
  amount: string;
  paymentLink: string;
  featured: boolean;
}

interface SupportDraft {
  alias: string;
  cvu: string;
  accountHolder: string;
  freeAmountLink: string;
  tiers: TierDraft[];
}

function toDraft(support: Support): SupportDraft {
  return {
    alias: support.alias,
    cvu: support.cvu,
    accountHolder: support.accountHolder,
    freeAmountLink: support.freeAmountLink,
    tiers: support.tiers.map((tier) => ({
      id: tier.id,
      title: tier.title,
      description: tier.description,
      amount: String(tier.amount),
      paymentLink: tier.paymentLink,
      featured: tier.featured,
    })),
  };
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function formatAmountInput(value: string) {
  const clean = digitsOnly(value).slice(0, 8);
  return clean ? amountFormat.format(Number(clean)) : "";
}

const labelClass = "font-mono text-[9px] tracking-[0.16em] text-ash";

export function SupportManager() {
  const { data, isDemo, session, setData, updateData } = useAdmin();
  const [draft, setDraft] = useState<SupportDraft>(() =>
    toDraft(data.support),
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removingQr, setRemovingQr] = useState(false);
  const [notice, setNotice] = useState<{
    tone: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({});
  const fileRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  const qrImageUrl = data.support.qrImageUrl;
  const busy = saving || uploading || removingQr;

  useEffect(() => {
    if (!notice || notice.tone === "error") return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    return () => {
      if (previewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  const updateField = <K extends keyof SupportDraft>(
    field: K,
    value: SupportDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const updateTier = (index: number, patch: Partial<TierDraft>) => {
    setDraft((current) => ({
      ...current,
      tiers: current.tiers.map((tier, position) =>
        position === index ? { ...tier, ...patch } : tier,
      ),
    }));
  };

  const addTier = () => {
    setDraft((current) => {
      if (current.tiers.length >= 6) return current;
      return {
        ...current,
        tiers: [
          ...current.tiers,
          {
            id: crypto.randomUUID(),
            title: "",
            description: "",
            amount: "",
            paymentLink: "",
            featured: false,
          },
        ],
      };
    });
  };

  const removeTier = (index: number) => {
    setDraft((current) => {
      if (current.tiers.length <= 1) return current;
      return {
        ...current,
        tiers: current.tiers.filter((_, position) => position !== index),
      };
    });
  };

  const setFeatured = (index: number, checked: boolean) => {
    setDraft((current) => ({
      ...current,
      tiers: current.tiers.map((tier, position) => ({
        ...tier,
        featured: checked ? position === index : false,
      })),
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const payload = {
      alias: draft.alias.trim(),
      cvu: digitsOnly(draft.cvu),
      accountHolder: draft.accountHolder.trim(),
      freeAmountLink: draft.freeAmountLink.trim(),
      tiers: draft.tiers.map((tier) => ({
        id: tier.id,
        title: tier.title.trim(),
        description: tier.description.trim(),
        amount: Number(digitsOnly(tier.amount) || 0),
        paymentLink: tier.paymentLink.trim(),
        featured: tier.featured,
      })),
    };

    setSaving(true);
    setFieldErrors({});
    setNotice(null);

    if (isDemo) {
      const next: Support = {
        ...data.support,
        alias: payload.alias,
        cvu: payload.cvu,
        accountHolder: payload.accountHolder,
        freeAmountLink: payload.freeAmountLink,
        tiers: payload.tiers,
      };
      updateData((current) => ({ ...current, support: next }));
      setDraft(toDraft(next));
      setSaving(false);
      setNotice({
        tone: "success",
        message:
          "Aportes guardados. En modo demo viven en este navegador hasta que resetees.",
      });
      return;
    }

    const result = await saveSupportAction(payload);
    setSaving(false);

    if (!result.ok) {
      setNotice({
        tone: "error",
        message: result.error ?? "No pudimos guardar la recaudación.",
      });
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    if (result.data) {
      setData(result.data);
      setDraft(toDraft(result.data.support));
    }
    setNotice({ tone: "success", message: "Aportes actualizados." });
  };

  const onQrFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      setNotice({ tone: "error", message: "Usá PNG, JPG o WebP." });
      return;
    }
    if (file.size > maxSize) {
      setNotice({ tone: "error", message: "La imagen supera los 4 MB." });
      return;
    }

    setUploading(true);
    setNotice(null);

    if (isDemo) {
      if (previewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
      }
      const preview = URL.createObjectURL(file);
      previewRef.current = preview;
      updateData((current) => ({
        ...current,
        support: { ...current.support, qrImageUrl: preview },
      }));
      setUploading(false);
      setNotice({
        tone: "success",
        message:
          "QR actualizado. En modo demo la vista previa vive sólo en esta sesión.",
      });
      return;
    }

    const signed = await createSupportQrUploadUrlAction({
      filename: file.name,
      contentType: file.type,
      size: file.size,
    });

    if (!("path" in signed)) {
      setUploading(false);
      setNotice({
        tone: "error",
        message:
          "error" in signed && signed.error
            ? signed.error
            : "No pudimos preparar la subida.",
      });
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setUploading(false);
      setNotice({
        tone: "error",
        message: "Supabase no está configurado en el cliente.",
      });
      return;
    }

    const { error } = await supabase.storage
      .from(signed.bucket)
      .uploadToSignedUrl(signed.path, signed.token, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      setUploading(false);
      setNotice({
        tone: "error",
        message: `La subida falló: ${error.message}`,
      });
      return;
    }

    const finalized = await finalizeSupportQrUploadAction({
      path: signed.path,
    });

    setUploading(false);

    if (!finalized.ok) {
      setNotice({
        tone: "error",
        message: finalized.error ?? "No pudimos guardar el QR.",
      });
      return;
    }

    if (finalized.data) setData(finalized.data);
    setNotice({ tone: "success", message: "QR actualizado." });
  };

  const onRemoveQr = async () => {
    if (removingQr) return;
    setRemovingQr(true);
    setNotice(null);

    if (isDemo) {
      if (previewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
      updateData((current) => ({
        ...current,
        support: { ...current.support, qrImageUrl: null },
      }));
      setRemovingQr(false);
      setNotice({ tone: "success", message: "QR quitado." });
      return;
    }

    const result = await removeSupportQrAction();
    setRemovingQr(false);

    if (!result.ok) {
      setNotice({
        tone: "error",
        message: result.error ?? "No pudimos quitar el QR.",
      });
      return;
    }

    if (result.data) setData(result.data);
    setNotice({ tone: "success", message: "QR quitado." });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        index="05"
        title="Aportes"
        description="Alias, CVU y formas de aporte que se publican en la sección «Bancá el proyecto». Los links vacíos caen a WhatsApp en el sitio público."
        actions={
          <a
            href="/#apoyar"
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-ghost"
          >
            VER SECCIÓN
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        }
      />

      {notice ? <AdminNotice tone={notice.tone}>{notice.message}</AdminNotice> : null}

      {!session.writeEnabled ? (
        <AdminNotice tone="info">
          Estás en modo lectura: falta SUPABASE_SERVICE_ROLE_KEY para guardar
          cambios y subir el QR.
        </AdminNotice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.55fr_0.45fr] xl:items-start">
        <form onSubmit={onSubmit} className="space-y-6">
          <section className="border border-white/12 bg-carbon">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-6">
              <p className="font-mono text-[9px] tracking-[0.18em] text-fire">
                DATOS DE TRANSFERENCIA
              </p>
              <p className="font-mono text-[8px] tracking-[0.14em] text-white/35">
                PASE DE BACKSTAGE
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label htmlFor="support-alias" className={labelClass}>
                  ALIAS
                </label>
                <input
                  id="support-alias"
                  type="text"
                  value={draft.alias}
                  onChange={(event) =>
                    updateField("alias", event.target.value.toUpperCase())
                  }
                  aria-invalid={Boolean(fieldErrors.alias)}
                  placeholder="ELCLASICO.ROCK.MP"
                  className="field mt-1 font-mono"
                />
                {fieldErrors.alias ? (
                  <p className="mt-1.5 font-mono text-[8px] text-amber">
                    {fieldErrors.alias[0]}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="support-cvu" className={labelClass}>
                  CVU / CBU
                </label>
                <input
                  id="support-cvu"
                  type="text"
                  inputMode="numeric"
                  value={draft.cvu}
                  onChange={(event) =>
                    updateField("cvu", digitsOnly(event.target.value).slice(0, 22))
                  }
                  aria-invalid={Boolean(fieldErrors.cvu)}
                  placeholder="0000003100012345678901"
                  className="field mt-1 font-mono"
                />
                {fieldErrors.cvu ? (
                  <p className="mt-1.5 font-mono text-[8px] text-amber">
                    {fieldErrors.cvu[0]}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="support-holder" className={labelClass}>
                  TITULAR
                </label>
                <input
                  id="support-holder"
                  type="text"
                  value={draft.accountHolder}
                  onChange={(event) =>
                    updateField("accountHolder", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.accountHolder)}
                  placeholder="El Clásico"
                  className="field mt-1"
                />
                {fieldErrors.accountHolder ? (
                  <p className="mt-1.5 font-mono text-[8px] text-amber">
                    {fieldErrors.accountHolder[0]}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="support-free-link" className={labelClass}>
                  LINK DE MONTO LIBRE
                </label>
                <input
                  id="support-free-link"
                  type="url"
                  value={draft.freeAmountLink}
                  onChange={(event) =>
                    updateField("freeAmountLink", event.target.value)
                  }
                  aria-invalid={Boolean(fieldErrors.freeAmountLink)}
                  placeholder="https://mpago.la/..."
                  className="field mt-1 font-mono text-[0.85rem]"
                />
                {fieldErrors.freeAmountLink ? (
                  <p className="mt-1.5 font-mono text-[8px] text-amber">
                    {fieldErrors.freeAmountLink[0]}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="border border-white/12 bg-carbon">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5 sm:px-6">
              <p className="font-mono text-[9px] tracking-[0.18em] text-fire">
                FORMAS DE APORTE
              </p>
              <button
                type="button"
                onClick={addTier}
                disabled={draft.tiers.length >= 6}
                className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[0.12em] text-amber transition-colors hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={11} aria-hidden="true" />
                AGREGAR
              </button>
            </div>

            <div className="divide-y divide-white/10">
              {draft.tiers.map((tier, index) => (
                <div key={tier.id} className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-mono text-[9px] tracking-[0.16em] text-white/35">
                      {String(index + 1).padStart(2, "0")} / FORMA
                    </p>
                    <button
                      type="button"
                      onClick={() => removeTier(index)}
                      disabled={draft.tiers.length <= 1}
                      aria-label={`Quitar la forma ${index + 1}`}
                      className="flex h-7 w-7 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire/50 hover:text-fire disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_150px]">
                    <div>
                      <label
                        htmlFor={`tier-title-${tier.id}`}
                        className={labelClass}
                      >
                        NOMBRE
                      </label>
                      <input
                        id={`tier-title-${tier.id}`}
                        type="text"
                        value={tier.title}
                        onChange={(event) =>
                          updateTier(index, {
                            title: event.target.value.toUpperCase(),
                          })
                        }
                        placeholder="NAFTA PARA LA GIRA"
                        className="field mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`tier-amount-${tier.id}`}
                        className={labelClass}
                      >
                        MONTO (ARS)
                      </label>
                      <input
                        id={`tier-amount-${tier.id}`}
                        type="text"
                        inputMode="numeric"
                        value={formatAmountInput(tier.amount)}
                        onChange={(event) =>
                          updateTier(index, {
                            amount: digitsOnly(event.target.value),
                          })
                        }
                        placeholder="5.000"
                        className="field mt-1 text-right font-mono"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor={`tier-description-${tier.id}`}
                      className={labelClass}
                    >
                      DESCRIPCIÓN CORTA
                    </label>
                    <input
                      id={`tier-description-${tier.id}`}
                      type="text"
                      value={tier.description}
                      onChange={(event) =>
                        updateTier(index, { description: event.target.value })
                      }
                      placeholder="Empujón directo para llevar el show a nuevas ciudades."
                      className="field mt-1"
                    />
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor={`tier-link-${tier.id}`}
                      className={labelClass}
                    >
                      LINK DE PAGO
                    </label>
                    <input
                      id={`tier-link-${tier.id}`}
                      type="url"
                      value={tier.paymentLink}
                      onChange={(event) =>
                        updateTier(index, { paymentLink: event.target.value })
                      }
                      placeholder="https://mpago.la/..."
                      className="field mt-1 font-mono text-[0.85rem]"
                    />
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <AdminSwitch
                      checked={tier.featured}
                      onChange={(checked) => setFeatured(index, checked)}
                      label="DESTACADO"
                      description="El sitio lo marca como recomendado y lo deja elegido por defecto."
                    />
                  </div>
                </div>
              ))}
            </div>

            {fieldErrors.tiers ? (
              <p className="border-t border-white/10 px-5 py-3 font-mono text-[8px] text-amber sm:px-6">
                {fieldErrors.tiers[0]}
              </p>
            ) : null}
          </section>

          <div className="flex flex-col gap-4 border border-white/12 bg-carbon p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md font-mono text-[8px] leading-relaxed tracking-[0.06em] text-white/35">
              AL GUARDAR SE INVALIDA EL CACHE PÚBLICO. LOS CAMBIOS SE VEN EN LA
              SECCIÓN «BANCÁ EL PROYECTO».
            </p>
            <button
              type="submit"
              disabled={busy || !session.writeEnabled}
              className="btn btn-solid disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? <Spinner /> : null}
              GUARDAR CAMBIOS
            </button>
          </div>
        </form>

        <aside className="border border-white/12 bg-carbon xl:sticky xl:top-6">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
            <p className="font-mono text-[9px] tracking-[0.18em] text-fire">
              QR DE PAGO
            </p>
            <QrCode size={13} className="text-white/30" aria-hidden="true" />
          </div>

          <div className="p-5">
            <div className="relative mx-auto aspect-square w-full max-w-[220px] border border-white/12 bg-white p-2">
              {qrImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImageUrl}
                  alt="QR de pago de El Clásico"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-ink/25 px-3 text-center">
                  <ImagePlus
                    size={18}
                    className="text-ink/30"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[8px] leading-relaxed tracking-[0.12em] text-ink/45">
                    SIN QR
                    <br />
                    EL SITIO MUESTRA EL ALIAS
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept={acceptedTypes.join(",")}
              onChange={onQrFile}
              className="sr-only"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy || !session.writeEnabled}
                className={cn("btn btn-ghost flex-1", busy && "opacity-60")}
              >
                {uploading ? <Spinner /> : <Upload size={13} aria-hidden="true" />}
                {qrImageUrl ? "REEMPLAZAR" : "SUBIR QR"}
              </button>
              {qrImageUrl ? (
                <button
                  type="button"
                  onClick={onRemoveQr}
                  disabled={busy || !session.writeEnabled}
                  className="btn btn-ghost text-fire disabled:opacity-40"
                >
                  {removingQr ? <Spinner /> : null}
                  QUITAR
                </button>
              ) : null}
            </div>

            <p className="mt-3 font-mono text-[8px] leading-relaxed tracking-[0.06em] text-white/35">
              PNG, JPG o WebP. Máximo 4 MB. Subilo desde la app de tu banco o
              billetera.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
