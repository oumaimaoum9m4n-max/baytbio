"use client";

import Image from "next/image";
import type { CartItem } from "@/components/shared/CartContext";

interface CartItemRowProps {
  item: CartItem;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemRow({ item, onQtyChange, onRemove }: CartItemRowProps) {
  const linePrice = item.price * item.quantity;

  return (
    <div className="grid grid-cols-[96px_1fr_auto] gap-5 py-6 border-b border-[#EBD9B8] items-center transition-colors duration-300 hover:bg-[rgba(235,217,184,0.15)] hover:-mx-4 hover:px-4 max-sm:grid-cols-[72px_1fr] max-sm:gap-3">
      {/* Image */}
      <div className="w-24 h-24 rounded-[3px] overflow-hidden bg-[#EBD9B8] relative flex-shrink-0 max-sm:w-[72px] max-sm:h-[72px]">
        {item.mainImage ? (
          <Image
            src={item.mainImage}
            alt={item.name}
            fill
            className="object-cover saturate-[0.82]"
            sizes="96px"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(145deg,#4A3820,#1C1208)" }}
          />
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <div className="font-cormorant text-[1.25rem] font-normal text-[#1C1208] mb-0.5 leading-[1.15]">
          {item.name}
        </div>
        <div className="text-[0.72rem] text-[#7A6648] font-light mb-3">{item.unit}</div>
        <div className="inline-flex items-center gap-[5px] text-[0.65rem] tracking-[0.1em] uppercase text-[#5A6A38] py-[3px] px-[9px] bg-[#E8EDDE] rounded-full">
          <span className="w-1.5 h-1.5 bg-[#55A040] rounded-full animate-blink flex-shrink-0" />
          Produit frais
        </div>
      </div>

      {/* Right: price + qty stepper + remove */}
      <div className="flex flex-col items-end gap-3 max-sm:col-span-2 max-sm:flex-row max-sm:items-center max-sm:justify-between">
        <div className="text-right">
          <div className="font-cormorant text-[1.6rem] font-normal text-[#1C1208] leading-none">
            {linePrice}{" "}
            <span className="text-[0.75rem] font-light font-sans text-[#7A6648]">DH</span>
          </div>
          <div className="text-[0.7rem] font-light text-[#7A6648] mt-0.5">
            {item.price} DH × {item.quantity}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center border-[1.5px] border-[#EBD9B8] rounded-[3px] overflow-hidden bg-[#FAF6ED]">
            <button
              onClick={() => onQtyChange(item.id, item.quantity - 1)}
              className="w-[34px] h-9 bg-transparent border-none text-base text-[#1C1208] flex items-center justify-center transition-colors duration-200 hover:bg-[#EBD9B8]"
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <span className="w-10 h-9 text-center font-cormorant text-[1.1rem] font-light text-[#1C1208] flex items-center justify-center select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onQtyChange(item.id, item.quantity + 1)}
              className="w-[34px] h-9 bg-transparent border-none text-base text-[#1C1208] flex items-center justify-center transition-colors duration-200 hover:bg-[#EBD9B8]"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="w-[30px] h-[30px] border-none bg-transparent text-[#A89070] flex items-center justify-center rounded-full transition-all duration-200 hover:bg-[#F0E0D4] hover:text-[#B85A28]"
            aria-label={`Retirer ${item.name} du panier`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
