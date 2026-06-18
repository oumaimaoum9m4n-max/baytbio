"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/shared/CartContext";
import type { Product } from "./constants";

const badgeStyle = {
  terracotta: "bg-terracotta text-cream",
  olive: "bg-olive text-cream",
  sand: "bg-sand text-brown",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      mainImage: product.image,
    });
    if (product.stock > 0) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    }
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block overflow-hidden bg-cream rounded-[4px] cursor-pointer min-h-[400px] no-underline"
    >
      {/* background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-all duration-[900ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] [filter:saturate(0.85)_contrast(1.08)] group-hover:scale-[1.07] group-hover:[filter:saturate(1)_contrast(1.05)]"
        />
      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-black/[0.51] pointer-events-none" />

      {/* Arabic label */}
      {product.arabic && (
        <p
          className="absolute top-5 right-5 font-arabic text-[0.9rem] text-cream/60 z-[2] text-right"
          dir="rtl"
        >
          {product.arabic}
        </p>
      )}

      {/* info panel */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-[2]">
        <span
          className={`inline-block px-3 py-1 text-[0.65rem] tracking-[0.14em] uppercase rounded-[1px] mb-2.5 font-normal ${badgeStyle[product.badge.variant]}`}
        >
          {product.badge.label}
        </span>
        <div className="font-cormorant text-[1.6rem] font-normal text-cream leading-[1.2] mb-1.5">
          {product.name}
        </div>
        <div className="text-[0.8rem] text-cream/70 font-light mb-5 leading-[1.6] max-h-0 overflow-hidden opacity-0 transition-all duration-[400ms] group-hover:max-h-20 group-hover:opacity-100">
          {product.tagline}
        </div>
        <div className="flex items-center justify-between">
          <div className="font-cormorant text-[1.5rem] font-medium text-cream">
            {product.price} DH{" "}
            <span className="text-[0.8rem] font-light text-cream/60 font-sans ml-1">
              / {product.unit}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Ajouter au panier"
            className={`w-11 h-11 rounded-full border-none text-white flex items-center justify-center text-[1.3rem] shrink-0 transition-all duration-300 ${
              added
                ? "bg-olive scale-110"
                : "bg-terracotta hover:bg-terra-light hover:scale-110 hover:rotate-90"
            }`}
          >
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </Link>
  );
}
