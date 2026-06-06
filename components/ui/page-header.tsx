"use client";

import Link from "next/link";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional subtitle under the title */
  description?: string;
  /** Breadcrumb trail — last item is current page (rendered as text) */
  breadcrumbs?: BreadcrumbSegment[];
  /** Right-side action buttons / chips */
  actions?: ReactNode;
  /** Extra className on the wrapper */
  className?: string;
}

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
/**
 * PageHeader
 *
 * Renders a breadcrumb trail, page title, optional description
 * and a right-aligned actions slot.
 *
 * @example
 * <PageHeader
 *   title="Commandes"
 *   description="247 commandes ce mois"
 *   breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Commandes" }]}
 *   actions={<Button size="sm">Nouvelle commande</Button>}
 * />
 */
export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          size="sm"
          variant="light"
          classNames={{
            list: "gap-0.5",
            separator: "px-0.5 text-default-300",
          }}
        >
          {breadcrumbs.map((seg, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <BreadcrumbItem
                key={seg.label}
                isCurrent={isLast}
                classNames={{
                  item: cn(
                    "text-xs font-medium transition-colors",
                    isLast
                      ? "text-default-700"
                      : "text-default-400 hover:text-default-700",
                  ),
                }}
              >
                {!isLast && seg.href ? (
                  <Link href={seg.href}>{seg.label}</Link>
                ) : (
                  seg.label
                )}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Title row */}
      <div className="flex items-end justify-between gap-4 max-sm:flex-wrap">
        <div className="min-w-0">
          <h1 className="font-display text-[1.65rem] font-normal leading-tight text-default-900 truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-[13px] font-normal text-gray-500">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-shrink-0 items-center gap-2 max-sm:ml-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TOPBAR — sticky header with nav context
══════════════════════════════════════════ */
export interface TopbarProps {
  /** Optional left-side breadcrumb segments */
  breadcrumbs?: BreadcrumbSegment[];
  /** Right-side slot */
  children?: ReactNode;
  className?: string;
}

export function Topbar({ breadcrumbs = [], children, className }: TopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-[60px] flex-shrink-0 items-center justify-between",
        "border-b border-default-200 bg-content1/90 backdrop-blur-md px-6 gap-4",
        className,
      )}
    >
      {/* Breadcrumb */}
      <Breadcrumbs
        size="sm"
        variant="light"
        classNames={{ list: "gap-0.5", separator: "px-0.5 text-default-300" }}
      >
        {breadcrumbs.map((seg, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <BreadcrumbItem
              key={seg.label}
              isCurrent={isLast}
              classNames={{
                item: cn(
                  "text-[13px] font-medium transition-colors",
                  isLast
                    ? "text-default-800"
                    : "text-default-400 hover:text-default-700",
                ),
              }}
            >
              {!isLast && seg.href ? (
                <Link href={seg.href}>{seg.label}</Link>
              ) : (
                seg.label
              )}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumbs>

      {/* Right slot */}
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
