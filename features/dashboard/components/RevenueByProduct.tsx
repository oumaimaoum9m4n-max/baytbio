"use client";

import { useMemo } from "react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import formatPrice from "@/utils/format-price";

const COLORS = ["#2D5A3D", "#D4883C", "#8C6A19", "#3A6B9E", "#7CA982"];

const RevenueByProduct = () => {
  const { period } = useDashboardPeriod();
  const { data, isLoading } = useGetDashboardOverview(period);
  const items = data?.revenueByProduct ?? [];

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.total, 0),
    [items],
  );

  return (
    <section className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm p-5 flex flex-col gap-4 h-full">
      <header>
        <h3 className="text-[0.95rem] font-semibold text-[#2C2C2C]">
          Revenus par produit
        </h3>
        <p className="text-[0.72rem] text-[#888880] mt-0.5">
          Période sélectionnée · part en %
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-[#888880] text-[0.78rem]">
          Chargement…
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-[#888880] text-[0.78rem] text-center px-4">
          Pas encore de revenus pour cette période.
        </div>
      ) : (
        <>
          <div className="flex justify-center py-2">
            <Donut items={items} total={total} />
          </div>

          <ul className="flex flex-col gap-2">
            {items.map((it, i) => (
              <li
                key={it.productId}
                className="grid grid-cols-[10px_1fr_auto] items-center gap-2 text-[0.78rem]"
              >
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <div className="min-w-0 flex items-center gap-2">
                  <span className="truncate text-[#2C2C2C]">{it.name}</span>
                  <span
                    className="flex-1 h-[3px] rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${COLORS[i % COLORS.length]} ${it.percentage}%, #F2EFE8 ${it.percentage}%)`,
                    }}
                  />
                </div>
                <span className="text-[#555550] font-semibold tabular-nums">
                  {it.percentage.toFixed(0)}%
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

function Donut({
  items,
  total,
}: {
  items: { productId: string; total: number; percentage: number }[];
  total: number;
}) {
  const size = 156;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F2EFE8"
        strokeWidth={stroke}
      />
      {items.map((it, i) => {
        const length = (it.percentage / 100) * circumference;
        const segment = (
          <circle
            key={it.productId}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={stroke}
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        );
        offset += length;
        return segment;
      })}
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[#2C2C2C]"
        style={{
          fontFamily: "Instrument Serif, Georgia, serif",
          fontSize: 22,
        }}
      >
        {formatPrice(total, false)}
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-[#888880]"
        style={{ fontSize: 9, letterSpacing: 1.2 }}
      >
        TOTAL DH
      </text>
    </svg>
  );
}

export default RevenueByProduct;
