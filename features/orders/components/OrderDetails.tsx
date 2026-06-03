"use client";

import { Chip, Divider } from "@heroui/react";
import { Package, Wallet, XCircle } from "lucide-react";
import type { GetSingleOrderDto } from "../types/order.dto";
import { ORDER_STATUS_LABELS } from "../types/order.dto";
import { ORDER_STATUS_STYLE } from "../utils/order.utils";
import formatPrice from "@/utils/format-price";
import formatDate from "@/utils/format-date";

type Props = { order: GetSingleOrderDto };

const OrderDetails = ({ order }: Props) => {
  const status = ORDER_STATUS_STYLE[order.status];

  return (
    <div
      className="flex flex-col gap-5"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      {/* ── Status ── */}
      <section>
        <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
          Statut & Progression
        </p>
        <Chip
          color={status.chipColor}
          variant="flat"
          size="sm"
          startContent={
            <span
              className="w-1.5 h-1.5 rounded-full inline-block ml-1"
              style={{ background: status.dot }}
            />
          }
          classNames={{
            content: "text-[0.7rem] font-semibold px-1.5",
          }}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </Chip>

        {order.status === "cancelled" && (
          <div className="mt-3 flex items-center gap-2.5 bg-[#FAEAE8] rounded-md px-3 py-2.5">
            <XCircle size={16} className="text-[#C44B3C] shrink-0" />
            <span className="text-[0.78rem] text-[#C44B3C] font-semibold">
              Commande annulée
            </span>
          </div>
        )}
      </section>

      {/* ── Items ── */}
      <section>
        <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
          Produits commandés
        </p>
        <div className="flex flex-col gap-1.5">
          {order.items.map((item, i) => (
            <div
              key={`${item.productId}-${i}`}
              className="flex items-center gap-3 p-2.5 bg-[#FAF8F5] rounded-md"
            >
              <div className="w-10 h-10 rounded-md overflow-hidden border border-[#E8E4DC] bg-white flex items-center justify-center shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={16} className="text-[#C8C8C0]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-medium text-[#2C2C2C] truncate">
                  {item.name}
                </p>
                <p className="text-[0.68rem] text-[#888880] font-light">
                  {item.unit ? `${item.unit} × ` : ""}
                  {item.quantity}
                </p>
              </div>
              <p className="text-[0.82rem] font-mono font-semibold text-[#2C2C2C] shrink-0">
                {formatPrice(item.lineTotal)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 bg-[#FAF8F5] rounded-md p-3.5 flex flex-col gap-2">
          <div className="flex justify-between text-[0.76rem]">
            <span className="text-[#888880] font-light">Sous-total</span>
            <span className="text-[#2C2C2C] font-medium font-mono">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex justify-between text-[0.76rem]">
            <span className="text-[#888880] font-light">Articles</span>
            <span className="text-[#2C2C2C] font-medium">
              {order.itemsCount}
            </span>
          </div>
          <Divider className="bg-[#E8E4DC]" />
          <div className="flex justify-between items-baseline">
            <span className="text-[0.7rem] tracking-[0.1em] uppercase text-[#888880] font-semibold">
              Total
            </span>
            <span
              className="text-[1.4rem] font-normal text-[#2C2C2C]"
              style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
            >
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </section>

      {/* ── Client ── */}
      <section>
        <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[#888880] font-semibold pb-1 border-b border-[#E8E4DC] mb-3">
          Informations client
        </p>
        <div className="flex flex-col">
          <DetailRow label="Nom" value={order.fullName} />
          <DetailRow label="Téléphone" value={order.phoneNumber} mono />
          <DetailRow label="Email" value={order.email || "—"} />
          <DetailRow label="Adresse" value={order.fullAddress} />
          <DetailRow
            label="Créée le"
            value={formatDate(order.createdAt, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        </div>
      </section>

      {/* ── Payment ── */}
      <section className="flex items-center gap-3 bg-[#E8F0E8] rounded-md px-3.5 py-3">
        <Wallet size={18} className="text-[#2D5A3D] shrink-0" />
        <div>
          <p className="text-[0.78rem] font-semibold text-[#2D5A3D]">
            Paiement à la livraison
          </p>
          <p className="text-[0.7rem] text-[#3D7A54] font-light">
            Préparer <strong>{formatPrice(order.total)}</strong> en espèces
          </p>
        </div>
      </section>
    </div>
  );
};

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-3 py-2 border-b border-[#E8E4DC] last:border-b-0">
      <span className="text-[0.74rem] text-[#888880] font-normal shrink-0">
        {label}
      </span>
      <span
        className={`text-[0.8rem] text-[#2C2C2C] font-medium text-right break-words max-w-[260px] ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default OrderDetails;
