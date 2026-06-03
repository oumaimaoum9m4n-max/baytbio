"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/ui";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import {
  DASHBOARD_PERIODS,
  type DashboardPeriod,
} from "../types/dashboard.dto";
import formatDate from "@/utils/format-date";

const DashboardSubHeader = () => {
  const { period, setPeriod } = useDashboardPeriod();

  const todayLabel = useMemo(() => {
    const now = new Date();
    const date = formatDate(now, {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    const time = now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date} · ${time}`;
  }, []);

  return (
    <PageHeader
      title="Accueil"
      description={todayLabel}
      breadcrumbs={[{ label: "Dashboard" }]}
      actions={<PeriodFilter period={period} onChange={setPeriod} />}
    />
  );
};

function PeriodFilter({
  period,
  onChange,
}: {
  period: DashboardPeriod;
  onChange: (p: DashboardPeriod) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-md border border-[#E8E4DC] bg-white p-0.5">
      {DASHBOARD_PERIODS.map((p) => {
        const active = p.key === period;
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(p.key)}
            className={`px-3 h-7 rounded-[5px] text-[0.74rem] font-medium transition-colors ${
              active
                ? "bg-[#FAF8F5] text-[#2C2C2C] shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-[#888880] hover:text-[#2C2C2C]"
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

export default DashboardSubHeader;
