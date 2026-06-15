"use client";

import { cn } from "@/lib/utils";
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import type { ReactNode } from "react";

export { useDisclosure };

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export type ModalSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export interface ModalProps {
  /** Control open state */
  isOpen: boolean;
  onClose: () => void;
  /** Title shown in ModalHeader */
  title?: ReactNode;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Body content */
  children: ReactNode;
  /** Footer slot — usually action buttons */
  footer?: ReactNode;
  /** HeroUI modal size */
  size?: ModalSize;
  /** Hide the built-in footer divider */
  hideFooterDivider?: boolean;
  /** Extra class on ModalContent wrapper */
  className?: string;
  /** Prevent closing on outside click */
  isDismissable?: boolean;
  /** Scroll content inside or outside the modal */
  scrollBehavior?: "inside" | "outside";
  placement?:
    | "auto"
    | "center"
    | "top"
    | "top-center"
    | "bottom"
    | "bottom-center";
  /** Slides in from the right as a side panel, below the 60 px navbar */
  isDrawer?: boolean;
}

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
/**
 * Bayt Bio Modal
 *
 * Wraps HeroUI's Modal with:
 * - Blurred backdrop (via globals.css override)
 * - Consistent header/footer padding
 * - Optional subtitle under title
 * - All HeroUI features (scrollBehavior, size, etc.)
 *
 * @example
 * const { isOpen, onOpen, onClose } = useDisclosure();
 *
 * <Button onPress={onOpen}>Ouvrir</Button>
 * <Modal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Modifier le produit"
 *   subtitle="FB-PROD-001"
 *   footer={
 *     <>
 *       <Button variant="bordered" onPress={onClose}>Annuler</Button>
 *       <Button onPress={handleSave}>Enregistrer</Button>
 *     </>
 *   }
 * >
 *   <p>Contenu du modal</p>
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  hideFooterDivider = false,
  className,
  isDismissable = true,
  scrollBehavior = "inside",
  placement = "center",
  isDrawer = false,
}: ModalProps) {
  return (
    <HeroModal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      size={isDrawer ? "full" : size}
      placement={isDrawer ? "center" : placement}
      scrollBehavior={scrollBehavior}
      classNames={
        isDrawer
          ? {
              backdrop: "bg-black/35 backdrop-blur-[3px] !top-[60px]",
              wrapper: "justify-end !top-[60px]",
              base: "bg-white border-l border-[#E8E4DC] shadow-[-6px_0_24px_rgba(44,44,44,.1)] m-0 rounded-none w-[480px] max-w-[90vw] h-full max-h-full",
              header: "border-b border-[#E8E4DC] py-4 px-6 shrink-0",
              body: "py-5 px-6",
              footer: "border-t border-[#E8E4DC] py-4 px-5 shrink-0",
              closeButton: "top-3.5 right-4 text-[#888880] hover:text-[#2C2C2C] hover:bg-[#FAF8F5]",
            }
          : {
              backdrop: "bg-black/35 backdrop-blur-[4px]",
              base: "bg-white border border-[#E8E4DC] shadow-[0_12px_40px_rgba(44,44,44,.18)] rounded-xl m-4",
              header: "border-b border-[#E8E4DC] pb-3 pt-5 px-6",
              body: "py-5 px-6",
              footer: "border-t border-[#E8E4DC] pt-3 pb-5 px-6",
              closeButton: "top-3.5 right-4 text-[#888880] hover:text-[#2C2C2C] hover:bg-[#FAF8F5]",
            }
      }
      isDismissable={isDismissable}
    >
      <ModalContent>
        {/* Title */}
        {title && (
          <ModalHeader className="flex flex-col gap-0.5 pb-2 border-b border-default-100">
            <span className="font-display text-xl font-normal text-default-900 leading-snug">
              {title}
            </span>
            {subtitle && (
              <span className="text-xs font-normal text-default-400 font-mono">
                {subtitle}
              </span>
            )}
          </ModalHeader>
        )}

        {/* Body */}
        <ModalBody className="py-5 px-6 text-sm text-default-700 leading-relaxed">
          {children}
        </ModalBody>

        {/* Footer */}
        {footer && (
          <ModalFooter
            className={cn(
              "flex items-center justify-end gap-2 pt-3",
              !hideFooterDivider && "border-t border-default-100",
            )}
          >
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </HeroModal>
  );
}
