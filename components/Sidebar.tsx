"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tooltip, Avatar } from "@heroui/react";
import Image from "next/image";

import {
  Leaf,
  LayoutDashboard,
  ClipboardList,
  Truck,
  Package,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  X,
} from "lucide-react";
import { getCurrentSession } from "@/utils/session";
import { useSession } from "next-auth/react";

/* ══════════════════════════════════════════
   NAV CONFIG
══════════════════════════════════════════ */
interface NavItem {
  label: string;
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  section?: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    items: [
      {
        label: "Accueil",
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Produits",
        title: "Produits",
        path: "/dashboard/products",
        icon: Package,
      },
      {
        label: "Commandes",
        title: "Commandes",
        path: "/dashboard/orders",
        icon: ClipboardList,
      },
      {
        label: "Utilisateurs",
        title: "Utilisateurs",
        path: "/dashboard/users",
        icon: Users,
      },
    ],
  },
  // {
  //   section: "Performance",
  //   items: [
  //     {
  //       label: "Analytiques",
  //       title: "Analytiques",
  //       path: "/dashboard/analytics",
  //       icon: BarChart3,
  //     },
  //   ],
  // },
  //  {
  //   section: "Guide",
  //   items: [
  //     {
  //       label: "Tutoriel",
  //       title: "Tutoriel",
  //       path: "/dashboard/analytics",
  //       icon: BookOpen,
  //     },
  //   ],
  // },

];

/* ══════════════════════════════════════════
   NAV LINK
══════════════════════════════════════════ */
function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const active =
    item.path === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === item.path || pathname.startsWith(item.path + "/");

  const inner = (
    <Link
      href={item.path}
      className="relative flex items-center gap-2.5 w-[calc(100%-12px)] mx-[6px] my-[1px] rounded-md transition-all duration-150 select-none"
      style={{
        padding: collapsed ? "9px 18px" : "9px 10px",
        background: active ? "rgba(255,255,255,.14)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,.60)",
        fontFamily: "DM Sans, sans-serif",
        fontSize: "0.81rem",
        fontWeight: active ? 500 : 400,
        justifyContent: collapsed ? "center" : undefined,
      }}
    >
      {active && (
        <span className="bg-primary-300 absolute -left-[6px] top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-r-sm" />
      )}
      <item.icon
        size={16}
        style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }}
      />
      {!collapsed && (
        <>
          <span className="truncate flex-1">{item.label}</span>
          {item.badge && (
            <span className="bg-primary ml-auto text-[0.57rem] font-bold px-1.5 py-[2px] rounded-full min-w-[17px] text-center leading-none text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge && (
        <span
          className="absolute top-1 right-1.5 w-2 h-2 rounded-full"
          style={{ background: "#D4883C" }}
        />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip
        content={item.title}
        placement="right"
        classNames={{ content: "bg-primary-700 text-white text-[0.73rem]" }}
      >
        {inner}
      </Tooltip>
    );
  }
  return inner;
}

/* ══════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════ */
interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isCollapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    onMobileClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";

        const logoSrc = "/images/logo/logo_baytbio_white.png";

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={`fixed inset-0 z-[190] bg-black/40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onMobileClose}
      />

      <aside
        className={`bg-primary-800 flex flex-col fixed inset-y-0 left-0 z-[200] transition-[width,transform] duration-300 ease-[cubic-bezier(.25,.46,.45,.94)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        style={{ width: isCollapsed ? 64 : 240 }}
      >
        {/* ── Brand ── */}
        <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-5">
         
          {!isCollapsed && (
            <div className="overflow-hidden flex-1">
                <Image
                                      src={logoSrc}
                                      alt="BaytBio"
                                      width={120}
                                      height={70}
                                      priority
                                      className="object-contain"
                                    />
              <div className="text-white/40 text-[0.54rem] tracking-[0.15em] uppercase font-semibold mt-0.5">
                Admin Dashboard
              </div>
            </div>
          )}
          {/* Mobile: close */}
          <button
            onClick={onMobileClose}
            className="md:hidden shrink-0 text-white/40 hover:text-white transition-colors ml-auto"
          >
            <X size={16} />
          </button>
          {/* Desktop: collapse toggle */}
          <Tooltip
            content={isCollapsed ? "Développer" : "Réduire"}
            placement="right"
            classNames={{ content: "bg-[#1E3D29] text-white text-[0.73rem]" }}
          >
            <button
              onClick={onToggle}
              className="hidden md:block shrink-0 text-white/40 hover:text-white transition-colors ml-auto"
            >
              {isCollapsed ? (
                <PanelLeftOpen size={14} />
              ) : (
                <PanelLeftClose size={14} />
              )}
            </button>
          </Tooltip>
        </div>

        {/* ── Nav ── */}
        <nav
          className="flex-1 overflow-y-auto py-2 space-y-0.5"
          style={{ scrollbarWidth: "thin" }}
        >
          {NAV.map((group, gi) => (
            <div key={gi}>
              {group.section && !isCollapsed && (
                <div className="px-4 pt-4 pb-1 text-[0.56rem] font-semibold tracking-[0.17em] uppercase text-white/40">
                  {group.section}
                </div>
              )}
              {group.section && isCollapsed && <div className="h-2.5" />}
              {group.items.map((item) => (
                <NavLink key={item.path} item={item} collapsed={isCollapsed} />
              ))}
            </div>
          ))}
        </nav>

        {/* ── User ── */}
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2.5">
            <Avatar
              name={initials}
              className="w-8 h-8 text-[0.73rem] font-semibold text-white shrink-0"
              style={
                { background: "rgba(255,255,255,.14)" } as React.CSSProperties
              }
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <div className="text-white text-[0.78rem] font-medium leading-tight">
                  {session?.user.name}
                </div>
                <div className="text-white/40 text-[0.62rem] mt-0.5">
                  {session?.user.role}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
