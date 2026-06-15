"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import { UserCircle, Settings, LogOut, Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { SidebarContext } from "@/components/sidebar-context";

/* ══════════════════════════════════════════
   BREADCRUMB HELPERS
══════════════════════════════════════════ */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Produits",
  orders: "Commandes",
  deliveries: "Livraisons",
  clients: "Clients",
  revenue: "Revenus",
  analytics: "Analytiques",
  settings: "Paramètres",
  "add-product": "Ajouter",
  "update-product": "Modifier",
  help: "Aide",
  support: "Support",
};

function useNavBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments
    .filter((seg) => !/^[0-9a-f-]{8,}$/.test(seg)) // strip UUIDs
    .map((seg, i, arr) => ({
      label: SEGMENT_LABELS[seg] ?? seg,
      isLast: i === arr.length - 1,
    }));
}

/* ══════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════ */
function DashboardNavbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const breadcrumbs = useNavBreadcrumbs();

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "";

  return (
    <header className="h-[60px] bg-white border-b border-[#E8E4DC] px-4 md:px-7 flex items-center justify-between sticky top-0 z-[100]">
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        <button
          className="md:hidden p-1.5 rounded-md text-[#555550] hover:bg-[#F5F2EC] hover:text-[#2C2C2C] transition-colors"
          onClick={onMenuToggle}
          aria-label="Ouvrir le menu"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[0.77rem] text-[#888880]">
          {breadcrumbs.map((seg, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-[#C8C8C0]">/</span>}
              <span
                className={
                  seg.isLast
                    ? "text-[#2C2C2C] font-medium"
                    : "hover:text-[#2D5A3D] transition-colors cursor-pointer"
                }
              >
                {seg.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Avatar dropdown */}
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            name={initials}
            size="sm"
            className="bg-[#2D5A3D] text-white text-[0.71rem] font-semibold cursor-pointer"
          />
        </DropdownTrigger>
        <DropdownMenu
          aria-label="User menu"
          classNames={{ base: "min-w-[180px] p-1.5", list: "gap-0.5" }}
          itemClasses={{
            base: "rounded-md px-2.5 py-2 text-[0.8rem] data-[hover=true]:bg-[#FAF8F5]",
            title: "text-[0.8rem]",
          }}
        >
          <DropdownSection showDivider>
            <DropdownItem
              key="profile"
              startContent={<UserCircle size={14} className="text-[#555550]" />}
              className="text-[#555550]"
              onPress={() => router.push("/dashboard/settings")}
            >
              {session?.user?.name ?? "Profil"}
            </DropdownItem>
            
          </DropdownSection>
          <DropdownSection>
            <DropdownItem
              key="logout"
              startContent={<LogOut size={14} />}
              className="text-danger"
              color="danger"
              onPress={() => signOut({ callbackUrl: "/admin-login" })}
            >
              Se déconnecter
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </header>
  );
}

/* ══════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════ */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      <div className="min-h-screen bg-[#FAF8F5]">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed((v) => !v)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div
          className={`flex flex-col transition-[margin] duration-300 ease-[cubic-bezier(.25,.46,.45,.94)] ${
            isCollapsed ? "md:ml-16" : "md:ml-60"
          }`}
        >
          <DashboardNavbar onMenuToggle={() => setMobileOpen((v) => !v)} />

          <main
            className="relative flex-1 px-4 md:px-7 pb-6"
            style={{ minHeight: "calc(100vh - 60px)" }}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
