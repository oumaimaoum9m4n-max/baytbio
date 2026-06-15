"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/utils/orders-storage";
import type { StoredOrder } from "@/utils/orders-storage";

const STATUS_LABELS: Record<StoredOrder["status"], string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const STATUS_STYLES: Record<StoredOrder["status"], { bg: string; text: string; dot: string }> = {
  pending:   { bg: "bg-[#FEF9EC]",  text: "text-[#C9960C]", dot: "bg-[#C9960C]" },
  confirmed: { bg: "bg-[#EBF2FB]",  text: "text-[#3A6B9E]", dot: "bg-[#3A6B9E]" },
  delivered: { bg: "bg-[#E8EDDE]",  text: "text-[#5A6A38]", dot: "bg-[#5A6A38]" },
  cancelled: { bg: "bg-[#FDECEA]",  text: "text-[#C44B3C]", dot: "bg-[#C44B3C]" },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-MA", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function OrdersPageClient() {
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrders(getOrders());
    setLoaded(true);
  }, []);

  return (
    <div className="pt-[80px] min-h-screen animate-fade-slide">
      {/* Page header */}
      <header className="relative overflow-hidden bg-olive px-[72px] pb-12 pt-[52px] max-md:px-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 92% 50%, rgba(200,178,100,0.11), transparent)",
          }}
          aria-hidden
        />
        <p className="relative z-[1] mb-[14px] flex items-center gap-3 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-[rgba(212,200,160,0.45)] before:h-px before:w-6 before:shrink-0 before:bg-[rgba(212,200,160,0.25)] before:content-['']">
          Bayt Bio · Historique
        </p>
        <h1
          className="relative z-10 font-cormorant text-cream font-light leading-[0.92] mb-8"
          style={{ fontSize: "clamp(3.8rem,7vw,8rem)" }}
        >
          Mes <em className="italic text-terra-light">commandes</em>
        </h1>
        <p className="relative z-[1] mt-2.5 font-sans text-[0.83rem] font-light text-[rgba(212,200,160,0.5)]">
          طلباتي — Historique de vos commandes
        </p>
      </header>

      {/* Content */}
      <div className="max-w-[860px] mx-auto px-8 py-14 max-sm:px-4">
        {!loaded ? null : orders.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center text-center gap-5 py-20">
            <div className="text-[#A89070] opacity-35">
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h2 className="font-cormorant text-[2.2rem] font-light text-[#1C1208]">
              Aucune commande
            </h2>
            <p className="text-[0.88rem] text-[#7A6648] font-light max-w-[340px] leading-[1.75]">
              Vous n'avez pas encore passé de commande. Découvrez nos produits
              fermiers frais.
            </p>
            <Link
              href="/products"
              className="mt-3 px-8 py-3.5 bg-[#B85A28] text-[#F5EDD8] rounded-[3px] text-[0.75rem] tracking-[0.12em] uppercase font-sans transition-all hover:bg-[#D4724A] hover:-translate-y-0.5"
            >
              Voir nos produits →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => {
              const s = STATUS_STYLES[order.status];
              const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="bg-linen border border-olive-light rounded-[3px] overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between px-7 py-5 border-b border-[#EBD9B8] flex-wrap gap-3 max-sm:px-4">
                    <div className="flex items-center gap-4">
                      <span className="font-cormorant text-[1.3rem] font-normal text-[#1C1208]">
                        #{order.id}
                      </span>
                      <span
                        className={`flex items-center gap-1.5 text-[0.63rem] tracking-[0.12em] uppercase px-3 py-1.5 rounded-full font-medium ${s.bg} ${s.text}`}
                      >
                        <span className={`w-[6px] h-[6px] rounded-full flex-shrink-0 ${s.dot}`} />
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <span className="text-[0.75rem] text-brown font-light">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="px-7 py-5 max-sm:px-4 grid grid-cols-[1fr_auto] gap-6 items-start max-sm:grid-cols-1">
                    {/* Items list */}
                    <div>
                      <div className="text-[0.65rem] tracking-[0.14em] uppercase text-[#A89070] mb-3">
                        {itemCount} article{itemCount > 1 ? "s" : ""}
                      </div>
                      <div className="flex flex-col gap-2">
                        {order.items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex items-center gap-2.5 text-[0.83rem] text-[#1C1208]"
                          >
                            <span className="w-[5px] h-[5px] bg-[#B85A28] rounded-full flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                            <span className="text-[#A89070]">
                              × {item.quantity}
                            </span>
                            <span className="ml-auto text-[#7A6648] font-light">
                              {item.price * item.quantity} DH
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#EBD9B8] flex flex-col gap-1">
                        <div className="text-[0.7rem] text-[#A89070] font-light">
                          <span className="text-[#7A6648]">Livraison :</span>{" "}
                          {order.fullAddress}
                        </div>
                      </div>
                    </div>

                    {/* Totals */}
                    <div className="text-right min-w-[130px] max-sm:text-left max-sm:border-t max-sm:border-[#EBD9B8] max-sm:pt-4">
                      <div className="text-[0.65rem] tracking-[0.14em] uppercase text-[#A89070] mb-1">
                        Total
                      </div>
                      <div className="font-cormorant text-[2rem] font-normal text-[#1C1208] leading-none">
                        {order.total}{" "}
                        <span className="font-sans text-[0.78rem] font-light text-[#A89070]">
                          DH
                        </span>
                      </div>
                      <div className="text-[0.68rem] text-[#A89070] font-light mt-1">
                        dont {order.deliveryFee} DH livraison
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="text-center pt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#B85A28] text-[#F5EDD8] rounded-[3px] text-[0.75rem] tracking-[0.12em] uppercase font-sans transition-all hover:bg-[#D4724A] hover:-translate-y-0.5"
              >
                Continuer mes achats →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
