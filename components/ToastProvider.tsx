"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type ToastKind = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  kind: ToastKind;
  message: string;
  title?: string;
  durationMs?: number;
};

type ToastContextValue = {
  show: (toast: Omit<ToastItem, "id">) => void;
  success: (message: string, opts?: Omit<ToastItem, "id" | "kind" | "message">) => void;
  error: (message: string, opts?: Omit<ToastItem, "id" | "kind" | "message">) => void;
  info: (message: string, opts?: Omit<ToastItem, "id" | "kind" | "message">) => void;
  remove: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = cryptoRandomId();
    const duration = toast.durationMs ?? 3200;
    const item: ToastItem = { ...toast, id };
    setToasts((list) => [...list, item]);
    if (duration > 0) {
      window.setTimeout(() => remove(id), duration);
    }
  }, [remove]);

  const value = useMemo<ToastContextValue>(() => ({
    show,
    success: (message, opts) => show({ kind: "success", message, ...opts }),
    error: (message, opts) => show({ kind: "error", message, ...opts }),
    info: (message, opts) => show({ kind: "info", message, ...opts }),
    remove,
  }), [remove, show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onClose }: { toasts: ToastItem[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={toastClass(t.kind)}>
          <div className="flex-1">
            {t.title && <div className="font-medium mb-0.5">{t.title}</div>}
            <div>{t.message}</div>
          </div>
          <button className="ml-3 text-sm opacity-80 hover:opacity-100" onClick={() => onClose(t.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

function toastClass(kind: ToastKind): string {
  const base = "pointer-events-auto rounded border px-3 py-2 shadow bg-white/95 dark:bg-black/80 backdrop-blur text-sm flex items-start max-w-sm";
  if (kind === "success") return `${base} border-green-500/40 text-green-800 dark:text-green-300`;
  if (kind === "error") return `${base} border-red-500/40 text-red-800 dark:text-red-300`;
  return `${base} border-blue-500/40 text-blue-800 dark:text-blue-300`;
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}


