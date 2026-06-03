"use client";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chip } from "@heroui/chip";
import { cn } from "@/lib/utils";
import { GripVertical, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export interface KanbanCard {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string | number;
  badgeColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  meta?: ReactNode;
  tag?: string;
  tagColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
}

export interface KanbanColumn {
  id: string;
  label: string;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  cards: KanbanCard[];
  /** Disable dropping into this column */
  isDropDisabled?: boolean;
  /** Called when + button is clicked */
  onAdd?: () => void;
}

export interface KanbanProps {
  columns: KanbanColumn[];
  onChange?: (columns: KanbanColumn[]) => void;
  /** Custom card renderer — overrides the default card UI */
  renderCard?: (card: KanbanCard, columnId: string) => ReactNode;
  className?: string;
}

/* ══════════════════════════════════════════
   COLUMN HEADER COLOR MAP
══════════════════════════════════════════ */
const COL_COLORS: Record<
  NonNullable<KanbanColumn["color"]>,
  { dot: string; count: string; countText: string }
> = {
  default: {
    dot: "bg-default-400",
    count: "bg-default-100",
    countText: "text-default-500",
  },
  primary: {
    dot: "bg-primary",
    count: "bg-primary-100",
    countText: "text-primary",
  },
  secondary: {
    dot: "bg-secondary",
    count: "bg-secondary-100",
    countText: "text-secondary",
  },
  success: {
    dot: "bg-success",
    count: "bg-success-100",
    countText: "text-success",
  },
  warning: {
    dot: "bg-warning",
    count: "bg-warning-100",
    countText: "text-warning",
  },
  danger: {
    dot: "bg-danger",
    count: "bg-danger-100",
    countText: "text-danger",
  },
};

/* ══════════════════════════════════════════
   SORTABLE CARD
══════════════════════════════════════════ */
function SortableCard({
  card,
  columnId,
  renderCard,
  isDragging,
}: {
  card: KanbanCard;
  columnId: string;
  renderCard?: (card: KanbanCard, colId: string) => ReactNode;
  isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "opacity-50")}
    >
      {renderCard ? (
        renderCard(card, columnId)
      ) : (
        <DefaultCard
          card={card}
          dragHandleProps={{ ...attributes, ...listeners }}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   DEFAULT CARD UI
══════════════════════════════════════════ */
function DefaultCard({
  card,
  dragHandleProps,
  isOverlay,
}: {
  card: KanbanCard;
  dragHandleProps?: Record<string, unknown>;
  isOverlay?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border border-default-200 bg-content1 p-3",
        "shadow-card transition-shadow",
        isOverlay
          ? "rotate-[1.5deg] shadow-card-md cursor-grabbing"
          : "hover:shadow-card-md hover:border-default-300 cursor-default",
      )}
    >
      {/* Drag handle */}
      <button
        {...dragHandleProps}
        className={cn(
          "mt-0.5 flex-shrink-0 text-default-200 transition-colors",
          "hover:text-default-400 cursor-grab active:cursor-grabbing",
          "opacity-0 group-hover:opacity-100",
        )}
        aria-label="Déplacer"
      >
        <GripVertical size={14} />
      </button>

      <div className="min-w-0 flex-1">
        {/* Tag */}
        {card.tag && (
          <Chip
            size="sm"
            variant="flat"
            color={card.tagColor ?? "default"}
            classNames={{
              base: "mb-1.5 h-4",
              content: "text-[10px] font-semibold px-1.5",
            }}
          >
            {card.tag}
          </Chip>
        )}

        {/* Title */}
        <p className="text-[13px] font-medium text-default-800 leading-snug">
          {card.title}
        </p>

        {/* Subtitle */}
        {card.subtitle && (
          <p className="mt-0.5 text-[11px] text-default-400 leading-snug truncate">
            {card.subtitle}
          </p>
        )}

        {/* Meta slot */}
        {card.meta && <div className="mt-2">{card.meta}</div>}
      </div>

      {/* Badge */}
      {card.badge !== undefined && (
        <Chip
          size="sm"
          variant="flat"
          color={card.badgeColor ?? "default"}
          classNames={{
            base: "flex-shrink-0 h-5",
            content: "text-[10px] font-semibold px-1.5",
          }}
        >
          {card.badge}
        </Chip>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   COLUMN COMPONENT
══════════════════════════════════════════ */
function KanbanColumnUI({
  column,
  renderCard,
  activeCardId,
}: {
  column: KanbanColumn;
  renderCard?: (card: KanbanCard, columnId: string) => ReactNode;
  activeCardId: string | null;
}) {
  const colors = COL_COLORS[column.color ?? "default"];

  return (
    <div className="flex w-[272px] flex-shrink-0 flex-col gap-0">
      {/* Column header */}
      <div className="mb-2 flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span
            className={cn("h-2 w-2 rounded-full flex-shrink-0", colors.dot)}
          />
          <span className="text-[13px] font-semibold text-default-700">
            {column.label}
          </span>
          <span
            className={cn(
              "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5",
              "text-[10px] font-semibold",
              colors.count,
              colors.countText,
            )}
          >
            {column.cards.length}
          </span>
        </div>
        {column.onAdd && (
          <button
            onClick={column.onAdd}
            className="flex h-6 w-6 items-center justify-center rounded-md text-default-400 transition-colors hover:bg-default-100 hover:text-default-700"
            aria-label="Ajouter une carte"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Drop zone */}
      <SortableContext
        items={column.cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={cn(
            "flex min-h-[120px] flex-col gap-2 rounded-xl p-2",
            "bg-default-50 border border-default-100",
            "transition-colors",
            column.isDropDisabled && "opacity-60 pointer-events-none",
          )}
        >
          {column.cards.map((card) => (
            <SortableCard
              key={card.id}
              card={card}
              columnId={column.id}
              renderCard={renderCard}
              isDragging={card.id === activeCardId}
            />
          ))}

          {column.cards.length === 0 && (
            <div className="flex flex-1 items-center justify-center py-6">
              <p className="text-[12px] text-default-300 select-none">
                Déposez ici
              </p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN KANBAN
══════════════════════════════════════════ */
/**
 * Kanban
 *
 * Drag-and-drop Kanban board powered by @dnd-kit.
 * Columns and cards are controlled — pass `onChange`
 * to persist new state.
 *
 * @example
 * const [cols, setCols] = useState<KanbanColumn[]>([
 *   { id: "pending",   label: "En attente",    color: "warning", cards: [] },
 *   { id: "confirmed", label: "Confirmée",     color: "primary", cards: [] },
 *   { id: "delivered", label: "Livrée",        color: "success", cards: [] },
 * ]);
 *
 * <Kanban columns={cols} onChange={setCols} />
 */
export function Kanban({
  columns,
  onChange,
  renderCard,
  className,
}: KanbanProps) {
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  /* Find which column a card belongs to */
  function findColumn(cardId: string): KanbanColumn | undefined {
    return columns.find((col) => col.cards.some((c) => c.id === cardId));
  }

  function handleDragStart({ active }: DragStartEvent) {
    const col = findColumn(String(active.id));
    const card = col?.cards.find((c) => c.id === active.id);
    if (card) setActiveCard(card);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCard(null);
    if (!over || active.id === over.id) return;

    const srcCol = findColumn(String(active.id));
    const dstCard = findColumn(String(over.id));
    // Also check if "over" is a column id directly
    const dstColById = columns.find((c) => c.id === over.id);
    const dstCol = dstCard ?? dstColById;

    if (!srcCol || !dstCol) return;

    const newCols = columns.map((col) => {
      if (col.id === srcCol.id && col.id === dstCol.id) {
        // Same column reorder
        const oldIdx = col.cards.findIndex((c) => c.id === active.id);
        const newIdx = col.cards.findIndex((c) => c.id === over.id);
        return { ...col, cards: arrayMove(col.cards, oldIdx, newIdx) };
      }
      if (col.id === srcCol.id) {
        // Remove from source
        return { ...col, cards: col.cards.filter((c) => c.id !== active.id) };
      }
      if (col.id === dstCol.id) {
        // Insert into destination
        const card = srcCol.cards.find((c) => c.id === active.id)!;
        const insertIdx = col.cards.findIndex((c) => c.id === over.id);
        const newCards = [...col.cards];
        newCards.splice(insertIdx >= 0 ? insertIdx : newCards.length, 0, card);
        return { ...col, cards: newCards };
      }
      return col;
    });

    onChange?.(newCols);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
        {columns.map((col) => (
          <KanbanColumnUI
            key={col.id}
            column={col}
            renderCard={renderCard}
            activeCardId={activeCard?.id ?? null}
          />
        ))}
      </div>

      {/* Floating drag overlay */}
      <DragOverlay
        dropAnimation={{
          duration: 180,
          easing: "cubic-bezier(.25,.46,.45,.94)",
        }}
      >
        {activeCard && <DefaultCard card={activeCard} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
