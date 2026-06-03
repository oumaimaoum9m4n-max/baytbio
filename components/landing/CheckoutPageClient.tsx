"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shared/CartContext";
import { DELIVERY_FEE } from "@/features/orders/utils/order.utils";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0) return null;

  const handleSuccess = (orderId: string) => {
    clearCart();
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="pt-[68px] min-h-screen animate-fade-slide">
      {/* Page Header */}
      <header className="relative overflow-hidden bg-[#3C4926] px-[72px] pb-12 pt-[52px] max-md:px-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 92% 50%, rgba(200,178,100,0.11), transparent)",
          }}
          aria-hidden
        />
        <p className="relative z-[1] mb-[14px] flex items-center gap-3 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-[rgba(212,200,160,0.45)] before:h-px before:w-6 before:shrink-0 before:bg-[rgba(212,200,160,0.25)] before:content-['']">
          Étape 2 · Informations de commande
        </p>
        <h1 className="relative z-[1] font-cormorant text-[clamp(2.4rem,4vw,4rem)] font-light text-[#F5EDD8] leading-none">
          Vos <em className="italic text-[rgba(212,200,160,0.82)]">informations</em>
        </h1>
        <p className="relative z-[1] mt-2.5 font-sans text-[0.83rem] font-light text-[rgba(212,200,160,0.5)]">
          Les champs marqués * sont obligatoires
        </p>

        {/* Nav steps progress indicator */}
        <div className="relative z-[1] mt-6 flex items-center gap-0 max-sm:flex-wrap max-sm:gap-2">
          {/* Step 1 — done */}
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.12em] uppercase text-[#5A6A38] pr-5">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-medium flex-shrink-0 bg-[#5A6A38] text-white">
              ✓
            </span>
            Panier
          </div>
          <div className="w-7 h-px bg-[rgba(212,200,160,0.3)] flex-shrink-0 max-sm:hidden" />
          {/* Step 2 — active */}
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.12em] uppercase text-[#F5EDD8] px-5">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-medium flex-shrink-0 bg-[#B85A28] text-white">
              2
            </span>
            Commande
          </div>
          <div className="w-7 h-px bg-[rgba(212,200,160,0.3)] flex-shrink-0 max-sm:hidden" />
          {/* Step 3 — pending */}
          <div className="flex items-center gap-2.5 text-[0.7rem] tracking-[0.12em] uppercase text-[rgba(212,200,160,0.35)] pl-5">
            <span className="w-6 h-6 rounded-full border-[1.5px] border-current flex items-center justify-center text-[0.65rem] font-medium flex-shrink-0">
              3
            </span>
            Confirmation
          </div>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_380px] items-start max-lg:grid-cols-1">
        <CheckoutForm items={items} onSuccess={handleSuccess} />
        <CheckoutSummary items={items} subtotal={subtotal} total={total} />
      </div>
    </div>
  );
}
