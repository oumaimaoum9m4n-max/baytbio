"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  ClipboardList,
  PackagePlus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import formatPrice from "@/utils/format-price";

type Action = {
  label: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  href: string;
};

const QuickActions = () => {
  const { period } = useDashboardPeriod();
  const { data } = useGetDashboardOverview(period);

  const todayRevenue =
    data?.recentOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        const today = new Date();
        return (
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear()
        );
      })
      .reduce((sum, o) => sum + o.total, 0) ?? 0;

  const actions: Action[] = [
    {
      label: "Nouvelle commande",
      description: "Saisir manuellement",
      icon: <Plus size={15} className="text-[#2D5A3D]" />,
      iconBg: "#E8F0E8",
      href: "/dashboard/orders",
    },
    {
      label: "Préparer livraisons",
      description: `${data?.ordersStatusToday.find((s) => s.status === "confirmed")?.count ?? 0} en attente`,
      icon: <ShoppingBag size={15} className="text-[#D4883C]" />,
      iconBg: "#FEF0DA",
      href: "/dashboard/orders",
    },
    {
      label: "Ajouter produit",
      description: "Nouvel article",
      icon: <PackagePlus size={15} className="text-[#3A6B9E]" />,
      iconBg: "#E8F0F8",
      href: "/dashboard/products/add-product",
    },
    {
      label: "Voir analytiques",
      description: "Statistiques détaillées",
      icon: <BarChart3 size={15} className="text-[#8C6A19]" />,
      iconBg: "#F4ECD7",
      href: "/dashboard",
    },
    {
      label: "Gérer commandes",
      description: "Liste complète",
      icon: <ClipboardList size={15} className="text-[#7CA982]" />,
      iconBg: "#EAF2EA",
      href: "/dashboard/orders",
    },
    {
      label: "Alertes stock",
      description: `${data?.secondaryStats.lowStockCount ?? 0} produits`,
      icon: <Bell size={15} className="text-[#C44B3C]" />,
      iconBg: "#FAEAE8",
      href: "/dashboard/products",
    },
  ];

  return (
    <section className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col h-full">
      <header className="px-5 py-4 border-b border-[#F0EDE5]">
        <h3 className="text-[0.95rem] font-semibold text-[#2C2C2C]">
          Actions rapides
        </h3>
        <p className="text-[0.72rem] text-[#888880] mt-0.5">
          Raccourcis du tableau de bord
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2 px-5 py-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col gap-2 p-3 rounded-lg border border-[#F0EDE5] bg-[#FAF8F5] hover:bg-white hover:border-[#E8E4DC] hover:shadow-sm transition-all"
          >
            <span
              className="h-8 w-8 rounded-md flex items-center justify-center"
              style={{ background: action.iconBg }}
            >
              {action.icon}
            </span>
            <div>
              <p className="text-[0.78rem] font-semibold text-[#2C2C2C]">
                {action.label}
              </p>
              <p className="text-[0.66rem] text-[#888880] mt-0.5">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-auto mx-5 mb-5 px-3 py-3 rounded-lg bg-[#E8F0E8] border border-[#B7D2BC] flex items-center gap-3">
        <span className="h-9 w-9 rounded-md bg-white/70 flex items-center justify-center">
          <BarChart3 size={15} className="text-[#2D5A3D]" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[0.6rem] tracking-[0.08em] uppercase text-[#1F4A2D]/70 font-semibold">
            Revenus aujourd&apos;hui
          </p>
          <p
            className="text-[1.1rem] leading-none text-[#1F4A2D] font-normal mt-0.5"
            style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
          >
            {formatPrice(todayRevenue)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
