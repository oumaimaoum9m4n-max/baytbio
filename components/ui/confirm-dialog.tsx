"use client";

import { Modal, useDisclosure } from "./modal";
import { AlertTriangle, Trash2, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export type ConfirmVariant = "danger" | "warning" | "success" | "info";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when user clicks the confirm button */
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: ReactNode;
  variant?: ConfirmVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

/* ══════════════════════════════════════════
   VARIANT CONFIG
══════════════════════════════════════════ */
const VARIANT_MAP: Record<
  ConfirmVariant,
  {
    icon: ReactNode;
    iconBg: string;
    iconColor: string;
    btnColor: "danger" | "warning" | "success" | "primary";
  }
> = {
  danger: {
    icon: <Trash2 size={22} />,
    iconBg: "bg-danger-50",
    iconColor: "text-danger",
    btnColor: "danger",
  },
  warning: {
    icon: <AlertTriangle size={22} />,
    iconBg: "bg-warning-50",
    iconColor: "text-warning",
    btnColor: "warning",
  },
  success: {
    icon: <CheckCircle2 size={22} />,
    iconBg: "bg-success-50",
    iconColor: "text-success",
    btnColor: "success",
  },
  info: {
    icon: <Info size={22} />,
    iconBg: "bg-primary-50",
    iconColor: "text-primary",
    btnColor: "primary",
  },
};

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
/**
 * ConfirmDialog
 *
 * A focused confirmation modal used for destructive or
 * irreversible actions (delete, cancel order, etc.).
 *
 * @example
 * const { isOpen, onOpen, onClose } = useDisclosure();
 *
 * <Button color="danger" onPress={onOpen}>Supprimer</Button>
 * <ConfirmDialog
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   onConfirm={handleDelete}
 *   variant="danger"
 *   title="Supprimer ce produit ?"
 *   description='Cette action est irréversible et supprimera "Œufs Fermiers Beldi".'
 *   confirmLabel="Supprimer définitivement"
 * />
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer l'action",
  description,
  variant = "danger",
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  isLoading = false,
}: ConfirmDialogProps) {
  const { icon, iconBg, iconColor, btnColor } = VARIANT_MAP[variant];

  async function handleConfirm() {
    await onConfirm();
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      isDismissable={!isLoading}
      footer={
        <>
          <Button
            variant="bordered"
            color="default"
            size="sm"
            onPress={onClose}
            isDisabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            color={btnColor}
            size="sm"
            onPress={handleConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {/* Icon + copy — no ModalHeader, everything lives in the body */}
      <div className="flex flex-col items-start gap-4 pt-1">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            iconBg,
          )}
        >
          <span className={iconColor}>{icon}</span>
        </div>
        <div className="space-y-1.5">
          <p className="font-display text-[1.15rem] font-normal leading-snug text-default-900">
            {title}
          </p>
          {description && (
            <p className="text-[13px] leading-relaxed text-default-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════
   HOOK — useConfirm
   Programmatic confirm dialog trigger
══════════════════════════════════════════ */
export interface UseConfirmOptions extends Omit<
  ConfirmDialogProps,
  "isOpen" | "onClose" | "onConfirm"
> {}

/**
 * useConfirm — open a ConfirmDialog imperatively.
 *
 * @example
 * const { ConfirmUI, confirm } = useConfirm({
 *   variant: "danger",
 *   title: "Supprimer la commande ?",
 *   confirmLabel: "Supprimer",
 * });
 *
 * // In your handler:
 * await confirm(async () => { await deleteOrder(id); });
 *
 * // In JSX:
 * {ConfirmUI}
 */
export function useConfirm(options: UseConfirmOptions = {}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let resolveRef: (() => void) | null = null;

  function confirm(fn: () => void | Promise<void>) {
    resolveRef = fn as () => void;
    onOpen();
  }

  const ConfirmUI = (
    <ConfirmDialog
      {...options}
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={async () => {
        if (resolveRef) await resolveRef();
      }}
    />
  );

  return { confirm, ConfirmUI };
}

export { useDisclosure };
