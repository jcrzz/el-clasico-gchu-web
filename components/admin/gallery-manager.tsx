"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  Images,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import { LiveScene } from "@/components/art/live-scene";
import {
  createGalleryUploadUrlAction,
  deleteGalleryAction,
  finalizeGalleryUploadAction,
  reorderGalleryAction,
  updateGalleryAction,
} from "@/lib/admin/actions/content";
import { formatBytes } from "@/lib/admin/format";
import type { GalleryImage, GallerySpan, SceneVariant } from "@/lib/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAdmin } from "./admin-provider";
import {
  AdminDialog,
  AdminEmpty,
  AdminNotice,
  AdminPageHeader,
  AdminSwitch,
  ConfirmDialog,
  Spinner,
} from "./ui";

const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const maxSize = 12 * 1024 * 1024;

interface UploadDraft {
  file: File;
  preview: string;
  alt: string;
  caption: string;
  span: GallerySpan;
  scene: SceneVariant;
  mono: boolean;
}

interface EditDraft {
  alt: string;
  caption: string;
  span: GallerySpan;
  scene: SceneVariant;
  mono: boolean;
}

const spanLabels: Record<GallerySpan, string> = {
  tall: "VERTICAL",
  wide: "PANORÁMICA",
  small: "CUADRADA",
};

const sceneLabels: Record<SceneVariant, string> = {
  guitar: "Guitarra",
  band: "Banda",
  drummer: "Batería",
  vocalist: "Voz",
};

function fileStem(filename: string) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export function GalleryManager() {
  const { data, isDemo, session, setData, updateData } = useAdmin();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [draft, setDraft] = useState<UploadDraft | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editTarget, setEditTarget] = useState<GalleryImage | null>(null);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [editError, setEditError] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [notice, setNotice] = useState<{
    tone: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const draftPreviewRef = useRef<string | null>(null);

  const images = useMemo(
    () => [...data.gallery].sort((a, b) => a.position - b.position),
    [data.gallery],
  );

  useEffect(() => {
    if (!notice || notice.tone === "error") return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    draftPreviewRef.current = draft?.preview ?? null;
  }, [draft?.preview]);

  useEffect(() => {
    return () => {
      if (draftPreviewRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(draftPreviewRef.current);
      }
    };
  }, []);

  const resetUpload = (revokePreview = true) => {
    if (revokePreview && draft?.preview.startsWith("blob:")) {
      URL.revokeObjectURL(draft.preview);
    }
    draftPreviewRef.current = null;
    setDraft(null);
    setUploadError("");
    setUploadOpen(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const loadFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!acceptedTypes.includes(file.type)) {
      setUploadError("Usá JPG, PNG, WebP o AVIF.");
      return;
    }
    if (file.size > maxSize) {
      setUploadError("La imagen supera los 12 MB.");
      return;
    }

    if (draft?.preview.startsWith("blob:")) {
      URL.revokeObjectURL(draft.preview);
    }

    const preview = URL.createObjectURL(file);
    draftPreviewRef.current = preview;
    setDraft({
      file,
      preview,
      alt: fileStem(file.name) || "El Clásico en vivo",
      caption: "",
      span: "small",
      scene: "band",
      mono: false,
    });
    setUploadError("");
    setUploadOpen(true);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    loadFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    loadFile(event.dataTransfer.files?.[0]);
  };

  const updateDraft = <K extends keyof UploadDraft>(
    field: K,
    value: UploadDraft[K],
  ) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  };

  const submitUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;

    if (draft.alt.trim().length < 3 || draft.caption.trim().length < 3) {
      setUploadError("Completá la descripción y el epígrafe.");
      return;
    }

    setUploading(true);
    setUploadError("");

    if (isDemo) {
      const image: GalleryImage = {
        id: crypto.randomUUID(),
        src: draft.preview,
        alt: draft.alt.trim(),
        caption: draft.caption.trim(),
        scene: draft.scene,
        span: draft.span,
        position: images.length,
        mono: draft.mono,
      };
      updateData((current) => ({
        ...current,
        gallery: [
          ...current.gallery,
          { ...image, position: current.gallery.length },
        ],
      }));
      setUploading(false);
      resetUpload(false);
      setNotice({
        tone: "success",
        message:
          "Imagen agregada. En modo demo la vista previa vive en esta sesión.",
      });
      return;
    }

    const signed = await createGalleryUploadUrlAction({
      filename: draft.file.name,
      contentType: draft.file.type,
      size: draft.file.size,
    });

    if (!("path" in signed)) {
      setUploading(false);
      setUploadError(
        "error" in signed && signed.error
          ? signed.error
          : "No pudimos preparar la subida.",
      );
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setUploading(false);
      setUploadError("Supabase no está configurado en el cliente.");
      return;
    }

    const { error } = await supabase.storage
      .from(signed.bucket)
      .uploadToSignedUrl(signed.path, signed.token, draft.file, {
        contentType: draft.file.type,
        upsert: false,
      });

    if (error) {
      setUploading(false);
      setUploadError(`La subida falló: ${error.message}`);
      return;
    }

    const finalized = await finalizeGalleryUploadAction({
      path: signed.path,
      alt: draft.alt.trim(),
      caption: draft.caption.trim(),
      scene: draft.scene,
      span: draft.span,
      mono: draft.mono,
    });

    setUploading(false);

    if (!finalized.ok) {
      setUploadError(finalized.error ?? "No pudimos guardar la imagen.");
      return;
    }

    if (finalized.data) setData(finalized.data);
    resetUpload();
    setNotice({ tone: "success", message: "Imagen publicada en la galería." });
  };

  const openEdit = (image: GalleryImage) => {
    setEditTarget(image);
    setEditDraft({
      alt: image.alt,
      caption: image.caption,
      span: image.span,
      scene: image.scene,
      mono: Boolean(image.mono),
    });
    setEditError("");
  };

  const submitEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editTarget || !editDraft) return;

    setSavingEdit(true);
    setEditError("");

    if (isDemo) {
      updateData((current) => ({
        ...current,
        gallery: current.gallery.map((image) =>
          image.id === editTarget.id ? { ...image, ...editDraft } : image,
        ),
      }));
      setSavingEdit(false);
      setEditTarget(null);
      setNotice({ tone: "success", message: "Imagen actualizada." });
      return;
    }

    const result = await updateGalleryAction({
      id: editTarget.id,
      ...editDraft,
    });

    setSavingEdit(false);

    if (!result.ok) {
      setEditError(result.error ?? "No pudimos actualizar la imagen.");
      return;
    }

    if (result.data) setData(result.data);
    setEditTarget(null);
    setNotice({ tone: "success", message: "Imagen actualizada." });
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length || reordering) return;

    const reordered = [...images];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const withPositions = reordered.map((image, position) => ({
      ...image,
      position,
    }));

    if (isDemo) {
      updateData((current) => ({
        ...current,
        gallery: current.gallery
          .map((image) => {
            const updated = withPositions.find((item) => item.id === image.id);
            return updated ?? image;
          })
          .sort((a, b) => a.position - b.position),
      }));
      return;
    }

    setReordering(true);
    const result = await reorderGalleryAction(withPositions.map((image) => image.id));
    setReordering(false);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error ?? "Error al reordenar." });
      return;
    }

    if (result.data) setData(result.data);
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setNotice(null);

    if (isDemo) {
      updateData((current) => ({
        ...current,
        gallery: current.gallery
          .filter((image) => image.id !== deleteTarget.id)
          .map((image, position) => ({ ...image, position })),
      }));
      if (deleteTarget.src?.startsWith("blob:")) {
        URL.revokeObjectURL(deleteTarget.src);
      }
      setDeleting(false);
      setDeleteTarget(null);
      setNotice({ tone: "success", message: "Imagen eliminada." });
      return;
    }

    const result = await deleteGalleryAction(deleteTarget.id);
    setDeleting(false);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error ?? "Error al eliminar." });
      return;
    }

    if (result.data) setData(result.data);
    setDeleteTarget(null);
    setNotice({
      tone: "success",
      message: "Imagen y archivo eliminados del almacenamiento.",
    });
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        index="03"
        title="Galería"
        description="El archivo visual del sitio. Las imágenes se suben directo a Supabase Storage; acá se ordenan, recortan y describen."
        actions={
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!session.writeEnabled}
            className="btn btn-solid disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ImagePlus size={14} aria-hidden="true" />
            SUBIR IMAGEN
          </button>
        }
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={onFileChange}
        className="sr-only"
        aria-label="Seleccionar imagen para subir"
      />

      {notice ? <AdminNotice tone={notice.tone}>{notice.message}</AdminNotice> : null}

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className="flex flex-col items-center justify-center border border-dashed border-white/15 bg-white/[0.015] px-6 py-7 text-center transition-colors hover:border-white/30"
      >
        <Upload size={18} className="text-fire" aria-hidden="true" />
        <p className="mt-3 font-mono text-[9px] tracking-[0.12em] text-bone">
          ARRASTRÁ UNA FOTO ACÁ O ELEGILA DESDE EL DISCO
        </p>
        <p className="mt-1.5 font-mono text-[8px] tracking-[0.08em] text-white/35">
          JPG / PNG / WEBP / AVIF · HASTA 12 MB
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={!session.writeEnabled}
          className="mt-3 font-mono text-[8px] tracking-[0.12em] text-amber transition-colors hover:text-bone disabled:opacity-40"
        >
          ELEGIR ARCHIVO
        </button>
      </div>

      {images.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="group flex flex-col border border-white/12 bg-carbon"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                {image.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.src}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <LiveScene
                    variant={image.scene}
                    mono={image.mono}
                    className="h-full w-full"
                  />
                )}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-2.5">
                  <span className="border border-black/40 bg-ink/75 px-1.5 py-1 font-mono text-[7px] tracking-[0.12em] text-bone backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex gap-1">
                    <span className="border border-black/40 bg-ink/75 px-1.5 py-1 font-mono text-[7px] tracking-[0.1em] text-bone/80 backdrop-blur-sm">
                      {spanLabels[image.span]}
                    </span>
                    {image.mono ? (
                      <span className="border border-black/40 bg-ink/75 px-1.5 py-1 font-mono text-[7px] tracking-[0.1em] text-amber backdrop-blur-sm">
                        B/N
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-[0.84rem] leading-snug text-bone">
                  {image.caption}
                </p>
                <p className="mt-1 line-clamp-2 font-mono text-[8px] leading-relaxed tracking-[0.04em] text-white/35">
                  {image.alt}
                </p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={
                        index === 0 || reordering || !session.writeEnabled
                      }
                      aria-label="Mover imagen a la izquierda"
                      className="flex h-8 w-8 items-center justify-center border border-white/12 text-ash transition-colors hover:border-amber/60 hover:text-amber disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowLeft size={12} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={
                        index === images.length - 1 ||
                        reordering ||
                        !session.writeEnabled
                      }
                      aria-label="Mover imagen a la derecha"
                      className="flex h-8 w-8 items-center justify-center border border-white/12 text-ash transition-colors hover:border-amber/60 hover:text-amber disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ArrowRight size={12} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(image)}
                      disabled={!session.writeEnabled}
                      aria-label={`Editar ${image.caption}`}
                      className="flex h-8 w-8 items-center justify-center border border-white/12 text-ash transition-colors hover:border-amber/60 hover:text-amber disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Pencil size={12} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(image)}
                      disabled={!session.writeEnabled}
                      aria-label={`Eliminar ${image.caption}`}
                      className="flex h-8 w-8 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire/60 hover:text-fire disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <AdminEmpty
          title="La galería está vacía"
          description="Subí la primera foto o dejá que el sitio use las escenas ilustradas por defecto."
          action={
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={!session.writeEnabled}
              className="btn btn-fire disabled:opacity-40"
            >
              <Images size={14} aria-hidden="true" />
              SUBIR PRIMERA IMAGEN
            </button>
          }
        />
      )}

      <AdminDialog
        open={uploadOpen}
        onClose={resetUpload}
        title="Subir imagen"
        eyebrow="NUEVO ARCHIVO"
        description="La vista previa es local. Al guardar, el archivo se sube directo a Supabase Storage."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => resetUpload()}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="gallery-upload-form"
              disabled={uploading}
              className="btn btn-solid disabled:cursor-wait disabled:opacity-60"
            >
              {uploading ? <Spinner /> : <Upload size={13} />}
              {uploading ? "SUBIENDO" : "PUBLICAR IMAGEN"}
            </button>
          </div>
        }
      >
        {draft ? (
          <form
            id="gallery-upload-form"
            onSubmit={submitUpload}
            className="space-y-5"
          >
            <div className="relative aspect-[4/3] overflow-hidden border border-white/12 bg-ink">
              {/* Local object URL preview. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={draft.preview}
                alt="Vista previa de la imagen"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <p className="truncate font-mono text-[8px] tracking-[0.08em] text-ash">
                {draft.file.name}
              </p>
              <span className="shrink-0 font-mono text-[8px] text-white/35">
                {formatBytes(draft.file.size)}
              </span>
            </div>

            <div>
              <label
                htmlFor="gallery-caption"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                EPÍGRAFE
              </label>
              <input
                id="gallery-caption"
                type="text"
                value={draft.caption}
                onChange={(event) => updateDraft("caption", event.target.value)}
                placeholder="Ej: La banda en el escenario del Ópera"
                className="field mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="gallery-alt"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                DESCRIPCIÓN PARA ACCESIBILIDAD
              </label>
              <input
                id="gallery-alt"
                type="text"
                value={draft.alt}
                onChange={(event) => updateDraft("alt", event.target.value)}
                placeholder="Qué se ve en la foto"
                className="field mt-1"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="gallery-span"
                  className="font-mono text-[9px] tracking-[0.16em] text-ash"
                >
                  FORMATO EN EL BENTO
                </label>
                <select
                  id="gallery-span"
                  value={draft.span}
                  onChange={(event) =>
                    updateDraft("span", event.target.value as GallerySpan)
                  }
                  className="field mt-1"
                >
                  <option value="small">Cuadrada</option>
                  <option value="tall">Vertical</option>
                  <option value="wide">Panorámica</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="gallery-scene"
                  className="font-mono text-[9px] tracking-[0.16em] text-ash"
                >
                  ESCENA DE RESPALDO
                </label>
                <select
                  id="gallery-scene"
                  value={draft.scene}
                  onChange={(event) =>
                    updateDraft("scene", event.target.value as SceneVariant)
                  }
                  className="field mt-1"
                >
                  {Object.entries(sceneLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border border-white/12 bg-white/[0.02] p-4">
              <AdminSwitch
                checked={draft.mono}
                onChange={(value) => updateDraft("mono", value)}
                label="BLANCO Y NEGRO"
                description="Aplica un tratamiento monocromo a la escena de respaldo."
              />
            </div>

            {uploadError ? (
              <AdminNotice tone="error">{uploadError}</AdminNotice>
            ) : null}
          </form>
        ) : null}
      </AdminDialog>

      <AdminDialog
        open={Boolean(editTarget && editDraft)}
        onClose={() => setEditTarget(null)}
        title="Editar imagen"
        eyebrow="METADATOS DEL ARCHIVO"
        description="No reemplaza el archivo; corrige cómo se describe y ocupa lugar en la grilla."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditTarget(null)}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="gallery-edit-form"
              disabled={savingEdit}
              className="btn btn-solid disabled:cursor-wait disabled:opacity-60"
            >
              {savingEdit ? <Spinner /> : null}
              GUARDAR CAMBIOS
            </button>
          </div>
        }
      >
        {editDraft ? (
          <form id="gallery-edit-form" onSubmit={submitEdit} className="space-y-5">
            {editTarget?.src ? (
              <div className="relative aspect-[4/3] overflow-hidden border border-white/12 bg-ink">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editTarget.src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            <div>
              <label
                htmlFor="gallery-edit-caption"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                EPÍGRAFE
              </label>
              <input
                id="gallery-edit-caption"
                type="text"
                value={editDraft.caption}
                onChange={(event) =>
                  setEditDraft({ ...editDraft, caption: event.target.value })
                }
                className="field mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="gallery-edit-alt"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                DESCRIPCIÓN
              </label>
              <input
                id="gallery-edit-alt"
                type="text"
                value={editDraft.alt}
                onChange={(event) =>
                  setEditDraft({ ...editDraft, alt: event.target.value })
                }
                className="field mt-1"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="gallery-edit-span"
                  className="font-mono text-[9px] tracking-[0.16em] text-ash"
                >
                  FORMATO
                </label>
                <select
                  id="gallery-edit-span"
                  value={editDraft.span}
                  onChange={(event) =>
                    setEditDraft({
                      ...editDraft,
                      span: event.target.value as GallerySpan,
                    })
                  }
                  className="field mt-1"
                >
                  <option value="small">Cuadrada</option>
                  <option value="tall">Vertical</option>
                  <option value="wide">Panorámica</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="gallery-edit-scene"
                  className="font-mono text-[9px] tracking-[0.16em] text-ash"
                >
                  ESCENA DE RESPALDO
                </label>
                <select
                  id="gallery-edit-scene"
                  value={editDraft.scene}
                  onChange={(event) =>
                    setEditDraft({
                      ...editDraft,
                      scene: event.target.value as SceneVariant,
                    })
                  }
                  className="field mt-1"
                >
                  {Object.entries(sceneLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border border-white/12 bg-white/[0.02] p-4">
              <AdminSwitch
                checked={editDraft.mono}
                onChange={(value) =>
                  setEditDraft({ ...editDraft, mono: value })
                }
                label="BLANCO Y NEGRO"
                description="Sólo afecta la escena ilustrada de respaldo."
              />
            </div>

            {editError ? <AdminNotice tone="error">{editError}</AdminNotice> : null}
          </form>
        ) : null}
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        pending={deleting}
        title="Eliminar imagen"
        description={
          deleteTarget
            ? `Vas a eliminar “${deleteTarget.caption}” de la galería y del almacenamiento.`
            : ""
        }
      />
    </div>
  );
}
