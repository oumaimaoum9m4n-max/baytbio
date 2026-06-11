"use client";

import Link from "next/link";
import type { StoredOrder } from "@/utils/orders-storage";
import { WHATSAPP_NUMBER } from "./constants";

interface OrderConfirmationProps {
  order: StoredOrder;
}

export default function OrderConfirmation({ order }: OrderConfirmationProps) {
  const waMessage = encodeURIComponent(
    `Bonjour Bayt Bio, j'ai passé la commande #${order.id} pour un total de ${order.total} DH. Merci !`,
  );

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
          Commande reçue
        </p>
        <h1
          className="relative z-10 font-cormorant text-cream font-light leading-[0.92] mb-3"
          style={{ fontSize: "clamp(3rem,6vw,6rem)" }}
        >
          Merci pour votre{" "}
          <em className="italic text-terra-light">commande&nbsp;!</em>
        </h1>
        <p className="relative z-[1] mt-2.5 font-sans text-[0.83rem] font-light text-[rgba(212,200,160,0.5)]">
          Nous vous appellerons dans les prochaines minutes pour confirmer
        </p>
      </header>

      {/* Body */}
      <div className="max-w-[680px] mx-auto px-8 py-16 text-center max-sm:px-4">
        {/* Check circle */}
        <div
          className="relative w-[88px] h-[88px] rounded-full bg-olive flex items-center justify-center mx-auto mb-8"
          style={{
            animation: "confCheck .6s cubic-bezier(.22,.68,0,1.2) both",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span
            className="absolute inset-[-8px] rounded-full border-2 border-[rgba(90,106,56,0.25)]"
            style={{
              animation: "confRing .8s .3s cubic-bezier(.25,.46,.45,.94) both",
            }}
          />
        </div>

        <h2
          className="font-cormorant font-light text-[#1C1208] mb-2"
          style={{
            fontSize: "clamp(2.4rem,5vw,4rem)",
            animation: "fadeUp .7s .2s cubic-bezier(.25,.46,.45,.94) both",
            opacity: 0,
          }}
        >
          Commande <em className="italic text-terra-light">confirmée</em>
        </h2>
        <p
          className="font-[Amiri,serif] text-[1.1rem] text-[#7A6648] opacity-55 mb-7"
          style={{
            animation: "fadeUp .7s .35s cubic-bezier(.25,.46,.45,.94) both",
            opacity: 0,
          }}
        >
          شكراً على طلبكم — سنتصل بكم قريباً
        </p>

        {/* Order card */}
        <div
          className="bg-linen rounded-[3px] border border-[#EBD9B8] px-9 py-8 mb-6 text-left max-sm:px-5"
          style={{
            animation: "fadeUp .7s .5s cubic-bezier(.25,.46,.45,.94) both",
            opacity: 0,
          }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between pb-[18px] border-b border-[#EBD9B8] mb-[18px] flex-wrap gap-2">
            <span className="font-cormorant text-[1.4rem] font-normal text-[#1C1208]">
              Commande #{order.id}
            </span>
            <span className="flex items-center gap-1.5 text-[0.65rem] tracking-[0.12em] uppercase px-3 py-1.5 bg-[#E8EDDE] text-[#5A6A38] rounded-full font-medium">
              <span className="w-[7px] h-[7px] bg-[#5A6A38] rounded-full flex-shrink-0 animate-blink" />
              En préparation
            </span>
          </div>

          {/* Detail rows */}
          <div className="flex flex-col gap-4">
            {/* Items */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[rgba(184,90,40,0.1)]">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#B85A28"
                  strokeWidth="1.6"
                >
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <div className="text-[0.68rem] tracking-[0.1em] uppercase text-[#7A6648] mb-2">
                  Produits commandés
                </div>
                <div className="flex flex-col gap-1.5">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-2.5 text-[0.85rem] text-[#1C1208]"
                    >
                      <span className="w-[5px] h-[5px] bg-[#B85A28] rounded-full flex-shrink-0" />
                      {item.name} × {item.quantity} —{" "}
                      <span className="font-medium">
                        {item.price * item.quantity} DH
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Address */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[rgba(200,144,26,0.1)]">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#b07a10"
                  strokeWidth="1.6"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="text-[0.68rem] tracking-[0.1em] uppercase text-[#7A6648] mb-1">
                  Adresse
                </div>
                <div className="text-[0.9rem] text-[#1C1208] leading-relaxed">
                  {order.fullAddress}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-[rgba(28,18,8,0.06)]">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7A6648"
                  strokeWidth="1.6"
                >
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2.5" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
              </div>
              <div>
                <div className="text-[0.68rem] tracking-[0.1em] uppercase text-[#7A6648] mb-1">
                  Montant à préparer
                </div>
                <div className="text-[0.9rem] text-[#1C1208]">
                  <strong>{order.total} DH</strong>{" "}
                  <span className="text-[#7A6648] font-light">
                    (espèces à la livraison)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact card */}
        <div
          className="bg-olive rounded-[3px] px-9 py-7 flex items-center justify-between gap-5 mb-9 max-sm:flex-col max-sm:text-center max-sm:px-5"
          style={{
            animation: "fadeUp .7s .7s cubic-bezier(.25,.46,.45,.94) both",
            opacity: 0,
          }}
        >
          <div>
            <div className="font-cormorant text-[1.2rem] font-light text-[#F5EDD8] mb-1">
              Des questions ?
            </div>
            <div className="text-[0.78rem] text-[#C8B285] font-light">
              Notre équipe est disponible 7j/7 de 8h à 20h
            </div>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#25D366] text-white rounded-[3px] text-[0.72rem] tracking-[0.1em] uppercase font-sans transition-colors hover:bg-[#1AB854] whitespace-nowrap"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[rgba(255,255,255,0.08)] text-[#F5EDD8] border border-[rgba(255,255,255,0.15)] rounded-[3px] text-[0.72rem] tracking-[0.1em] uppercase font-sans transition-colors hover:bg-[rgba(255,255,255,0.15)] whitespace-nowrap"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" />
              </svg>
              +{WHATSAPP_NUMBER}
            </a>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            animation: "fadeUp .7s .9s cubic-bezier(.25,.46,.45,.94) both",
            opacity: 0,
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-4 max-sm:flex-col">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-9 py-3.5 bg-terracotta text-[#F5EDD8] rounded-[3px] text-[0.76rem] tracking-[0.12em] uppercase font-sans transition-all hover:bg-terra-dark hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(184,90,40,0.3)]"
            >
              Continuer mes achats →
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-9 py-3.5 border-[1.5px] border-[#EBD9B8] text-[#7A6648] rounded-[3px] text-[0.76rem] tracking-[0.12em] uppercase font-sans transition-all hover:border-[#1C1208] hover:text-[#1C1208]"
            >
              Mes commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
