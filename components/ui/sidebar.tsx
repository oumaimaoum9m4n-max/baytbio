"use client";

import { useState, createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Button } from "@heroui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ClipboardList, Truck, Tag, Users,
  DollarSign, BarChart2, Settings, HelpCircle, BookOpen,
  ChevronDown, ChevronLeft, ChevronRight, Zap, X, Leaf,
} from "lucide-react";

/* ══════════════════════════════════════════
   CONTEXT
══════════════════════════════════════════ */
interface SidebarCtx {
  collapsed: boolean;
  toggle: () => void;
}
const SidebarContext = createContext<SidebarCtx>({ collapsed: false, toggle: () => {} });
export const useSidebar = () => useContext(SidebarContext);

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
interface NavChild {
  label: string;
  href: string;
  badge?: number | string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: ReactNode;
  badge?: number | string;
  children?: NavChild[];
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

/* ══════════════════════════════════════════
   NAV CONFIG — edit here to change structure
══════════════════════════════════════════ */
const NAV: NavGroup[] = [
  {
    items: [
      {
        label: "Accueil",
        href: "/dashboard",
        icon: <LayoutDashboard size={17} />,
      },
      {
        label: "Commandes",
        href: "/dashboard/orders",
        icon: <ClipboardList size={17} />,
        badge: 12,
      },
      {
        label: "Livraisons",
        icon: <Truck size={17} />,
        children: [
          { label: "Aujourd'hui",    href: "/dashboard/deliveries/today",    badge: 8 },
          { label: "Planification",  href: "/dashboard/deliveries/planning" },
          { label: "Historique",     href: "/dashboard/deliveries/history" },
        ],
      },
      {
        label: "Produits",
        href: "/dashboard/products",
        icon: <Tag size={17} />,
      },
      {
        label: "Clients",
        href: "/dashboard/clients",
        icon: <Users size={17} />,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        label: "Revenus",
        href: "/dashboard/revenue",
        icon: <DollarSign size={17} />,
      },
      {
        label: "Analytiques",
        href: "/dashboard/analytics",
        icon: <BarChart2 size={17} />,
      },
    ],
  },
  {
    label: "Ressources",
    items: [
      {
        label: "Centre d'aide",
        href: "/dashboard/help",
        icon: <BookOpen size={17} />,
      },
      {
        label: "Support",
        href: "/dashboard/support",
        icon: <HelpCircle size={17} />,
      },
      {
        label: "Paramètres",
        href: "/dashboard/settings",
        icon: <Settings size={17} />,
      },
    ],
  },
];

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

/** Single nav leaf item (no children) */
function NavLeaf({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith((item.href ?? "") + "/");

  const inner = (
    <Link
      href={item.href ?? "#"}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-[9px] text-sm font-medium transition-colors",
        "select-none cursor-pointer",
        active
          ? "bg-primary-100 text-primary"
          : "text-default-600 hover:bg-default-100 hover:text-default-900",
        collapsed && "justify-center px-2",
      )}
    >
      {/* Active left bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
      )}

      <span className={cn("flex-shrink-0", active ? "text-primary" : "text-default-400 group-hover:text-default-700")}>
        {item.icon}
      </span>

      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && (
            <Chip size="sm" variant="flat" color={active ? "primary" : "default"}
              classNames={{ base: "h-5 min-w-[20px]", content: "px-1 text-[10px] font-semibold" }}>
              {item.badge}
            </Chip>
          )}
        </>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip content={item.label} placement="right" delay={0} closeDelay={0}
        classNames={{ content: "text-xs font-medium" }}>
        {inner}
      </Tooltip>
    );
  }
  return inner;
}

/** Nav item with children (expandable) */
function NavGroup_({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isChildActive = item.children?.some(
    (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
  );
  const [open, setOpen] = useState(isChildActive ?? false);

  const trigger = (
    <button
      onClick={() => !collapsed && setOpen((p) => !p)}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-[9px] text-sm font-medium transition-colors select-none",
        isChildActive
          ? "bg-primary-100 text-primary"
          : "text-default-600 hover:bg-default-100 hover:text-default-900",
        collapsed && "justify-center px-2",
      )}
    >
      {isChildActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
      )}
      <span className={cn("flex-shrink-0", isChildActive ? "text-primary" : "text-default-400 group-hover:text-default-700")}>
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="flex-1 truncate text-left">{item.label}</span>
          {item.badge !== undefined && (
            <Chip size="sm" variant="flat" color={isChildActive ? "primary" : "default"}
              classNames={{ base: "h-5 min-w-[20px]", content: "px-1 text-[10px] font-semibold" }}>
              {item.badge}
            </Chip>
          )}
          <ChevronDown
            size={14}
            className={cn("flex-shrink-0 text-default-400 transition-transform duration-200", open && "rotate-180")}
          />
        </>
      )}
    </button>
  );

  return (
    <div>
      {collapsed ? (
        <Tooltip content={item.label} placement="right" delay={0} closeDelay={0}
          classNames={{ content: "text-xs font-medium" }}>
          {trigger}
        </Tooltip>
      ) : (
        trigger
      )}

      {/* Children — only render when expanded */}
      {!collapsed && open && (
        <div className="relative mt-0.5 ml-4 pl-3">
          {/* Vertical connecting line */}
          <span className="absolute left-0 top-1 bottom-2 w-px bg-default-200" />

          {item.children?.map((child) => {
            const childActive = pathname === child.href;
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-md px-2 py-[7px] text-[13px] transition-colors",
                  childActive
                    ? "font-medium text-primary"
                    : "font-normal text-default-500 hover:text-default-900 hover:bg-default-100",
                )}
              >
                <span className="truncate">{child.label}</span>
                {child.badge !== undefined && (
                  <Chip size="sm" variant="flat" color={childActive ? "primary" : "default"}
                    classNames={{ base: "h-4 min-w-[18px]", content: "px-1 text-[10px] font-semibold" }}>
                    {child.badge}
                  </Chip>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   UPGRADE CARD
══════════════════════════════════════════ */
function UpgradeCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="mx-3 rounded-xl border border-warning-200 bg-warning-50 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning text-white flex-shrink-0">
          <Zap size={14} />
        </div>
        <button
          onClick={onDismiss}
          className="text-default-400 hover:text-default-600 transition-colors mt-0.5"
          aria-label="Fermer"
        >
          <X size={13} />
        </button>
      </div>
      <p className="text-[13px] font-semibold text-default-900 mb-0.5">
        Passez au Pro !
      </p>
      <p className="text-[11px] text-default-500 leading-relaxed mb-3">
        Analytiques avancées, exports illimités et rapports automatiques.
      </p>
      <Button
        size="sm"
        color="warning"
        className="w-full text-xs font-semibold"
      >
        Mettre à niveau
      </Button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN SIDEBAR
══════════════════════════════════════════ */
export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(true);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle: () => setCollapsed((p) => !p) }}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-default-200 bg-content1 shadow-sidebar",
          "transition-[width] duration-[220ms] ease-[cubic-bezier(.25,.46,.45,.94)]",
          "fixed left-0 top-0 z-50",
          collapsed ? "w-16" : "w-[248px]",
        )}
      >
        {/* ── Logo ── */}
        <div className={cn(
          "flex h-[60px] flex-shrink-0 items-center border-b border-default-200 px-4 gap-3",
          collapsed && "justify-center px-0",
        )}>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
            <Leaf size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span className="font-display text-[17px] font-medium text-default-900 leading-none">
              Ferme<span className="text-primary">Beldi</span>
            </span>
          )}
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 space-y-4">
          {NAV.map((group, gi) => (
            <div key={gi} className="space-y-0.5">
              {/* Group label */}
              {group.label && !collapsed && (
                <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-widest text-default-400">
                  {group.label}
                </p>
              )}
              {group.label && collapsed && (
                <div className="my-1 mx-3 border-t border-default-200" />
              )}

              {group.items.map((item) =>
                item.children ? (
                  <NavGroup_ key={item.label} item={item} collapsed={collapsed} />
                ) : (
                  <NavLeaf key={item.label} item={item} collapsed={collapsed} />
                ),
              )}
            </div>
          ))}
        </nav>

        {/* ── Upgrade card ── */}
        {showUpgrade && !collapsed && (
          <div className="py-3">
            <UpgradeCard onDismiss={() => setShowUpgrade(false)} />
          </div>
        )}

        {/* ── Collapse button ── */}
        <div className={cn(
          "flex-shrink-0 border-t border-default-200 px-3 py-3",
          collapsed && "flex justify-center px-0",
        )}>
          <button
            onClick={() => setCollapsed((p) => !p)}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-[9px] text-[13px] font-medium",
              "text-default-500 hover:bg-default-100 hover:text-default-900 transition-colors select-none",
              collapsed && "justify-center px-2 w-auto",
            )}
          >
            {collapsed ? (
              <ChevronRight size={15} />
            ) : (
              <>
                <ChevronLeft size={15} />
                <span>Réduire la sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </SidebarContext.Provider>
  );
}
