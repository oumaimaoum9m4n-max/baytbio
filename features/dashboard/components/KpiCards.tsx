"use client";

import { ArrowDownRight, ArrowUpRight, ClipboardList, ShoppingCart, Users, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import { DASHBOARD_PERIODS, type KpiWithDelta } from "../types/dashboard.dto";
import formatPrice from "@/utils/format-price";

type KpiCardConfig = {
  key: keyof NonNullable<
    ReturnType<typeof useGetDashboardOverview>["data"]
  >["kpis"];
  label: string;
  accent: string;
  iconBg: string;
  icon: ReactNode;
  format: (value: number) => string;
};

const KpiCards = () => {
  const { period } = useDashboardPeriod();
  const { data, isLoading } = useGetDashboardOverview(period);

  const periodLabel =
    DASHBOARD_PERIODS.find((p) => p.key === period)?.label.toLowerCase() ??
    "période";
  const comparisonText =
    period === "all" ? "depuis le début" : `vs ${periodLabel} précédents`;

  const cards: KpiCardConfig[] = [
    {
      key: "revenue",
      label: "Chiffre d'affaires",
      accent: "#2D5A3D",
      iconBg: "#E8F0E8",
      icon: <Wallet size={15} className="text-[#2D5A3D]" />,
      format: (v) => formatPrice(v),
    },
    {
      key: "ordersCount",
      label: "Commandes totales",
      accent: "#D4883C",
      iconBg: "#FEF0DA",
      icon: <ClipboardList size={15} className="text-[#D4883C]" />,
      format: (v) => v.toLocaleString("fr-FR"),
    },
    {
      key: "averageBasket",
      label: "Panier moyen",
      accent: "#8C6A19",
      iconBg: "#F4ECD7",
      icon: <ShoppingCart size={15} className="text-[#8C6A19]" />,
      format: (v) => formatPrice(v),
    },
    {
      key: "activeCustomers",
      label: "Clients actifs",
      accent: "#3A6B9E",
      iconBg: "#E8F0F8",
      icon: <Users size={15} className="text-[#3A6B9E]" />,
      format: (v) => v.toLocaleString("fr-FR"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <KpiCard
          key={c.key}
          config={c}
          kpi={data?.kpis[c.key]}
          isLoading={isLoading}
          comparisonText={comparisonText}
        />
      ))}
    </div>
  );
};

function KpiCard({
  config,
  kpi,
  isLoading,
  comparisonText,
}: {
  config: KpiCardConfig;
  kpi: KpiWithDelta | undefined;
  isLoading: boolean;
  comparisonText: string;
}) {
  const value = kpi?.value ?? 0;
  const delta = kpi?.deltaPercent ?? 0;
  const positive = delta >= 0;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white border border-[#E8E4DC] shadow-sm p-5">
      <span
        className="absolute left-0 right-0 top-0 h-[3px]"
        style={{ background: config.accent }}
      />

      <div className="flex items-start justify-between mb-3">
        <p className="text-[0.61rem] tracking-[0.1em] uppercase text-[#888880] font-semibold">
          {config.label}
        </p>
        <div
          className="h-8 w-8 rounded-md flex items-center justify-center"
          style={{ background: config.iconBg }}
        >
          {config.icon}
        </div>
      </div>

      <p
        className="text-[2rem] leading-none text-[#2C2C2C] font-normal mb-3"
        style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
      >
        {isLoading ? "—" : config.format(value)}
      </p>

      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.66rem] font-semibold"
          style={{
            background: positive ? "#E8F0E8" : "#FAEAE8",
            color: positive ? "#2D5A3D" : "#C44B3C",
          }}
        >
          {positive ? (
            <ArrowUpRight size={11} />
          ) : (
            <ArrowDownRight size={11} />
          )}
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-[0.68rem] text-[#888880]">{comparisonText}</span>
      </div>
    </div>
  );
}

export default KpiCards;
