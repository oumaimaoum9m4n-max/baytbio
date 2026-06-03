"use client";

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { Chip } from "@heroui/react";
import { useDashboardPeriod } from "./DashboardPeriodContext";
import { useGetDashboardOverview } from "../apis/getDashboardOverview";
import {
  ORDER_STATUS_LABELS,
  type GetAllOrdersDto,
} from "@/features/orders/types/order.dto";
import { ORDER_STATUS_STYLE } from "@/features/orders/utils/order.utils";
import formatPrice from "@/utils/format-price";

const RecentOrders = () => {
  const { period } = useDashboardPeriod();
  const { data, isLoading } = useGetDashboardOverview(period);

  const rows = data?.recentOrders ?? [];

  return (
    <section className="rounded-xl bg-white border border-[#E8E4DC] shadow-sm flex flex-col h-full">
      <header className="flex items-center justify-between px-5 py-4 border-b border-[#F0EDE5]">
        <div>
          <h3 className="text-[0.95rem] font-semibold text-[#2C2C2C]">
            Commandes récentes
          </h3>
          <p className="text-[0.72rem] text-[#888880] mt-0.5">
            {data?.kpis.ordersCount.value ?? 0} commandes sur la période
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="text-[0.78rem] text-[#2D5A3D] font-medium hover:underline inline-flex items-center gap-1"
        >
          Voir tout <ArrowRight size={12} />
        </Link>
      </header>

      <div className="flex-1 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-[#888880] text-[0.78rem]">
            Chargement…
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-[#888880]">
            <Inbox size={22} />
            <p className="text-[0.78rem]">Aucune commande sur cette période.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAF8F5] text-left text-[0.6rem] tracking-[0.08em] uppercase text-[#888880] font-semibold">
                <th className="px-5 py-2.5">N° commande</th>
                <th className="py-2.5">Client</th>
                <th className="py-2.5">Produits</th>
                <th className="py-2.5">Montant</th>
                <th className="px-5 py-2.5">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <RecentRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

function RecentRow({ row }: { row: GetAllOrdersDto }) {
  const style = ORDER_STATUS_STYLE[row.status];
  const summary =
    row.items
      .map((it) => `${it.name?.split(" ")[0] ?? "—"} ×${it.quantity}`)
      .join(", ") || "—";

  return (
    <tr className="border-b border-[#F4F1EA] last:border-b-0 text-[0.78rem]">
      <td className="px-5 py-3 font-mono text-[0.72rem] text-[#2D5A3D] font-medium whitespace-nowrap">
        {row.id}
      </td>
      <td className="py-3">
        <p className="text-[0.82rem] font-medium text-[#2C2C2C]">
          {row.fullName}
        </p>
        <p className="text-[0.66rem] text-[#888880] mt-0.5">
          {row.phoneNumber}
        </p>
      </td>
      <td className="py-3 max-w-[220px]">
        <p
          className="truncate text-[0.72rem] text-[#555550] font-light"
          title={summary}
        >
          {summary}
        </p>
      </td>
      <td className="py-3 font-mono font-semibold text-[0.78rem] text-[#2C2C2C] whitespace-nowrap">
        {formatPrice(row.total)}
      </td>
      <td className="px-5 py-3">
        <Chip
          color={style.chipColor}
          variant="flat"
          size="sm"
          startContent={
            <span
              className="w-1.5 h-1.5 rounded-full inline-block ml-1"
              style={{ background: style.dot }}
            />
          }
          classNames={{
            content: "text-[0.64rem] font-semibold px-1.5",
          }}
        >
          {ORDER_STATUS_LABELS[row.status]}
        </Chip>
      </td>
    </tr>
  );
}

export default RecentOrders;
