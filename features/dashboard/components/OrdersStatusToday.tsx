"use client";

import { CheckCircle2, Clock, Home, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import { STATUS_COLOR_MAP } from "../utils/dashboard.utils";
import type { OrderStatus } from "@/features/orders/types/order";
import formatDate from "@/utils/format-date";

const ICONS: Record<OrderStatus, ReactNode> = {
  pending: <Clock size={14} />,
  confirmed: <CheckCircle2 size={14} />,
  delivered: <Home size={14} />,
  cancelled: <XCircle size={14} />,
};

const SUBLABELS: Record<OrderStatus, string> = {
  pending: "À confirmer",
  confirmed: "Prêtes à partir",
  delivered: "Livrées aujourd'hui",
  cancelled: "Annulées aujourd'hui",
};

const OrdersStatusToday = () => {
  const { period } = useDashboardPeriod();
  const { data } = useGetDashboardOverview(period);

  const items = data?.ordersStatusToday ?? [];
  const total = items.reduce((sum, it) => sum + it.count, 0);

  const todayLabel = formatDate(new Date(), {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <section className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col h-full">
      <header className="px-5 py-4 border-b border-[#F0EDE5]">
        <h3 className="text-[0.95rem] font-semibold text-[#2C2C2C]">
          Statut des commandes aujourd&apos;hui
        </h3>
        <p className="text-[0.72rem] text-[#888880] mt-0.5 capitalize">
          {todayLabel} · {total} total
        </p>
      </header>

      <ul className="flex flex-col gap-2.5 px-5 py-4">
        {items.map((item) => {
          const color = STATUS_COLOR_MAP[item.status];
          return (
            <li
              key={item.status}
              className="flex items-center gap-3 rounded-lg border px-3 py-2.5"
              style={{ background: color.bg, borderColor: color.border }}
            >
              <span
                className="h-9 w-9 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.6)", color: color.text }}
              >
                {ICONS[item.status]}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[0.82rem] font-semibold"
                  style={{ color: color.text }}
                >
                  {color.label}
                </p>
                <p className="text-[0.66rem]" style={{ color: color.text, opacity: 0.7 }}>
                  {SUBLABELS[item.status]}
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[1.4rem] leading-none font-normal"
                  style={{
                    fontFamily: "Instrument Serif, Georgia, serif",
                    color: color.text,
                  }}
                >
                  {item.count}
                </span>
                <span className="text-[0.62rem] uppercase tracking-wider" style={{ color: color.text, opacity: 0.7 }}>
                  cmd
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default OrdersStatusToday;
