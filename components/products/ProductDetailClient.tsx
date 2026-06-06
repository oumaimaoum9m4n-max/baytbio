"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/shared/CartContext";
import { WHATSAPP_URL } from "@/components/landing/constants";
import { useGetSingleProduct } from "@/features/products/apis/getSingleProduct";
import ImageGallery from "./ImageGallery";
import QtySelector from "./QtySelector";
import StoryAccordion from "./StoryAccordion";
import OtherProducts from "./OtherProducts";
import { buildFaqItems, buildTrustItems } from "./buildFaqItems";
import {
  formatProductNum,
  getDisplayTags,
  getProductAccent,
  isPackProduct,
  renderStars,
  splitProductName,
} from "./utils";

interface ProductDetailClientProps {
  productId: string;
  productIndex: number;
  totalProducts: number;
}

export default function ProductDetailClient({
  productId,
  productIndex,
  totalProducts,
}: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const { data: product } = useGetSingleProduct(productId);

  if (!product) return null;
  const accent = getProductAccent(productIndex);
  const isPack = isPackProduct(product.tags, productIndex, totalProducts);
  const arabic = product.nameAr;
  const displayTags = getDisplayTags(product.tags);
  const { lead, emphasis } = splitProductName(product.name);
  const trustItems = buildTrustItems(product.shortDescription, product.tags);
  const faqItems = buildFaqItems(product.tags, isPack);
  const badgeLabel = displayTags[0];

  const freshnessLabel = product.stock > 0 ? "Disponible" : "Rupture de stock";

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        mainImage: product.images[0] ?? "",
      });
    }
  }

  function handleWhatsAppOrder() {
    if (!product) return;
    const text = encodeURIComponent(
      `Bonjour Bayt Bio, je souhaite commander : ${product.name} × ${qty} (${product.price} DH / ${product.unit})`,
    );
    window.open(
      `${WHATSAPP_URL}?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <nav className="mt-8 md:mt-0 flex wrap items-center gap-2.5 px-[72px] pt-[108px] font-sans text-[0.74rem] uppercase tracking-[0.1em] text-sand max-md:px-6 max-md:pt-[88px]">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 border-none bg-transparent p-0 font-sans text-[0.76rem] uppercase tracking-[0.14em] text-sand no-underline transition-all duration-300 hover:gap-3.5 hover:text-terracotta"
        >
          ← Retour aux produits
        </Link>
        <span className="text-[rgba(122,102,72,0.4)]">/</span>
        <strong className="font-normal text-brown">{product.name}</strong>
      </nav>

      <div className="grid grid-cols-1 gap-0 pt-12 md:grid-cols-2">
        <ImageGallery
          images={product.images}
          productName={product.name}
          accentIndex={productIndex}
          badgeLabel={badgeLabel}
        />

        <div className="flex flex-col px-16 pb-20 pt-0 max-md:px-6 md:pl-16 md:pr-[72px]">
          <p className="mb-2.5 font-cormorant text-[0.9rem] font-light tracking-[0.1em] text-sand">
            {formatProductNum(productIndex)} /{" "}
            {String(totalProducts).padStart(2, "0")}
          </p>
          {arabic && (
            <p
              className="mb-3 font-arabic text-[1.2rem] leading-none text-sand"
              dir="rtl"
            >
              {arabic}
            </p>
          )}
          <h1 className="mb-2 font-cormorant text-[clamp(2.8rem,4vw,4.5rem)] font-light leading-[1.05] text-brown">
            {lead}
            {emphasis && <em className="text-terracotta"> {emphasis}</em>}
          </h1>
          <p className="mb-5 font-sans text-[0.74rem] font-light uppercase tracking-[0.14em] text-sand">
            {product.unit}
          </p>

          <div className="mb-7 flex flex-wrap items-center gap-2.5">
            <span className="text-terracotta tracking-[2px]">
              {renderStars(5)}
            </span>
            <span className="font-cormorant text-[1.1rem] font-normal text-brown">
              5
            </span>
            <span className="font-sans text-[0.78rem] text-sand">
              (avis clients)
            </span>
            <span className="rounded-full bg-[rgba(61,122,85,0.08)] px-2.5 py-0.5 font-sans text-[0.68rem] uppercase tracking-[0.08em] text-olive-light">
              ✓ Via WhatsApp
            </span>
          </div>

          <div className="mb-7 flex flex-wrap items-baseline gap-3 border-y border-linen py-6">
            <span className="font-cormorant text-[3.2rem] font-normal leading-none text-brown">
              {product.price}
            </span>
            <span className="font-sans text-[0.9rem] font-light text-sand">
              DH / {product.unit}
            </span>
            <span
              className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-[0.72rem] uppercase tracking-[0.1em] ${
                product.stock > 0
                  ? "bg-[rgba(61,122,85,0.08)] text-olive-light"
                  : "bg-[rgba(220,38,38,0.08)] text-red-500"
              }`}
            >
              <span
                className={`h-[7px] w-[7px] rounded-full ${
                  product.stock > 0
                    ? "animate-blink bg-[#5A9A40]"
                    : "bg-red-500"
                }`}
              />
              {freshnessLabel}
            </span>
          </div>

          {product.description && (
            <div
              className="mb-8 font-sans text-[0.92rem] font-light leading-[1.88] text-sand [&_strong]:font-normal [&_strong]:text-brown"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          <div className="mb-9 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item.text} className="flex items-start gap-2.5">
                <span
                  className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[0.65rem]"
                  style={{ background: `${accent}22`, color: accent }}
                >
                  {item.icon}
                </span>
                <span className="font-sans text-[0.82rem] font-light leading-snug text-sand">
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {product.stock > 0 && (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-4">
                <QtySelector value={qty} onChange={setQty} />
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex flex-1 items-center justify-center gap-2.5 rounded-[2px] border-none px-7 py-4 font-sans text-[0.82rem] uppercase tracking-[0.12em] text-white transition-all duration-300 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-0.5"
                  style={{ background: accent }}
                >
                  Ajouter au panier
                </button>
              </div>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="flex w-full items-center justify-center gap-2 rounded-[2px] border-none bg-[#25D366] px-4 py-[15px] font-sans text-[0.8rem] uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-px hover:bg-[#1cbf5a] hover:shadow-[0_10px_28px_rgba(37,211,102,0.3)]"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Commander directement par WhatsApp
              </button>
            </>
          )}

          <StoryAccordion items={faqItems} />
        </div>
      </div>

      <OtherProducts relatedProducts={product.relatedProducts} />
    </div>
  );
}
