"use client";

import { AlertTriangle, PackageCheck, Truck, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";

type StatConfig = {
  label: string;
  value: string;
  rawPercent: number;
  badgeText: string;
  badgeColor: string;
  badgeBg: string;
  barColor: string;
  icon: ReactNode;
};

const SecondaryStats = () => {
  const { period } = useDashboardPeriod();
  const { data, isLoading } = useGetDashboardOverview(period);

  const stats = data?.secondaryStats;

  const lowStockPct =
    stats && stats.totalProducts > 0
      ? (stats.lowStockCount / stats.totalProducts) * 100
      : 0;
  const activeProductsPct =
    stats && stats.totalProducts > 0
      ? (stats.activeProducts / stats.totalProducts) * 100
      : 0;

  const cards: StatConfig[] = [
    {
      label: "Taux de livraison",
      value: `${(stats?.deliveryRate ?? 0).toFixed(1)} %`,
      rawPercent: stats?.deliveryRate ?? 0,
      badgeText: `${(stats?.deliveryRate ?? 0).toFixed(1)}%`,
      badgeColor: "#2D5A3D",
      badgeBg: "#E8F0E8",
      barColor: "#2D5A3D",
      icon: <Truck size={13} className="text-[#2D5A3D]" />,
    },
    {
      label: "Taux d'annulation",
      value: `${(stats?.cancellationRate ?? 0).toFixed(1)} %`,
      rawPercent: stats?.cancellationRate ?? 0,
      badgeText: `${(stats?.cancellationRate ?? 0).toFixed(1)}%`,
      badgeColor: "#C44B3C",
      badgeBg: "#FAEAE8",
      barColor: "#C44B3C",
      icon: <XCircle size={13} className="text-[#C44B3C]" />,
    },
    {
      label: "Produits actifs",
      value: String(stats?.activeProducts ?? 0),
      rawPercent: activeProductsPct,
      badgeText: `${stats?.totalProducts ?? 0} au total`,
      badgeColor: "#3A6B9E",
      badgeBg: "#E8F0F8",
      barColor: "#3A6B9E",
      icon: <PackageCheck size={13} className="text-[#3A6B9E]" />,
    },
    {
      label: "Stock critique",
      value: String(stats?.lowStockCount ?? 0),
      rawPercent: lowStockPct,
      badgeText:
        (stats?.lowStockCount ?? 0) > 0 ? "à traiter" : "tout est OK",
      badgeColor: "#D4883C",
      badgeBg: "#FEF0DA",
      barColor: "#D4883C",
      icon: <AlertTriangle size={13} className="text-[#D4883C]" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-[0.61rem] tracking-[0.1em] uppercase text-[#888880] font-semibold flex items-center gap-1.5">
              {c.icon}
              {c.label}
            </p>
            <span
              className="text-[0.62rem] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: c.badgeBg, color: c.badgeColor }}
            >
              {c.badgeText}
            </span>
          </div>

          <p
            className="text-[1.6rem] leading-none text-[#2C2C2C] font-normal"
            style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
          >
            {isLoading ? "—" : c.value}
          </p>

          <div className="h-1.5 rounded-full bg-[#F2EFE8] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, c.rawPercent))}%`,
                background: c.barColor,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecondaryStats;
