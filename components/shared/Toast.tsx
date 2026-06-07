"use client";

import { useCart } from "./CartContext";

export default function Toast() {
  const { toast } = useCart();

  return (
    <div
      className="fixed bottom-[100px] right-8 bg-olive text-cream px-6 py-4 rounded-[4px] border-l-[3px] border-terracotta text-[0.85rem] z-[500] max-w-[280px] leading-[1.5] shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]"
      style={{ transform: toast.show ? "translateX(0)" : "translateX(140%)" }}
    >
      <div className="font-medium mb-1 text-terra-light text-[0.8rem] tracking-[0.08em] uppercase">
        Ajouté au panier ✓
      </div>
      <div>
        {toast.name} — {toast.price} DH
      </div>
    </div>
  );
}
