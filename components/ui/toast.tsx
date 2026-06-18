"use client";

import { addToast } from "@heroui/toast";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Loader2,
} from "lucide-react";
import type { ReactNode } from "react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

export interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
  /** Override the auto-derived color */
  color?: "success" | "danger" | "warning" | "primary" | "default";
}

/* ══════════════════════════════════════════
   ICON MAP
══════════════════════════════════════════ */
const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 size={16} className="text-success" />,
  error: <XCircle size={16} className="text-danger" />,
  warning: <AlertTriangle size={16} className="text-warning" />,
  info: <Info size={16} className="text-primary" />,
  loading: <Loader2 size={16} className="text-default-500 animate-spin" />,
};

const COLOR_MAP: Record<ToastVariant, ToastOptions["color"]> = {
  success: "success",
  error: "danger",
  warning: "warning",
  info: "primary",
  loading: "default",
};

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function show(variant: ToastVariant, opts: ToastOptions) {
  addToast({
    title: opts.title,
    description: opts.description,
    color: opts.color ?? COLOR_MAP[variant],
    timeout: opts.duration ?? (variant === "loading" ? 0 : 4000),
    // HeroUI toast endContent slot for the icon
    // endContent:  ICONS[variant],
    classNames: {
      base: "shadow-toast border border-default-100",
      title: "text-sm font-semibold text-default-900",
      description:
        "text-xs text-default-500 leading-relaxed whitespace-pre-line",
    },
  });
}

/* ══════════════════════════════════════════
   PUBLIC API
   tree-shakeable — import only what you need
══════════════════════════════════════════ */

/**
 * toast — namespaced helper for all variants.
 *
 * @example
 * toast.success({ title: "Produit ajouté", description: "Œufs Fermiers Beldi" });
 * toast.error({ title: "Erreur", description: "Connexion échouée" });
 * toast.warning({ title: "Stock faible", description: "Moins de 10 unités" });
 * toast.info({ title: "Mise à jour disponible" });
 */
export const toast = {
  success: (opts: ToastOptions) => show("success", opts),
  error: (opts: ToastOptions) => show("error", opts),
  warning: (opts: ToastOptions) => show("warning", opts),
  info: (opts: ToastOptions) => show("info", opts),
  loading: (opts: ToastOptions) => show("loading", { duration: 0, ...opts }),

  /** Shorthand for a common "saved" confirmation */
  saved: (entity = "Modifications") =>
    show("success", { title: `${entity} enregistrées` }),

  /** Shorthand for a generic API error */
  apiError: (msg?: string) =>
    show("error", {
      title: "Une erreur est survenue",
      description: msg ?? "Veuillez réessayer ou contacter le support.",
    }),
};
