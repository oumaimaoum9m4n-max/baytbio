"use client";

import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { Button } from "@heroui/react";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type ActionColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

interface BuiltInAction {
  template: "view" | "update" | "delete";
  onAction: () => void;
  isDisabled?: boolean;
}

interface StandardAction {
  template: "standard";
  label: string;
  icon: ReactNode;
  onAction: () => void;
  color?: ActionColor;
  isDisabled?: boolean;
}

export type TableAction = BuiltInAction | StandardAction;

export interface TableActionsProps {
  actions: TableAction[];
  triggerLabel?: string;
  className?: string;
}

/* ══════════════════════════════════════════
   BUILT-IN TEMPLATE DEFINITIONS
══════════════════════════════════════════ */
const BUILT_IN: Record<
  "view" | "update" | "delete",
  { label: string; icon: ReactNode; color: ActionColor; isDanger: boolean }
> = {
  view: {
    label: "Voir les détails",
    icon: <Eye size={14} />,
    color: "default",
    isDanger: false,
  },
  update: {
    label: "Modifier",
    icon: <Pencil size={14} />,
    color: "default",
    isDanger: false,
  },
  delete: {
    label: "Supprimer",
    icon: <Trash2 size={14} />,
    color: "danger",
    isDanger: true,
  },
};

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
/**
 * TableActions
 *
 * A "⋯" icon button that opens a contextual dropdown.
 * Each action is self-contained with its own onAction handler.
 *
 * Built-in templates (icon, color, label are preset):
 *   { template: "view",   onAction: () => ... }
 *   { template: "update", onAction: () => ... }
 *   { template: "delete", onAction: () => ... }
 *
 * Custom action (provide everything):
 *   { template: "standard", label: "Dupliquer", icon: <Copy size={14} />, onAction: () => ... }
 */
export function TableActions({
  actions,
  triggerLabel = "Actions",
  className,
}: TableActionsProps) {
  type Resolved = {
    key: string;
    label: string;
    icon: ReactNode;
    color: ActionColor;
    isDanger: boolean;
    isDisabled: boolean;
    onAction: () => void;
  };

  const resolved: Resolved[] = actions.map((action, i) => {
    if (action.template !== "standard") {
      const tpl = BUILT_IN[action.template];
      return {
        key: String(i),
        label: tpl.label,
        icon: tpl.icon,
        color: tpl.color,
        isDanger: tpl.isDanger,
        isDisabled: action.isDisabled ?? false,
        onAction: action.onAction,
      };
    }
    const color = action.color ?? "default";
    return {
      key: String(i),
      label: action.label,
      icon: action.icon,
      color,
      isDanger: color === "danger",
      isDisabled: action.isDisabled ?? false,
      onAction: action.onAction,
    };
  });

  const standard = resolved.filter((a) => !a.isDanger);
  const danger = resolved.filter((a) => a.isDanger);

  const handleAction = (key: React.Key) => {
    resolved.find((a) => a.key === String(key))?.onAction();
  };

  return (
    <Dropdown
      placement="bottom-end"
      classNames={{
        content: cn(
          "min-w-[180px] p-1.5",
          "border border-default-200 shadow-card-md bg-content1",
          "rounded-xl",
          className,
        ),
      }}
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="default"
          aria-label={triggerLabel}
          className="text-default-400 hover:text-default-700 data-[hover]:bg-default-100 rounded-lg"
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label={triggerLabel}
        onAction={handleAction}
        itemClasses={{
          base: cn(
            "rounded-lg px-2.5 py-2 text-[13px] font-medium",
            "transition-colors data-[hover]:bg-default-100",
            "gap-2.5",
          ),
          title: "text-[13px] font-medium",
          selectedIcon: "hidden",
        }}
      >
        {[
          ...(standard.length > 0
            ? [
                <DropdownSection
                  key="standard"
                  showDivider={danger.length > 0}
                  classNames={{ divider: "bg-default-100" }}
                >
                  {standard.map((a) => (
                    <DropdownItem
                      key={a.key}
                      isDisabled={a.isDisabled}
                      startContent={
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-default-100 text-default-500">
                          {a.icon}
                        </span>
                      }
                    >
                      {a.label}
                    </DropdownItem>
                  ))}
                </DropdownSection>,
              ]
            : []),
          ...(danger.length > 0
            ? [
                <DropdownSection
                  key="danger"
                  classNames={{ divider: "bg-default-100" }}
                >
                  {danger.map((a) => (
                    <DropdownItem
                      key={a.key}
                      color="danger"
                      isDisabled={a.isDisabled}
                      startContent={
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-danger-50 text-danger">
                          {a.icon}
                        </span>
                      }
                      classNames={{
                        base: "text-danger data-[hover]:bg-danger-50",
                        title: "text-danger",
                      }}
                    >
                      {a.label}
                    </DropdownItem>
                  ))}
                </DropdownSection>,
              ]
            : []),
        ]}
      </DropdownMenu>
    </Dropdown>
  );
}
