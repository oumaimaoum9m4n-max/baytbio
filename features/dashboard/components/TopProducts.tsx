"use client";

import { useMemo } from "react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import formatPrice from "@/utils/format-price";

const COLORS = ["#2D5A3D", "#D4883C", "#8C6A19", "#3A6B9E", "#7CA982"];

const TopProducts = () => {
  const { period } = useDashboardPeriod();
  const { data, isLoading } = useGetDashboardOverview(period);
  const items = data?.topProducts ?? [];

  const maxRevenue = useMemo(
    () => Math.max(1, ...items.map((i) => i.revenue)),
    [items],
  );

  return (
    <section className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col h-full">
      <header className="px-5 py-4 border-b border-[#F0EDE5]">
        <h3 className="text-[0.95rem] font-semibold text-[#2C2C2C]">
          Performance produits
        </h3>
        <p className="text-[0.72rem] text-[#888880] mt-0.5">
          Unités vendues sur la période
        </p>
      </header>

      <ul className="flex-1 flex flex-col divide-y divide-[#F4F1EA]">
        {isLoading ? (
          <li className="flex items-center justify-center py-10 text-[#888880] text-[0.78rem]">
            Chargement…
          </li>
        ) : items.length === 0 ? (
          <li className="flex items-center justify-center py-10 text-[#888880] text-[0.78rem]">
            Aucune vente sur cette période.
          </li>
        ) : (
          items.map((it, i) => {
            const color = COLORS[i % COLORS.length];
            const width = (it.revenue / maxRevenue) * 100;
            return (
              <li
                key={it.productId}
                className="grid grid-cols-[26px_1fr_auto] items-center gap-3 px-5 py-3"
              >
                <span className="text-[0.68rem] font-mono text-[#888880] font-semibold">
                  #{i + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-3.5 w-[3px] rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <p className="text-[0.82rem] font-medium text-[#2C2C2C] truncate">
                      {it.name}
                    </p>
                  </div>
                  <p className="text-[0.66rem] text-[#888880] mt-0.5 ml-3.5">
                    {it.unitsSold.toLocaleString("fr-FR")} unités vendues
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[0.81rem] font-semibold text-[#2C2C2C]">
                    {formatPrice(it.revenue)}
                  </p>
                  <div className="mt-1.5 h-[3px] w-[80px] rounded-full bg-[#F2EFE8] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${width}%`, background: color }}
                    />
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
};

export default TopProducts;
