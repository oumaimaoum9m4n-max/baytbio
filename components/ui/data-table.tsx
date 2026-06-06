"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
  useState,
  useMemo,
  useCallback,
  type ReactNode,
  type Key,
} from "react";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "start" | "center" | "end";
  required?: boolean;
}

export type SortDirection = "ascending" | "descending";

/** Controlled search — pass this to show and drive the search input from outside */
export interface SearchControlProps {
  value: string;
  onChange: (v: string) => void;
}

/** Controlled pagination — pass this to show and drive the pagination footer from outside */
export interface PaginationControlProps {
  page: number;
  pageSize: number;
  /** Total number of pages */
  numOfPages: number;
  /** Total number of (filtered) rows — used for the footer count display */
  total?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export interface DataTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  rows: T[];
  /** Controlled search — presence enables the search input */
  search?: SearchControlProps;
  /** Controlled pagination — presence enables the pagination footer */
  withPagination?: PaginationControlProps;
  toolbarEnd?: ReactNode;
  topActions?: ReactNode;
  selectable?: boolean;
  onSelectionChange?: (keys: Set<Key>) => void;
  isLoading?: boolean;
  emptyContent?: ReactNode;
  /** Controlled sort */
  sortDescriptor?: { column: string; direction: SortDirection };
  onSortChange?: (col: string, dir: SortDirection) => void;
  className?: string;
  label?: string;
  showRowCount?: boolean;
  rowClassName?: (row: T) => string;
}

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
const DEFAULT_PAGE_SIZES = [10, 20, 50, 100];

export function DataTable<T extends { id: string | number }>({
  columns,
  rows,
  search,
  withPagination,
  toolbarEnd,
  topActions,
  selectable = false,
  onSelectionChange,
  isLoading = false,
  emptyContent,
  sortDescriptor,
  onSortChange,
  className,
  label = "Tableau de données",
  showRowCount = true,
  rowClassName,
}: DataTableProps<T>) {
  /* ── State ── */
  const [selected, setSelected] = useState<Set<Key>>(new Set());
  const [internalSort, setInternalSort] = useState<{
    column: string;
    direction: SortDirection;
  } | null>(null);

  const sort = sortDescriptor
    ? { column: sortDescriptor.column, direction: sortDescriptor.direction }
    : internalSort;

  /* ── Sort (client-side when no sortDescriptor) ── */
  const sorted = useMemo(() => {
    if (!sort || sortDescriptor) return rows;
    return [...rows].sort((a, b) => {
      const va = (a as Record<string, unknown>)[sort.column];
      const vb = (b as Record<string, unknown>)[sort.column];
      const cmp =
        typeof va === "number" && typeof vb === "number"
          ? va - vb
          : String(va ?? "").localeCompare(String(vb ?? ""));
      return sort.direction === "ascending" ? cmp : -cmp;
    });
  }, [rows, sort, sortDescriptor]);

  /* ── Handlers ── */
  const handleSortChange = useCallback(
    (col: string) => {
      const newDir: SortDirection =
        sort?.column === col && sort.direction === "ascending"
          ? "descending"
          : "ascending";
      if (onSortChange) {
        onSortChange(col, newDir);
      } else {
        setInternalSort({ column: col, direction: newDir });
      }
    },
    [sort, onSortChange],
  );

  const handleSelection = useCallback(
    (keys: "all" | Set<Key>) => {
      const set = keys === "all" ? new Set(rows.map((r) => r.id as Key)) : keys;
      setSelected(set);
      onSelectionChange?.(set);
    },
    [rows, onSelectionChange],
  );

  const handlePageSizeChange = useCallback(
    (keys: Set<Key>) => {
      const v = parseInt(String([...keys][0]));
      if (!isNaN(v)) withPagination?.onPageSizeChange(v);
    },
    [withPagination],
  );

  /* ── Display values ── */
  const totalRows = withPagination?.total ?? rows.length;
  const pageSizeOptions = withPagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZES;

  const start = withPagination
    ? (withPagination.page - 1) * withPagination.pageSize + 1
    : 1;
  const end = withPagination
    ? (withPagination.page - 1) * withPagination.pageSize + rows.length
    : rows.length;

  return (
    <div
      className={cn(
        "flex flex-col gap-0 rounded-xl border border-default-200 bg-content1 shadow-card overflow-hidden",
        className,
      )}
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-default-100 px-4 py-3">
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
          {/* Search */}
          {search && (
            <Input
              size="sm"
              placeholder="Rechercher…"
              value={search.value}
              onValueChange={search.onChange}
              startContent={
                <Search size={14} className="text-default-400 flex-shrink-0" />
              }
              endContent={
                search.value ? (
                  <button
                    onClick={() => search.onChange("")}
                    className="text-default-300 hover:text-default-600 transition-colors"
                  >
                    <X size={13} />
                  </button>
                ) : null
              }
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-[#FAF8F5] border-[#E8E4DC] hover:border-[#2D5A3D] focus-within:border-[#2D5A3D] h-9 min-h-9 shadow-none",
                input:
                  "text-[0.81rem] text-[#2C2C2C] placeholder:text-[#C8C8C0]",
              }}
              className="max-w-[260px]"
            />
          )}

          {/* Bulk action hint */}
          {selectable && selected.size > 0 && (
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              classNames={{
                base: "h-7",
                content: "text-[11px] font-medium px-2",
              }}
            >
              {selected.size} sélectionné{selected.size > 1 ? "s" : ""}
            </Chip>
          )}

          {toolbarEnd}
        </div>

        {topActions && (
          <div className="flex flex-shrink-0 items-center gap-2">
            {topActions}
          </div>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <Table
          aria-label={label}
          removeWrapper
          isStriped={false}
          selectionMode={selectable ? "multiple" : "none"}
          selectedKeys={selected as any}
          onSelectionChange={handleSelection}
          sortDescriptor={
            sort
              ? { column: sort.column, direction: sort.direction }
              : undefined
          }
          onSortChange={(sd) => handleSortChange(String(sd.column))}
          classNames={{
            th: "bg-[#FAF8F5] text-[#888880] text-[0.62rem] tracking-[0.1em] uppercase font-semibold border-b border-[#E8E4DC] py-2.5 px-4 first:rounded-none last:rounded-none",
            td: "py-[11px] px-4 text-[0.8rem] text-[#2C2C2C] border-b border-[#E8E4DC] group-data-[last=true]:border-b-0",
            tr: "hover:bg-[#FAF8F5] transition-colors cursor-pointer data-[selected=true]:bg-[#F2F7F2]",
          }}
        >
          <TableHeader columns={columns}>
            {(col) => (
              <TableColumn
                key={col.key}
                allowsSorting={col.sortable}
                align={col.align ?? "start"}
                className={col.width}
              >
                {col.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody
            items={sorted}
            isLoading={isLoading}
            loadingContent={
              <div className="flex flex-col items-center gap-3 py-16">
                <Spinner color="primary" size="lg" />
                <p className="text-sm text-default-400">Chargement…</p>
              </div>
            }
            emptyContent={
              emptyContent ?? (
                <div className="flex flex-col items-center gap-3 py-16">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-default-100">
                    <SlidersHorizontal size={22} className="text-default-300" />
                  </div>
                  <p className="text-sm font-medium text-default-500">
                    Aucun résultat
                  </p>
                  {search?.value && (
                    <Button
                      size="sm"
                      variant="bordered"
                      color="default"
                      onPress={() => search.onChange("")}
                    >
                      Effacer la recherche
                    </Button>
                  )}
                </div>
              )
            }
          >
            {(row) => (
              <TableRow key={row.id} className={rowClassName?.(row)}>
                {(colKey) => {
                  const col = columns.find((c) => c.key === colKey);
                  const value = getKeyValue(row, colKey);
                  return (
                    <TableCell
                      className={col?.align ? `text-${col.align}` : ""}
                    >
                      {col?.render
                        ? col.render(value, row)
                        : (value as ReactNode)}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Footer (only when pagination is controlled) ── */}
      {withPagination && rows.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-default-100 bg-default-50/50 px-4 py-2.5">
          {/* Info */}
          <p className="text-[12px] text-default-400 flex-shrink-0">
            Affichage{" "}
            <span className="font-medium text-default-600">
              {start}–{end}
            </span>{" "}
            sur{" "}
            <span className="font-medium text-default-600">{totalRows}</span>
          </p>

          <div className="flex items-center gap-3">
            {/* Page size */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-default-400 whitespace-nowrap">
                Lignes&nbsp;:
              </span>
              <Select
                size="sm"
                aria-label="Lignes par page"
                selectedKeys={new Set([String(withPagination.pageSize)])}
                onSelectionChange={handlePageSizeChange as never}
                classNames={{
                  base: "w-[70px]",
                  trigger: "h-7 min-h-7 border-default-200 bg-content1 px-2",
                  value: "text-[12px] font-medium text-default-600",
                  listbox: "text-[13px]",
                  popoverContent: "min-w-[80px]",
                }}
              >
                {pageSizeOptions.map((n) => (
                  <SelectItem key={String(n)} textValue={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="h-4 w-px bg-default-200" />

            {/* Pagination */}
            <Pagination
              page={withPagination.page}
              total={withPagination.numOfPages}
              onChange={withPagination.onPageChange}
              size="sm"
              showControls
              showShadow={false}
              classNames={{
                cursor: "bg-[#2D5A3D] text-white font-semibold shadow-none",
                item: "text-[0.76rem] text-[#555550] bg-white border border-[#E8E4DC] hover:border-[#2D5A3D] hover:text-[#2D5A3D]",
                prev: "text-[#555550] bg-white border border-[#E8E4DC] hover:border-[#2D5A3D] hover:text-[#2D5A3D]",
                next: "text-[#555550] bg-white border border-[#E8E4DC] hover:border-[#2D5A3D] hover:text-[#2D5A3D]",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
