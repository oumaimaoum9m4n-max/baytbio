"use client";

import Link from "next/link";
import { ArrowRight, PackageCheck } from "lucide-react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import { STOCK_SEVERITY_STYLE } from "../utils/dashboard.utils";

const StockAlerts = () => {
  const { period } = useDashboardPeriod();
  const { data, isLoading } = useGetDashboardOverview(period);
  const alerts = data?.stockAlerts ?? [];

  return (
    <section className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col h-full">
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE5]">
        <div>
          <h3 className="text-[0.95rem] font-semibold text-[#2C2C2C]">
            Alertes stock
          </h3>
          <p className="text-[0.72rem] text-[#888880] mt-0.5">
            Produits sous le seuil d&apos;alerte
          </p>
        </div>
        <Link
          href="/dashboard/products"
          className="text-[0.78rem] text-[#2D5A3D] font-medium hover:underline inline-flex items-center gap-1"
        >
          Gérer <ArrowRight size={12} />
        </Link>
      </header>

      <ul className="flex flex-col gap-2 px-5 py-4">
        {isLoading ? (
          <li className="text-center text-[#888880] text-[0.78rem] py-6">
            Chargement…
          </li>
        ) : alerts.length === 0 ? (
          <li className="flex flex-col items-center justify-center gap-2 py-6 text-[#888880]">
            <PackageCheck size={22} className="text-[#2D5A3D]" />
            <p className="text-[0.78rem]">Tous les stocks sont à niveau.</p>
          </li>
        ) : (
          alerts.map((alert) => {
            const style = STOCK_SEVERITY_STYLE[alert.severity];
            return (
              <li
                key={alert.productId}
                className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
                style={{ background: style.bg, borderColor: style.border }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[0.82rem] font-semibold text-[#2C2C2C] truncate">
                    {alert.name}
                  </p>
                  <p className="text-[0.66rem] text-[#555550] mt-0.5">
                    Seuil&nbsp;: {alert.alertThreshold} {alert.unit}
                  </p>
                </div>
                <span className="font-mono text-[0.85rem] font-semibold text-[#2C2C2C] whitespace-nowrap">
                  {alert.stock} {alert.unit}
                </span>
                <span
                  className="text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                  style={{ background: style.pillBg, color: style.pillText }}
                >
                  {style.label}
                </span>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
};

export default StockAlerts;
