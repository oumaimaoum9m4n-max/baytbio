"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/shared/CartContext";
import { DELIVERY_FEE } from "@/features/orders/utils/order.utils";
import CheckoutForm from "./CheckoutForm";
import type { CheckoutSuccessData } from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import OrderConfirmation from "./OrderConfirmation";
import { saveOrder } from "@/utils/orders-storage";
import type { StoredOrder } from "@/utils/orders-storage";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const isNavigatingToOrder = useRef(false);
  const [confirmedOrder, setConfirmedOrder] = useState<StoredOrder | null>(null);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + DELIVERY_FEE;

  useEffect(() => {
    if (items.length === 0 && !isNavigatingToOrder.current) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  if (items.length === 0 && !isNavigatingToOrder.current) return null;

  if (confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />;
  }

  const handleSuccess = (data: CheckoutSuccessData) => {
    isNavigatingToOrder.current = true;

    const order: StoredOrder = {
      id: data.orderId,
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      fullAddress: data.fullAddress,
      items: items.map((i) => ({
        productId: i.id,
        name: i.name,
        unit: i.unit,
        price: i.price,
        quantity: i.quantity,
        mainImage: i.mainImage,
      })),
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    saveOrder(order);
    clearCart();
    setConfirmedOrder(order);
  };

  return (
    <div className="pt-[80px] min-h-screen animate-fade-slide">
      {/* Page Header */}
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
          Étape 2 · Informations de commande
        </p>
        <h1
          className="relative z-10 font-cormorant text-cream font-light leading-[0.92] mb-8"
          style={{ fontSize: "clamp(3.8rem,7vw,8rem)" }}
        >
          Vos <em className="italic text-terra-light">informations</em>
        </h1>
        <p className="relative z-[1] mt-2.5 font-sans text-[0.83rem] font-light text-[rgba(212,200,160,0.5)]">
          Les champs marqués * sont obligatoires
        </p>

        {/* Nav steps progress indicator */}
        <div className="relative z-[1] mt-6 flex items-center gap-0 max-sm:gap-y-2">
          {/* Step 1 — done */}
          <div className="flex items-center gap-2.5 max-sm:gap-1.5 text-[0.7rem] tracking-[0.12em] uppercase text-[#5A6A38] pr-5 max-sm:pr-1">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-medium flex-shrink-0 bg-[#5A6A38] text-white">
              ✓
            </span>
            Panier
          </div>
          <div className="w-7 h-px bg-[rgba(212,200,160,0.3)] flex-shrink-0 max-sm:w-2" />
          {/* Step 2 — active */}
          <div className="flex items-center gap-2.5 max-sm:gap-1.5 text-[0.7rem] tracking-[0.12em] uppercase text-[#F5EDD8] px-5 max-sm:px-1">
            <span className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-medium flex-shrink-0 bg-terra-dark text-white">
              2
            </span>
            Commande
          </div>
          <div className="w-7 h-px bg-[rgba(212,200,160,0.3)] flex-shrink-0 max-sm:w-2" />
          {/* Step 3 — pending */}
          <div className="flex items-center gap-2.5 max-sm:gap-1.5  text-[0.7rem] tracking-[0.12em] uppercase text-[rgba(212,200,160,0.35)] pl-5 max-sm:pl-1">
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
