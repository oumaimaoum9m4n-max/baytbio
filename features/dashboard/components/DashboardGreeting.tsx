"use client";

import { Clock, Truck } from "lucide-react";
import { useMemo } from "react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import formatDate from "@/utils/format-date";

type Props = {
  userName: string;
};

const DashboardGreeting = ({ userName }: Props) => {
  const { period } = useDashboardPeriod();
  const { data } = useGetDashboardOverview(period);

  const todayLabel = useMemo(
    () =>
      formatDate(new Date(), {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  const pendingCount = data?.greeting.pendingTodayCount ?? 0;
  const lastUpdatedLabel = data?.greeting.lastUpdatedAt
    ? new Date(data.greeting.lastUpdatedAt).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-[#2D5A3D] text-white shadow-[0_8px_24px_rgba(45,90,61,0.15)]"
      style={{ padding: "28px 32px" }}
    >
      <span
        aria-hidden
        className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5"
      />
      <span
        aria-hidden
        className="absolute right-32 -bottom-20 h-48 w-48 rounded-full bg-white/[0.03]"
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[0.66rem] tracking-[0.18em] font-semibold text-white/65 uppercase">
            Bonjour, {userName} <span className="not-italic">👋</span>
          </p>

          <h2
            className="mt-2 text-[1.85rem] leading-[1.15] font-normal"
            style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
          >
            Vous avez{" "}
            <em className="not-italic text-[#FFD89E]">
              {pendingCount} commande{pendingCount !== 1 ? "s" : ""}
            </em>{" "}
            en attente aujourd&apos;hui
          </h2>

          <p className="mt-2.5 text-[0.78rem] text-white/65 capitalize">
            Dernière mise à jour&nbsp;: à {lastUpdatedLabel} · {todayLabel}
          </p>
        </div>
      </div>
    </section>
  );
};

function InfoChip({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md bg-white/10 border border-white/10 px-3 py-2 text-[0.78rem] text-white/80">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export default DashboardGreeting;
