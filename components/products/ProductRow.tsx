"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/landing";
import type { GetAllProductsDto } from "@/features/products/types/product.dto";
import type { CartItem } from "@/components/shared/CartContext";
import {
  formatProductNum,
  getDisplayTags,
  getProductAccent,
  isPackProduct,
  splitProductName,
} from "./utils";

interface ProductRowProps {
  product: GetAllProductsDto;
  index: number;
  total: number;
  onAddToCart: (item: Omit<CartItem, "quantity">) => void;
}

export default function ProductRow({
  product,
  index,
  total,
  onAddToCart,
}: ProductRowProps) {
  const accent = getProductAccent(index);
  const isPack = isPackProduct(product.tags, index, total);
  const layoutB = index % 2 === 1 && !isPack;
  const { lead, emphasis } = splitProductName(product.name);
  const imageUrl = product.images[0];
  const revealDir = layoutB ? "right" : "left";
  const badgeTag = getDisplayTags(product.tags)[0];

  const gridClass = isPack
    ? "grid-cols-1 md:grid-cols-2 md:min-h-[70vh]"
    : layoutB
      ? "grid-cols-1 md:grid-cols-[1fr_1.15fr]"
      : "grid-cols-1 md:grid-cols-[1.15fr_1fr]";

  const imageCell = (
    <div className="relative min-h-[280px] overflow-hidden md:h-full">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          priority={index === 0}
          className="object-cover transition-all duration-[1200ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] [filter:saturate(0.82)_contrast(1.06)] group-hover:scale-[1.055] group-hover:[filter:saturate(0.95)_contrast(1.04)]"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${accent}44 0%, var(--color-olive) 100%)`,
          }}
        />
      )}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          layoutB && !isPack
            ? "bg-[linear-gradient(-120deg,transparent_55%,rgba(28,18,8,0.55))]"
            : isPack
              ? "bg-[linear-gradient(120deg,transparent_50%,rgba(28,18,8,0.7))]"
              : "bg-[linear-gradient(120deg,transparent_55%,rgba(28,18,8,0.55))]"
        }`}
      />
    </div>
  );

  const textCell = (
    <div
      className={`group/text relative flex flex-col justify-center px-20 py-[72px] transition-colors duration-400 max-md:px-6 max-md:py-12 ${
        isPack
          ? "bg-[#3a2810] px-[72px] py-20 hover:bg-olive max-md:px-6 max-md:py-12"
          : "bg-cream hover:bg-linen"
      }`}
    >
      <span
        className={`pointer-events-none absolute top-5 select-none font-cormorant text-[10rem] font-light leading-none opacity-[0.05] max-md:text-[6rem] ${
          layoutB && !isPack
            ? "left-16 max-md:left-6"
            : "right-16 max-md:right-6"
        }`}
        style={{ color: isPack ? "rgba(255,255,255,1)" : accent }}
      >
        {formatProductNum(index)}
      </span>
      <div
        className="mb-7 h-0.5 w-0 rounded-[1px] transition-[width] duration-[800ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] group-hover/text:w-14"
        style={{ background: isPack ? "var(--color-terra-light)" : accent }}
      />
      {!isPack && badgeTag && (
        <div
          className="mb-[18px] inline-flex w-fit items-center gap-1.5 rounded-[1px] px-3.5 py-1.5 font-sans text-[0.68rem] uppercase tracking-[0.16em]"
          style={{
            background: `${accent}1f`,
            color: accent,
            border: `1px solid ${accent}40`,
          }}
        >
          {badgeTag}
        </div>
      )}
      {isPack && (
        <div className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-[rgba(184,90,40,0.3)] bg-[rgba(184,90,40,0.18)] px-3.5 py-1.5 font-sans text-[0.7rem] uppercase tracking-[0.1em] text-terra-light">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Pack famille · Meilleure valeur
        </div>
      )}
      {product.nameAr && (
        <p
          className={`mb-2.5 font-arabic text-[1.05rem] opacity-70 ${
            isPack ? "text-[rgba(200,178,133,0.6)]" : "text-sand"
          }`}
        >
          {product.nameAr}
        </p>
      )}
      <h2
        className={`mb-3.5 font-cormorant text-[clamp(2rem,3.2vw,3.4rem)] font-normal leading-[1.08] ${
          isPack ? "text-cream" : "text-brown"
        }`}
      >
        {lead}
        {emphasis && (
          <>
            <br />
            <em>{emphasis}</em>
          </>
        )}
      </h2>
      {product.shortDescription && (
        <p
          className={`mb-6 font-sans text-[0.72rem] font-light uppercase tracking-[0.12em] ${
            isPack ? "text-[rgba(200,178,133,0.45)]" : "text-sand"
          }`}
        >
          {product.shortDescription}
        </p>
      )}
      {product.description && (
        <div
          className={`mb-9 max-w-[400px] font-sans text-[0.9rem] font-light leading-[1.85] [&_strong]:font-normal ${
            isPack
              ? "text-cream [&_strong]:text-terra-light"
              : "text-sand [&_strong]:text-terracotta"
          }`}
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-cormorant font-normal leading-none text-terra-light ${
              isPack ? "text-[3rem]" : "text-[2.6rem]"
            }`}
          >
            {product.price}
          </span>
          <span className="font-sans text-[0.8rem] font-light text-sand">
            DH / {product.unit}
          </span>
        </div>
        {product.stock > 0 ? (
          <button
            type="button"
            onClick={() =>
              onAddToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                unit: product.unit,
                mainImage: product.images[0] ?? "",
              })
            }
            className="group/btn flex items-center gap-2 rounded-[2px] border-none px-8 py-3.5 font-sans text-[0.78rem] font-normal uppercase tracking-[0.12em] text-white transition-all duration-300 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-0.5"
            style={{ background: isPack ? "var(--color-terracotta)" : accent }}
          >
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/25 text-base leading-none transition-transform duration-[350ms] [transition-timing-function:cubic-bezier(0.22,0.68,0,1.2)] group-hover/btn:rotate-90">
              +
            </span>
            {isPack ? "Commander le pack" : "Ajouter au panier"}
          </button>
        ) : (
          <></>
        )}

        <Link
          href={`/products/${product.id}`}
          className={`flex items-center gap-2 border-none bg-transparent p-0 font-sans text-[0.78rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:gap-3.5 ${
            isPack
              ? "text-sand hover:text-terra-light"
              : "text-sand hover:text-terracotta"
          }`}
        >
          Voir le détail →
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <Reveal direction={revealDir as "left" | "right"}>
        <article
          className={`group grid min-h-[60vh] overflow-hidden max-md:min-h-0 ${gridClass}`}
        >
          {layoutB && !isPack ? (
            <>
              {textCell}
              <div className="h-full max-md:order-2">{imageCell}</div>
            </>
          ) : (
            <>
              {imageCell}
              {textCell}
            </>
          )}
        </article>
      </Reveal>
      {!isPack && index < total - 1 && (
        <div className="mx-[72px] h-px bg-linen max-md:mx-6" />
      )}
    </>
  );
}
