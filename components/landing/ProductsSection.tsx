"use client";

import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import ProductCard from "./ProductCard";
import { useGetTopProducts } from "@/features/products/apis/getTopProducts";
import type { GetTopProductsDto } from "@/features/products/types/product.dto";
import type { BadgeVariant, Product } from "./constants";
import Link from "next/link";

const BADGE_VARIANTS: BadgeVariant[] = ["terracotta", "olive", "sand"];

function toProductCardProps(p: GetTopProductsDto, index: number): Product {
  return {
    id: p.id,
    name: p.name,
    tagline: p.shortDescription,
    price: p.price,
    unit: p.unit,
    image: p.images[0] ?? "",
    badge: {
      label: p.tags[0] ?? "Produit",
      variant: BADGE_VARIANTS[index % BADGE_VARIANTS.length],
    },
  };
}

export default function ProductsSection() {
  const { data, isLoading } = useGetTopProducts();

  return (
    <section
      id="all-products"
      className="py-[10px] px-20 bg-[#faf8f5] max-md:py-16 max-md:px-5"
    >
      <div className="flex justify-between items-end mb-16 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <Reveal>
            <SectionHeader
              eyebrow="Sélection essentielle, naturelle et généreuse."
              title={
                <>
                  Nos <em className="italic text-terracotta">produits</em>
                </>
              }
            />
          </Reveal>
        </div>
        <Reveal delay={200}>
          <Link
            href="/products"
            className="text-[0.8rem] tracking-[0.12em] uppercase text-sand no-underline flex items-center gap-2.5 transition-all duration-300 after:content-['→'] after:transition-transform hover:text-terracotta hover:gap-4"
          >
            Voir tous nos produits
          </Link>
        </Reveal>
      </div>

      <div className="grid grid-cols-3 gap-5 max-[992px]:grid-cols-2 max-[600px]:grid-cols-1">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-cream rounded-[4px] min-h-[400px] animate-pulse"
              />
            ))
          : (data ?? []).map((product, i) => (
              <Reveal key={product.id} delay={i * 100}>
                <ProductCard product={toProductCardProps(product, i)} />
              </Reveal>
            ))}
      </div>
    </section>
  );
}
