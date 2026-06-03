"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import formatPrice from "@/utils/format-price";

type Mode = "revenue" | "orders";

const RevenueEvolution = () => {
  const { period } = useDashboardPeriod();
  const { data, isLoading } = useGetDashboardOverview(period);
  const [mode, setMode] = useState<Mode>("revenue");

  const points = data?.revenueEvolution ?? [];

  const totals = useMemo(() => {
    const current = points.reduce((sum, p) => sum + p.current, 0);
    const previous = points.reduce((sum, p) => sum + p.previous, 0);
    const delta =
      previous === 0
        ? current > 0
          ? 100
          : 0
        : ((current - previous) / previous) * 100;
    return { current, previous, delta };
  }, [points]);

  const maxValue = useMemo(
    () =>
      Math.max(
        1,
        ...points.flatMap((p) => [p.current, p.previous]),
      ),
    [points],
  );

  const periodSubtitle =
    period === "all"
      ? "Toute la période"
      : period === "1y"
        ? "365 derniers jours"
        : `${points.length} derniers jours`;

  return (
    <section className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm p-5 flex flex-col gap-5 h-full">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[0.95rem] font-semibold text-[#2C2C2C]">
            Évolution du chiffre d&apos;affaires
          </h3>
          <p className="text-[0.72rem] text-[#888880] mt-0.5">
            {periodSubtitle} · en Dirhams (DH)
          </p>
        </div>

        <div className="inline-flex items-center gap-0.5 rounded-md border border-[#E8E4DC] bg-[#FAF8F5] p-0.5">
          {(
            [
              { key: "revenue", label: "Revenus" },
              { key: "orders", label: "Commandes" },
            ] as { key: Mode; label: string }[]
          ).map((m) => {
            const active = m.key === mode;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`px-3 h-7 rounded-[5px] text-[0.74rem] font-medium transition-colors ${
                  active
                    ? "bg-white text-[#2C2C2C] shadow-sm"
                    : "text-[#888880] hover:text-[#2C2C2C]"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 text-[#888880] text-[0.78rem]">
          Chargement…
        </div>
      ) : points.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-[#888880] text-[0.78rem]">
          Aucune donnée disponible sur cette période.
        </div>
      ) : (
        <Chart points={points} maxValue={maxValue} mode={mode} />
      )}

      <footer className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-4 text-[0.7rem] text-[#888880]">
          <LegendDot color="#2D5A3D" label="Période actuelle" />
          <LegendDot color="#D4C2A0" label="Période précédente" />
        </div>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.66rem] font-semibold"
          style={{
            background: totals.delta >= 0 ? "#E8F0E8" : "#FAEAE8",
            color: totals.delta >= 0 ? "#2D5A3D" : "#C44B3C",
          }}
        >
          {totals.delta >= 0 ? (
            <ArrowUpRight size={11} />
          ) : (
            <ArrowDownRight size={11} />
          )}
          {Math.abs(totals.delta).toFixed(1)}% vs période précédente
        </span>
      </footer>
    </section>
  );
};

function Chart({
  points,
  maxValue,
  mode,
}: {
  points: { date: string; current: number; previous: number }[];
  maxValue: number;
  mode: Mode;
}) {
  const xLabels = useMemo(() => {
    if (points.length <= 7) return points.map((_, i) => i + 1);
    const indices = [
      0,
      Math.floor(points.length * 0.25),
      Math.floor(points.length * 0.5),
      Math.floor(points.length * 0.75),
      points.length - 1,
    ];
    return points.map((_, i) => (indices.includes(i) ? i + 1 : ""));
  }, [points]);

  const yTicks = useMemo(() => {
    const top = Math.ceil(maxValue / 1000) * 1000 || 1000;
    return [top, top * 0.75, top * 0.5, top * 0.25];
  }, [maxValue]);

  return (
    <div className="flex gap-3 h-44">
      <div className="flex flex-col justify-between text-[0.6rem] text-[#888880] py-1 pr-1">
        {yTicks.map((t) => (
          <span key={t}>
            {mode === "revenue"
              ? `${(t / 1000).toFixed(1)}k`
              : Math.round(t / 100).toString()}
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="relative flex-1 flex items-end gap-1">
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <span
              key={p}
              className="absolute left-0 right-0 border-t border-dashed border-[#F0EDE5]"
              style={{ bottom: `${p * 100}%` }}
            />
          ))}

          {points.map((pt, i) => {
            const curH = (pt.current / maxValue) * 100;
            const prevH = (pt.previous / maxValue) * 100;
            return (
              <div
                key={pt.date}
                className="relative flex-1 flex items-end gap-[2px] group"
                title={`${pt.date}\nActuel: ${formatPrice(pt.current)}\nPrécédent: ${formatPrice(pt.previous)}`}
              >
                <div
                  className="flex-1 rounded-t-sm bg-[#D4C2A0] transition-all"
                  style={{ height: `${Math.max(2, prevH)}%`, minHeight: 2 }}
                />
                <div
                  className="flex-1 rounded-t-sm bg-[#2D5A3D] transition-all group-hover:bg-[#1F4A2D]"
                  style={{ height: `${Math.max(2, curH)}%`, minHeight: 2 }}
                />
                <span className="sr-only">{`Jour ${i + 1}`}</span>
              </div>
            );
          })}
        </div>

        <div className="flex pt-2 text-[0.6rem] text-[#888880]">
          {xLabels.map((label, i) => (
            <span key={i} className="flex-1 text-center">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-2 w-2 rounded-sm"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

export default RevenueEvolution;
