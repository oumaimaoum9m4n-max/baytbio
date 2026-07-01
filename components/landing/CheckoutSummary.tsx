"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/components/shared/CartContext";

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export default function CheckoutSummary({ items, subtotal, deliveryFee, total }: CheckoutSummaryProps) {
  const router = useRouter();

  return (
    <div className="px-11 py-12 sticky top-[68px] max-lg:px-6 max-lg:border-t max-lg:border-[#EBD9B8]">
      <h3 className="font-cormorant text-[1.4rem] font-light text-[#1C1208] mb-5 pb-4 border-b border-[#EBD9B8]">
        Votre commande
      </h3>

      {/* Items list */}
      <div className="flex flex-col gap-3 mb-5">
        {items.map((item) => {
          const lineTotal = item.price * item.quantity;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-[3px] bg-[#F5EDD8]"
            >
              <div className="w-12 h-12 rounded-[3px] overflow-hidden relative flex-shrink-0 bg-[#EBD9B8]">
                {item.mainImage ? (
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    fill
                    className="object-cover saturate-[0.8]"
                    sizes="48px"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(145deg,#4A3820,#1C1208)" }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-cormorant text-[1rem] font-normal text-[#1C1208] leading-[1.15] truncate">
                  {item.name}
                </div>
                <div className="text-[0.7rem] text-[#7A6648] font-light mt-0.5">
                  {item.unit} × {item.quantity}
                </div>
              </div>
              <div className="font-cormorant text-[1.1rem] font-normal text-[#1C1208] flex-shrink-0">
                {lineTotal} DH
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="pt-4 border-t border-[#EBD9B8] flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <span className="text-[0.8rem] text-[#7A6648] font-light">Sous-total</span>
          <span className="text-[0.88rem] text-[#1C1208]">{subtotal} DH</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[0.8rem] text-[#7A6648] font-light">Livraison</span>
          <span className="text-[0.88rem] text-[#1C1208]">
            {deliveryFee > 0 ? `${deliveryFee} DH` : "Selon la ville"}
          </span>
        </div>
        {deliveryFee <= 0 && (
          <p className="text-[0.72rem] text-[#A89070] font-light leading-snug -mt-1">
            Des frais de livraison s'appliquent selon votre ville.
          </p>
        )}
        <div className="flex justify-between items-baseline pt-[18px] border-t border-[#EBD9B8] mt-1">
          <span className="text-[0.7rem] tracking-[0.14em] uppercase text-[#7A6648]">Total</span>
          <div className="font-cormorant text-[2.2rem] font-normal text-[#1C1208]">
            {total}{" "}
            <span className="text-[0.8rem] font-light font-sans text-[#7A6648]">DH</span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="mt-7 flex flex-col gap-2.5">
        <button
          onClick={() => router.back()}
          className="cursor-pointer w-full bg-transparent border-[1.5px] border-[#EBD9B8] h-[46px] font-sans text-[0.73rem] tracking-[0.1em] uppercase text-[#7A6648] rounded-[3px] transition-all duration-[250ms] flex items-center justify-center gap-2 hover:border-[#1C1208] hover:text-[#1C1208]"
        >
          ← Retour au panier
        </button>
        <p className="text-center text-[0.68rem] text-[#A89070] flex items-center justify-center gap-1.5 mt-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          Vos données sont sécurisées
        </p>
      </div>
    </div>
  );
}
