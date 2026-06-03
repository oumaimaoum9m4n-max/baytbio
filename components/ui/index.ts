/* ══════════════════════════════════════════
   FERME BELDI — Design System
   Single import entry-point.

   Usage:
   import { Button, DataTable, toast, Modal, useDisclosure } from "@/components/ui";
══════════════════════════════════════════ */

export { DataTable }          from "./data-table";
export type { Column, DataTableProps, SortDirection } from "./data-table";

export { toast }              from "./toast";
export type { ToastVariant, ToastOptions } from "./toast";

export { ConfirmDialog, useConfirm, useDisclosure } from "./confirm-dialog";
export type { ConfirmDialogProps, ConfirmVariant }  from "./confirm-dialog";

export { Modal }              from "./modal";
export type { ModalProps, ModalSize } from "./modal";

export { Sidebar, useSidebar } from "./sidebar";

export { PageHeader, Topbar }  from "./page-header";
export type { PageHeaderProps, TopbarProps, BreadcrumbSegment } from "./page-header";

export { TableActions } from "./table-actions";
export type { TableAction, TableActionsProps } from "./table-actions";

export { Kanban }             from "./kanban";
export type { KanbanProps, KanbanColumn, KanbanCard } from "./kanban";

export { FormInput }          from "./form-input";
export type { FormInputProps, SelectOption } from "./form-input";

export { LinkButton }         from "./link-button";
