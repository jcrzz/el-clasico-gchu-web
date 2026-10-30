"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AdminData, AdminSession } from "@/lib/admin/types";

const STORAGE_KEY = "elc-admin-demo-v1";

interface AdminContextValue {
  data: AdminData;
  session: AdminSession;
  initialData: AdminData;
  isDemo: boolean;
  hydrated: boolean;
  setData: (next: AdminData) => void;
  updateData: (updater: (current: AdminData) => AdminData) => void;
  resetDemo: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function sanitizeForDemoStorage(data: AdminData, initialData: AdminData): AdminData {
  return {
    ...data,
    gallery: data.gallery.map((image) =>
      image.src?.startsWith("blob:") ? { ...image, src: null } : image,
    ),
    epk: {
      ...data.epk,
      stagePlotUrl: data.epk.stagePlotUrl.startsWith("blob:")
        ? initialData.epk.stagePlotUrl
        : data.epk.stagePlotUrl,
      downloads: data.epk.downloads.map((download) => {
        if (!download.url.startsWith("blob:")) return download;
        const original = initialData.epk.downloads.find(
          (item) => item.id === download.id,
        );
        return original ? { ...download, url: original.url } : download;
      }),
    },
    support: {
      ...data.support,
      qrImageUrl: data.support.qrImageUrl?.startsWith("blob:")
        ? initialData.support.qrImageUrl
        : data.support.qrImageUrl,
    },
  };
}

function isValidDemoData(value: unknown): value is AdminData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<AdminData>;
  return (
    Array.isArray(candidate.shows) &&
    Array.isArray(candidate.gallery) &&
    Boolean(candidate.epk) &&
    Boolean(candidate.settings) &&
    Boolean(candidate.support) &&
    Array.isArray(candidate.support?.tiers) &&
    Array.isArray(candidate.albums)
  );
}

export function AdminProvider({
  session,
  initialData,
  children,
}: {
  session: AdminSession;
  initialData: AdminData;
  children: ReactNode;
}) {
  const [data, setDataState] = useState(initialData);
  const [hydrated, setHydrated] = useState(session.mode !== "demo");
  const isDemo = session.mode === "demo";

  useEffect(() => {
    if (!isDemo) return;

    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (isValidDemoData(parsed)) setDataState(parsed);
      } catch {
        // A corrupt demo snapshot should never block the panel.
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [isDemo]);

  const persist = useCallback(
    (next: AdminData) => {
      if (!isDemo) return;
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(sanitizeForDemoStorage(next, initialData)),
        );
      } catch {
        // Storage quotas are common with demo image previews. The in-memory
        // state remains the source of truth for the current session.
      }
    },
    [initialData, isDemo],
  );

  const setData = useCallback(
    (next: AdminData) => {
      setDataState(next);
      persist(next);
    },
    [persist],
  );

  const updateData = useCallback(
    (updater: (current: AdminData) => AdminData) => {
      setDataState((current) => {
        const next = updater(current);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
    setDataState(structuredClone(initialData));
  }, [initialData]);

  const value = useMemo<AdminContextValue>(
    () => ({
      data,
      session,
      initialData,
      isDemo,
      hydrated,
      setData,
      updateData,
      resetDemo,
    }),
    [data, hydrated, initialData, isDemo, resetDemo, session, setData, updateData],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }
  return context;
}
