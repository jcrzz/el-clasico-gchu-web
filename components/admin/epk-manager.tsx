"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Archive,
  Download,
  FileText,
  Map as MapIcon,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import {
  createEpkUploadUrlAction,
  finalizeEpkUploadAction,
  saveEpkAction,
} from "@/lib/admin/actions/content";
import { formatBytes } from "@/lib/admin/format";
import type { EpkDownload } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAdmin } from "./admin-provider";
import {
  AdminNotice,
  AdminPageHeader,
  Spinner,
} from "./ui";

type UploadKind = "bio" | "rider" | "fotos" | "demo" | "stage-plot";

interface RiderRow {
  key: string;
  item: string;
  detail: string;
}

const fileRows: {
  kind: Exclude<UploadKind, "stage-plot">;
  downloadId: string;
  title: string;
  description: string;
  accept: string;
  label: string;
  icon: typeof FileText;
}[] = [
  {
    kind: "bio",
    downloadId: "d-bio",
    title: "Biografía",
    description: "PDF con la historia y los datos de la banda.",
    accept: ".pdf,application/pdf",
    label: "PDF",
    icon: FileText,
  },
  {
    kind: "rider",
    downloadId: "d-rider",
    title: "Rider técnico",
    description: "Necesidades de escenario, backline y sonido.",
    accept: ".pdf,application/pdf",
    label: "PDF",
    icon: FileText,
  },
  {
    kind: "fotos",
    downloadId: "d-fotos",
    title: "Fotos de prensa",
    description: "Paquete ZIP con imágenes en alta resolución.",
    accept: ".zip,application/zip",
    label: "ZIP",
    icon: Archive,
  },
  {
    kind: "demo",
    downloadId: "d-demo",
    title: "Demo / EPK",
    description: "ZIP con audio, textos y material de presentación.",
    accept: ".zip,application/zip",
    label: "ZIP",
    icon: Archive,
  },
];

function riderRowsFromEpk(rider: { item: string; detail: string }[]): RiderRow[] {
  return rider.map((row, index) => ({
    key: `${index}-${row.item}`,
    item: row.item,
    detail: row.detail,
  }));
}

export function EpkManager() {
  const { hydrated } = useAdmin();

  return <EpkManagerContent key={hydrated ? "ready" : "boot"} />;
}

function EpkManagerContent() {
  const { data, isDemo, session, setData, updateData } = useAdmin();
  const [bioShort, setBioShort] = useState(data.epk.bioShort);
  const [bioText, setBioText] = useState(data.epk.bio.join("\n\n"));
  const [rider, setRider] = useState<RiderRow[]>(() =>
    riderRowsFromEpk(data.epk.rider),
  );
  const [saving, setSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<UploadKind | null>(null);
  const [notice, setNotice] = useState<{
    tone: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!notice || notice.tone === "error") return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const savedBioText = data.epk.bio.join("\n\n");
  const cleanRider = rider
    .map(({ item, detail }) => ({ item: item.trim(), detail: detail.trim() }))
    .filter((row) => row.item || row.detail);
  const dirty =
    bioShort !== data.epk.bioShort ||
    bioText !== savedBioText ||
    JSON.stringify(cleanRider) !== JSON.stringify(data.epk.rider);

  const downloadMap = useMemo(() => {
    return new globalThis.Map(
      data.epk.downloads.map((download) => [download.id, download]),
    );
  }, [data.epk.downloads]);

  const updateRider = (
    key: string,
    field: "item" | "detail",
    value: string,
  ) => {
    setRider((current) =>
      current.map((row) => (row.key === key ? { ...row, [field]: value } : row)),
    );
  };

  const addRider = () => {
    setRider((current) => [
      ...current,
      { key: crypto.randomUUID(), item: "", detail: "" },
    ]);
  };

  const removeRider = (key: string) => {
    setRider((current) => current.filter((row) => row.key !== key));
  };

  const submitEpk = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    if (bioShort.trim().length < 10) {
      setNotice({
        tone: "error",
        message: "La biografía corta necesita al menos 10 caracteres.",
      });
      return;
    }
    if (bioText.trim().length < 30) {
      setNotice({
        tone: "error",
        message: "La biografía completa es demasiado corta.",
      });
      return;
    }
    if (
      cleanRider.some(
        (row) =>
          !row.item ||
          !row.detail ||
          row.item.length < 2 ||
          row.detail.length < 2,
      )
    ) {
      setNotice({
        tone: "error",
        message: "Completá o eliminá las filas vacías del rider.",
      });
      return;
    }
    if (cleanRider.length === 0) {
      setNotice({
        tone: "error",
        message: "El rider necesita al menos un ítem.",
      });
      return;
    }

    setSaving(true);

    const bio = bioText
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (isDemo) {
      updateData((current) => ({
        ...current,
        epk: {
          ...current.epk,
          bioShort: bioShort.trim(),
          bio,
          rider: cleanRider,
        },
      }));
      setSaving(false);
      setNotice({
        tone: "success",
        message: "Press kit actualizado en el navegador.",
      });
      return;
    }

    const result = await saveEpkAction({
      bioShort: bioShort.trim(),
      bioText: bioText.trim(),
      rider: cleanRider,
    });

    setSaving(false);

    if (!result.ok) {
      setNotice({
        tone: "error",
        message: result.error ?? "No pudimos guardar el press kit.",
      });
      return;
    }

    if (result.data) setData(result.data);
    setNotice({ tone: "success", message: "Press kit actualizado." });
  };

  const replaceFile = async (
    kind: UploadKind,
    file: File | null | undefined,
  ) => {
    if (!file) return;
    setNotice(null);

    const isPdf = kind === "bio" || kind === "rider" || kind === "stage-plot";
    const validType = isPdf
      ? file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
      : file.type === "application/zip" ||
        file.type === "application/x-zip-compressed" ||
        file.name.toLowerCase().endsWith(".zip");

    if (!validType) {
      setNotice({
        tone: "error",
        message: isPdf ? "Este archivo tiene que ser un PDF." : "Este archivo tiene que ser un ZIP.",
      });
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setNotice({ tone: "error", message: "El archivo supera los 25 MB." });
      return;
    }

    setUploadingKind(kind);

    if (isDemo) {
      const url = URL.createObjectURL(file);
      updateData((current) => {
        if (kind === "stage-plot") {
          return {
            ...current,
            epk: { ...current.epk, stagePlotUrl: url },
          };
        }

        const downloadId = fileRows.find((row) => row.kind === kind)?.downloadId;
        return {
          ...current,
          epk: {
            ...current.epk,
            downloads: current.epk.downloads.map((download) =>
              download.id === downloadId
                ? { ...download, url, size: formatBytes(file.size) }
                : download,
            ),
          },
        };
      });
      setUploadingKind(null);
      setNotice({
        tone: "success",
        message:
          "Archivo reemplazado. En modo demo el archivo vive sólo en esta sesión.",
      });
      return;
    }

    const signed = await createEpkUploadUrlAction({
      kind,
      filename: file.name,
      contentType: file.type || (isPdf ? "application/pdf" : "application/zip"),
      size: file.size,
    });

    if (!("path" in signed)) {
      setUploadingKind(null);
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
      setUploadingKind(null);
      setNotice({
        tone: "error",
        message: "Supabase no está configurado en el cliente.",
      });
      return;
    }

    const { error } = await supabase.storage
      .from(signed.bucket)
      .uploadToSignedUrl(signed.path, signed.token, file, {
        contentType:
          file.type || (isPdf ? "application/pdf" : "application/zip"),
        upsert: false,
      });

    if (error) {
      setUploadingKind(null);
      setNotice({ tone: "error", message: `La subida falló: ${error.message}` });
      return;
    }

    const finalized = await finalizeEpkUploadAction({
      kind,
      path: signed.path,
      size: file.size,
    });

    setUploadingKind(null);

    if (!finalized.ok) {
      setNotice({
        tone: "error",
        message: finalized.error ?? "No pudimos guardar el archivo.",
      });
      return;
    }

    if (finalized.data) setData(finalized.data);
    setNotice({ tone: "success", message: "Archivo actualizado en el press kit." });
  };

  const onFileInput = (
    kind: UploadKind,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    replaceFile(kind, event.target.files?.[0]);
    event.target.value = "";
  };

  const stagePlotDownload: EpkDownload | null = data.epk.stagePlotUrl
    ? {
        id: "d-stage-plot",
        title: "Planta escénica",
        description: "Plano técnico del escenario.",
        format: "PDF",
        size: "PDF",
        url: data.epk.stagePlotUrl,
      }
    : null;

  return (
    <div className="space-y-7">
      <AdminPageHeader
        index="04"
        title="Press kit"
        description="Biografía, rider y los archivos que reciben prensa y productores. La biografía corta también alimenta el resumen del sitio."
        actions={
          <button
            type="submit"
            form="epk-form"
            disabled={saving || !dirty || !session.writeEnabled}
            className="btn btn-solid disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? <Spinner /> : <Save size={14} aria-hidden="true" />}
            GUARDAR CAMBIOS
          </button>
        }
      />

      {notice ? <AdminNotice tone={notice.tone}>{notice.message}</AdminNotice> : null}

      <form id="epk-form" onSubmit={submitEpk} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="border border-white/12 bg-carbon">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                BIOGRAFÍA
              </p>
              <span className="font-mono text-[8px] text-white/30">
                {bioText.length} CARACTERES
              </span>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <label
                  htmlFor="epk-bio-short"
                  className="font-mono text-[9px] tracking-[0.16em] text-ash"
                >
                  BIOGRAFÍA CORTA
                </label>
                <input
                  id="epk-bio-short"
                  type="text"
                  value={bioShort}
                  onChange={(event) => setBioShort(event.target.value)}
                  maxLength={500}
                  className="field mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="epk-bio"
                  className="font-mono text-[9px] tracking-[0.16em] text-ash"
                >
                  BIOGRAFÍA COMPLETA
                </label>
                <textarea
                  id="epk-bio"
                  value={bioText}
                  onChange={(event) => setBioText(event.target.value)}
                  rows={13}
                  className="field mt-1 resize-y leading-relaxed"
                />
                <p className="mt-2 font-mono text-[8px] leading-relaxed tracking-[0.06em] text-white/35">
                  SEPARÁ LOS PÁRRAFOS CON UNA LÍNEA EN BLANCO. EL PRIMER PÁRRAFO
                  ABRE LA SECCIÓN DEL SITIO.
                </p>
              </div>
            </div>
          </section>

          <section className="border border-white/12 bg-carbon">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
              <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
                RIDER TÉCNICO
              </p>
              <span className="font-mono text-[8px] text-white/30">
                {rider.length} ÍTEMS
              </span>
            </div>
            <div className="space-y-3 p-5">
              {rider.map((row) => (
                <div
                  key={row.key}
                  className="border border-white/10 bg-white/[0.015] p-3"
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="text"
                      value={row.item}
                      onChange={(event) =>
                        updateRider(row.key, "item", event.target.value)
                      }
                      placeholder="Ítem"
                      aria-label="Nombre del ítem del rider"
                      className="field flex-1 py-1.5 text-[0.82rem]"
                    />
                    <button
                      type="button"
                      onClick={() => removeRider(row.key)}
                      aria-label="Eliminar ítem del rider"
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire/60 hover:text-fire"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </div>
                  <textarea
                    value={row.detail}
                    onChange={(event) =>
                      updateRider(row.key, "detail", event.target.value)
                    }
                    placeholder="Detalle técnico"
                    aria-label="Detalle del ítem del rider"
                    rows={2}
                    className="field mt-1 resize-y py-1.5 text-[0.8rem] leading-relaxed"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addRider}
                className="flex w-full items-center justify-center gap-2 border border-dashed border-white/15 py-3 font-mono text-[8px] tracking-[0.12em] text-ash transition-colors hover:border-amber/50 hover:text-amber"
              >
                <Plus size={12} aria-hidden="true" />
                AGREGAR ÍTEM
              </button>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[8px] tracking-[0.08em] text-white/35">
            {dirty ? (
              <span className="text-amber">CAMBIOS SIN GUARDAR</span>
            ) : (
              "TEXTOS SINCRONIZADOS"
            )}
          </p>
          <button
            type="submit"
            disabled={saving || !dirty || !session.writeEnabled}
            className="btn btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? <Spinner /> : <Save size={13} aria-hidden="true" />}
            GUARDAR TEXTOS
          </button>
        </div>
      </form>

      <section className="border border-white/12 bg-carbon">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
          <p className="font-mono text-[9px] tracking-[0.18em] text-ash">
            DESCARGABLES
          </p>
          <span className="font-mono text-[8px] tracking-[0.1em] text-white/30">
            ARCHIVOS PÚBLICOS
          </span>
        </div>

        <div className="divide-y divide-white/10">
          {fileRows.map((row) => {
            const download = downloadMap.get(row.downloadId);
            const Icon = row.icon;
            const uploading = uploadingKind === row.kind;

            return (
              <div
                key={row.kind}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/12 text-fire">
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[0.86rem] text-bone">{row.title}</p>
                      <span className="border border-white/12 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.1em] text-ash">
                        {row.label}
                      </span>
                      {download ? (
                        <span className="font-mono text-[8px] text-white/30">
                          {download.size}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-[0.75rem] leading-relaxed text-ash">
                      {row.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  {download ? (
                    <a
                      href={download.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 border border-white/12 px-2.5 py-2 font-mono text-[8px] tracking-[0.1em] text-ash transition-colors hover:border-amber/50 hover:text-amber"
                    >
                      <Download size={12} aria-hidden="true" />
                      VER
                    </a>
                  ) : null}
                  <input
                    ref={(node) => {
                      fileInputs.current[row.kind] = node;
                    }}
                    id={`epk-file-${row.kind}`}
                    type="file"
                    accept={row.accept}
                    onChange={(event) => onFileInput(row.kind, event)}
                    className="sr-only"
                    aria-label={`Reemplazar ${row.title}`}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputs.current[row.kind]?.click()}
                    disabled={!session.writeEnabled || uploadingKind !== null}
                    className="inline-flex items-center gap-1.5 border border-white/12 px-2.5 py-2 font-mono text-[8px] tracking-[0.1em] text-bone transition-colors hover:border-fire/50 hover:text-fire disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {uploading ? (
                      <Spinner />
                    ) : (
                      <Upload size={12} aria-hidden="true" />
                    )}
                    {uploading ? "SUBIENDO" : "REEMPLAZAR"}
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/12 text-amber">
                <MapIcon size={15} aria-hidden="true" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.86rem] text-bone">Planta escénica</p>
                  <span className="border border-white/12 px-1.5 py-0.5 font-mono text-[7px] tracking-[0.1em] text-ash">
                    PDF
                  </span>
                </div>
                <p className="mt-0.5 text-[0.75rem] leading-relaxed text-ash">
                  Plano técnico que se muestra en la sección EPK del sitio.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
              {stagePlotDownload ? (
                <a
                  href={stagePlotDownload.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 border border-white/12 px-2.5 py-2 font-mono text-[8px] tracking-[0.1em] text-ash transition-colors hover:border-amber/50 hover:text-amber"
                >
                  <Download size={12} aria-hidden="true" />
                  VER
                </a>
              ) : null}
              <input
                ref={(node) => {
                  fileInputs.current["stage-plot"] = node;
                }}
                id="epk-file-stage-plot"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(event) => onFileInput("stage-plot", event)}
                className="sr-only"
                aria-label="Reemplazar planta escénica"
              />
              <button
                type="button"
                onClick={() => fileInputs.current["stage-plot"]?.click()}
                disabled={!session.writeEnabled || uploadingKind !== null}
                className="inline-flex items-center gap-1.5 border border-white/12 px-2.5 py-2 font-mono text-[8px] tracking-[0.1em] text-bone transition-colors hover:border-fire/50 hover:text-fire disabled:cursor-not-allowed disabled:opacity-40"
              >
                {uploadingKind === "stage-plot" ? (
                  <Spinner />
                ) : (
                  <Upload size={12} aria-hidden="true" />
                )}
                {uploadingKind === "stage-plot" ? "SUBIENDO" : "REEMPLAZAR"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
