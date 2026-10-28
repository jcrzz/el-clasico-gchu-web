"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  CalendarPlus,
  Link2,
  MapPin,
  Pencil,
  Plus,
  Ticket,
  Trash2,
} from "lucide-react";
import { deleteShowAction, saveShowAction } from "@/lib/admin/actions/content";
import { sortShows } from "@/lib/admin/format";
import type { Show } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAdmin } from "./admin-provider";
import {
  AdminDialog,
  AdminEmpty,
  AdminNotice,
  AdminPageHeader,
  AdminSwitch,
  ConfirmDialog,
  Spinner,
  StatusBadge,
} from "./ui";

type Filter = "all" | "AR" | "UY" | "soldout";

const filterLabels: { key: Filter; label: string }[] = [
  { key: "all", label: "TODAS" },
  { key: "AR", label: "ARGENTINA" },
  { key: "UY", label: "URUGUAY" },
  { key: "soldout", label: "SOLD OUT" },
];

interface FormValues {
  date: string;
  time: string;
  city: string;
  country: "AR" | "UY";
  venue: string;
  ticketUrl: string;
  soldOut: boolean;
  freeEntry: boolean;
}

const emptyForm: FormValues = {
  date: "",
  time: "21:00",
  city: "",
  country: "AR",
  venue: "",
  ticketUrl: "",
  soldOut: false,
  freeEntry: false,
};

function parseDate(date: string) {
  const parsed = new Date(`${date}T12:00:00-03:00`);
  return {
    day: new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(parsed),
    month: new Intl.DateTimeFormat("es-AR", {
      month: "short",
      timeZone: "America/Argentina/Buenos_Aires",
    })
      .format(parsed)
      .replace(".", "")
      .toUpperCase(),
    year: new Intl.DateTimeFormat("es-AR", {
      year: "numeric",
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(parsed),
  };
}

function formFromShow(show: Show): FormValues {
  return {
    date: show.date.slice(0, 10),
    time: show.time ?? "21:00",
    city: show.city,
    country: show.country,
    venue: show.venue,
    ticketUrl: show.ticketUrl ?? "",
    soldOut: show.status === "sold-out",
    freeEntry: show.freeEntry ?? false,
  };
}

export function ShowsManager() {
  const { data, isDemo, session, setData, updateData } = useAdmin();
  const [filter, setFilter] = useState<Filter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Show | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{
    tone: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Show | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!notice || notice.tone === "error") return;
    const timer = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const shows = useMemo(() => {
    const sorted = sortShows(data.shows).filter(
      (show) => show.status !== "paused",
    );
    if (filter === "AR" || filter === "UY") {
      return sorted.filter((show) => show.country === filter);
    }
    if (filter === "soldout") {
      return sorted.filter((show) => show.status === "sold-out");
    }
    return sorted;
  }, [data.shows, filter]);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setFieldErrors({});
    setNotice(null);
    setDialogOpen(true);
  };

  const openEdit = (show: Show) => {
    setEditing(show);
    setForm(formFromShow(show));
    setFieldErrors({});
    setNotice(null);
    setDialogOpen(true);
  };

  const updateField = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K],
  ) => {
    setForm((current) => {
      let next = { ...current, [field]: value };

      if (field === "freeEntry" && value === true) {
        next = { ...next, freeEntry: true, soldOut: false, ticketUrl: "" };
      } else if (field === "soldOut" && value === true) {
        next = { ...next, soldOut: true, freeEntry: false };
      }

      return next;
    });
    setFieldErrors((current) => {
      const nextErrors = { ...current, [field]: "" };
      if (field === "freeEntry" || field === "soldOut") {
        delete nextErrors.freeEntry;
        delete nextErrors.soldOut;
      }
      return nextErrors;
    });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.date) errors.date = "Elegí una fecha.";
    if (form.city.trim().length < 2) errors.city = "Indicá la ciudad.";
    if (form.venue.trim().length < 2) errors.venue = "Indicá el venue.";
    if (form.freeEntry && form.soldOut) {
      errors.freeEntry = "Entrada libre y sold out son excluyentes.";
    }
    if (!form.soldOut && !form.freeEntry && !form.ticketUrl.trim()) {
      errors.ticketUrl = "Agregá el link de venta, marcá sold out o marcá entrada libre.";
    }
    if (
      !form.freeEntry &&
      form.ticketUrl.trim() &&
      !/^https?:\/\//i.test(form.ticketUrl.trim())
    ) {
      errors.ticketUrl = "El link tiene que empezar con http:// o https://.";
    }
    return errors;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      const first = document.getElementById(`show-${Object.keys(errors)[0]}`);
      first?.focus();
      return;
    }

    setSaving(true);
    setNotice(null);

    if (isDemo) {
      const nextShow: Show = {
        id: editing?.id ?? crypto.randomUUID(),
        date: form.date,
        time: form.time || null,
        city: form.city.trim(),
        country: form.country,
        venue: form.venue.trim(),
        ticketUrl: form.freeEntry ? "" : form.ticketUrl.trim(),
        status: form.soldOut ? "sold-out" : "available",
        notes: editing?.notes ?? null,
        freeEntry: form.freeEntry,
      };

      updateData((current) => ({
        ...current,
        shows: sortShows(
          editing
            ? current.shows.map((show) =>
                show.id === editing.id ? nextShow : show,
              )
            : [...current.shows, nextShow],
        ),
      }));
      setSaving(false);
      setDialogOpen(false);
      setNotice({
        tone: "success",
        message: editing ? "Fecha actualizada." : "Fecha agregada al sitio.",
      });
      return;
    }

    const result = await saveShowAction({
      id: editing?.id,
      date: form.date,
      time: form.time,
      city: form.city,
      country: form.country,
      venue: form.venue,
      ticketUrl: form.freeEntry ? "" : form.ticketUrl,
      soldOut: form.soldOut,
      freeEntry: form.freeEntry,
    } as any);

    setSaving(false);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error ?? "Error al guardar." });
      if (result.fieldErrors) {
        setFieldErrors(
          Object.fromEntries(
            Object.entries(result.fieldErrors).map(([key, messages]) => [
              key,
              messages?.[0] ?? "",
            ]),
          ),
        );
      }
      return;
    }

    if (result.data) setData(result.data);
    setDialogOpen(false);
    setNotice({
      tone: "success",
      message: editing ? "Fecha actualizada." : "Fecha agregada al sitio.",
    });
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setNotice(null);

    if (isDemo) {
      updateData((current) => ({
        ...current,
        shows: current.shows.filter((show) => show.id !== deleteTarget.id),
      }));
      setDeleting(false);
      setDeleteTarget(null);
      setNotice({ tone: "success", message: "Fecha eliminada." });
      return;
    }

    const result = await deleteShowAction(deleteTarget.id);
    setDeleting(false);

    if (!result.ok) {
      setNotice({ tone: "error", message: result.error ?? "Error al eliminar." });
      return;
    }

    if (result.data) setData(result.data);
    setDeleteTarget(null);
    setNotice({ tone: "success", message: "Fecha eliminada." });
  };

  return (
    <div className="space-y-7">
      <AdminPageHeader
        index="02"
        title="Fechas"
        description="La gira se publica desde acá. Las fechas pausadas no aparecen en el sitio; las sold out quedan visibles sin link de venta."
        actions={
          <button
            type="button"
            onClick={openNew}
            disabled={!session.writeEnabled}
            className="btn btn-solid disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={14} aria-hidden="true" />
            NUEVA FECHA
          </button>
        }
      />

      {notice ? <AdminNotice tone={notice.tone}>{notice.message}</AdminNotice> : null}

      <div className="flex flex-col gap-4 border-b border-white/12 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar fechas">
          {filterLabels.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              aria-pressed={filter === item.key}
              className={cn(
                "border px-3 py-2 font-mono text-[8px] tracking-[0.14em] transition-colors",
                filter === item.key
                  ? "border-fire/60 bg-fire/[0.08] text-bone"
                  : "border-white/12 text-ash hover:border-white/30 hover:text-bone",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[8px] tracking-[0.12em] text-white/35">
          {shows.length} {shows.length === 1 ? "FECHA" : "FECHAS"} EN PANTALLA
        </p>
      </div>

      {shows.length ? (
        <ul className="border-t border-white/12">
          {shows.map((show) => {
            const parts = parseDate(show.date);
            return (
              <li
                key={show.id}
                className="show-row grid gap-4 border-b border-white/10 px-3 py-4 sm:grid-cols-[100px_1fr_auto] sm:items-center sm:px-4"
              >
                <div className="flex items-end gap-2 sm:block">
                  <p className="display text-[2.4rem] leading-[0.8] text-bone">
                    {parts.day}
                  </p>
                  <div className="pb-0.5 sm:mt-1 sm:pb-0">
                    <p className="font-mono text-[8px] tracking-[0.16em] text-fire">
                      {parts.month}
                    </p>
                    <p className="font-mono text-[8px] tracking-[0.1em] text-white/35">
                      {parts.year}
                      {show.time ? ` / ${show.time}` : ""}
                    </p>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="display text-[1.65rem] leading-none text-bone">
                      {show.city}
                    </p>
                    <span className="font-mono text-[8px] tracking-[0.12em] text-white/35">
                      {show.country === "AR" ? "AR" : "UY"}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-[0.8rem] text-ash">
                    <MapPin size={12} className="text-white/35" aria-hidden="true" />
                    {show.venue}
                  </p>
                  {show.ticketUrl ? (
                    <a
                      href={show.ticketUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[8px] tracking-[0.08em] text-amber/85 transition-colors hover:text-amber"
                    >
                      <Link2 size={11} aria-hidden="true" />
                      LINK DE VENTA
                    </a>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <StatusBadge status={show.status} />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(show)}
                      disabled={!session.writeEnabled}
                      aria-label={`Editar fecha en ${show.city}`}
                      className="flex h-9 w-9 items-center justify-center border border-white/12 text-ash transition-colors hover:border-amber/60 hover:text-amber disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(show)}
                      disabled={!session.writeEnabled}
                      aria-label={`Eliminar fecha en ${show.city}`}
                      className="flex h-9 w-9 items-center justify-center border border-white/12 text-ash transition-colors hover:border-fire/60 hover:text-fire disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <AdminEmpty
          title="No hay fechas con ese filtro"
          description="Probá con otro filtro o sumá la próxima fecha de la gira."
          action={
            <button
              type="button"
              onClick={openNew}
              disabled={!session.writeEnabled}
              className="btn btn-fire disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CalendarPlus size={14} aria-hidden="true" />
              AGREGAR FECHA
            </button>
          }
        />
      )}

      <AdminDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editing ? "Editar fecha" : "Nueva fecha"}
        eyebrow={editing ? "MODIFICAR FUNCIÓN" : "AGREGAR A LA GIRA"}
        description="La fecha se publica en el sitio apenas guardás. El cache público se invalida automáticamente."
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="btn btn-ghost"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="show-form"
              disabled={saving}
              className="btn btn-solid disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? <Spinner /> : null}
              {editing ? "GUARDAR CAMBIOS" : "PUBLICAR FECHA"}
            </button>
          </div>
        }
      >
        <form id="show-form" onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="show-date"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                FECHA
              </label>
              <input
                id="show-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                aria-invalid={Boolean(fieldErrors.date)}
                className="field mt-1"
              />
              {fieldErrors.date ? (
                <p className="mt-1.5 font-mono text-[8px] text-amber">
                  {fieldErrors.date}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="show-time"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                HORARIO
              </label>
              <input
                id="show-time"
                type="time"
                value={form.time}
                onChange={(event) => updateField("time", event.target.value)}
                className="field mt-1"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
            <div>
              <label
                htmlFor="show-city"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                CIUDAD
              </label>
              <input
                id="show-city"
                type="text"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                aria-invalid={Boolean(fieldErrors.city)}
                placeholder="Gualeguaychú"
                className="field mt-1"
              />
              {fieldErrors.city ? (
                <p className="mt-1.5 font-mono text-[8px] text-amber">
                  {fieldErrors.city}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="show-country"
                className="font-mono text-[9px] tracking-[0.16em] text-ash"
              >
                PAÍS
              </label>
              <select
                id="show-country"
                value={form.country}
                onChange={(event) =>
                  updateField("country", event.target.value as "AR" | "UY")
                }
                className="field mt-1"
              >
                <option value="AR">Argentina</option>
                <option value="UY">Uruguay</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="show-venue"
              className="font-mono text-[9px] tracking-[0.16em] text-ash"
            >
              VENUE
            </label>
            <input
              id="show-venue"
              type="text"
              value={form.venue}
              onChange={(event) => updateField("venue", event.target.value)}
              aria-invalid={Boolean(fieldErrors.venue)}
              placeholder="Nombre del lugar"
              className="field mt-1"
            />
            {fieldErrors.venue ? (
              <p className="mt-1.5 font-mono text-[8px] text-amber">
                {fieldErrors.venue}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="show-ticket"
              className="font-mono text-[9px] tracking-[0.16em] text-ash"
            >
              LINK DE VENTA
            </label>
            <input
              id="show-ticket"
              type="url"
              value={form.ticketUrl}
              onChange={(event) => updateField("ticketUrl", event.target.value)}
              aria-invalid={Boolean(fieldErrors.ticketUrl)}
              placeholder="https://..."
              disabled={form.soldOut || form.freeEntry}
              className="field mt-1 disabled:opacity-40"
            />
            {fieldErrors.ticketUrl ? (
              <p className="mt-1.5 font-mono text-[8px] text-amber">
                {fieldErrors.ticketUrl}
              </p>
            ) : (
              <p className="mt-1.5 font-mono text-[8px] text-white/35">
                PARA SOLD OUT O ENTRADA LIBRE PODÉS DEJARLO VACÍO.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div className="border border-white/12 bg-white/[0.02] p-4">
              <AdminSwitch
                checked={form.freeEntry}
                onChange={(value) => updateField("freeEntry", value)}
                label="ENTRADA LIBRE Y GRATUITA"
                description="Sin venta online. Se ingresa libremente."
              />
              {fieldErrors.freeEntry ? (
                <p className="mt-2 font-mono text-[8px] text-amber">
                  {fieldErrors.freeEntry}
                </p>
              ) : null}
            </div>
            <div className="border border-white/12 bg-white/[0.02] p-4">
              <AdminSwitch
                checked={form.soldOut}
                onChange={(value) => updateField("soldOut", value)}
                label="SOLD OUT"
                description="La fecha sigue visible, pero sin botón de compra."
              />
            </div>
          </div>

          <div className="flex items-start gap-2.5 border border-white/10 bg-white/[0.015] p-3">
            <Ticket
              size={14}
              className="mt-0.5 shrink-0 text-fire"
              aria-hidden="true"
            />
            <p className="font-mono text-[8px] leading-relaxed tracking-[0.06em] text-white/45">
              LA FECHA APARECE EN EL SITIO PÚBLICO Y EN EL JSON-LD DE EVENTOS.
              REVISÁ CIUDAD, VENUE Y HORARIO ANTES DE PUBLICAR.
            </p>
          </div>
        </form>
      </AdminDialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={onDelete}
        pending={deleting}
        title="Eliminar fecha"
        description={
          deleteTarget
            ? `Vas a eliminar ${deleteTarget.city} / ${deleteTarget.venue}. Esta acción no se puede deshacer.`
            : ""
        }
      />
    </div>
  );
}
