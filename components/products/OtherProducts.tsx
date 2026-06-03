import Image from "next/image";
import Link from "next/link";
import type { GetSingleProductDto } from "@/features/products/types/product.dto";
import { SectionHeader } from "../landing";

interface OtherProductsProps {
  relatedProducts: GetSingleProductDto["relatedProducts"];
}

export default function OtherProducts({ relatedProducts }: OtherProductsProps) {
  if (!relatedProducts?.length) return null;

  return (
    <section className="border-t border-linen px-[72px] py-20 max-md:px-6 max-md:py-12">
      <div className="flex justify-between items-end mb-16 max-md:flex-col max-md:items-start max-md:gap-4">
        <div>
          <SectionHeader
            eyebrow="Sélection essentielle"
            title={
              <>
                Vous aimerez <em className="italic text-terracotta">aussi</em>
              </>
            }
          />
        </div>
        <Link
          href="/products"
          className="text-[0.8rem] tracking-[0.12em] uppercase text-sand no-underline flex items-center gap-2.5 transition-all duration-300 after:content-['→'] after:transition-transform hover:text-terracotta hover:gap-4"
        >
          tous nos produits
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {relatedProducts.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="group relative block min-h-[300px] overflow-hidden rounded-[3px] no-underline transition-all duration-400 [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(28,18,8,0.12)]"
          >
            {item.mainImage ? (
              <Image
                src={item.mainImage}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] [filter:saturate(0.8)_contrast(1.08)] group-hover:scale-[1.07] group-hover:[filter:saturate(0.95)]"
              />
            ) : (
              <div className="absolute inset-0 bg-olive/30" />
            )}
            <div className="absolute inset-0 z-[1] bg-[linear-gradient(to_top,rgba(28,18,8,0.82)_0%,rgba(28,18,8,0.1)_55%,transparent_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 z-[2] p-6">
              <div className="mb-1.5 font-cormorant text-[1.35rem] font-normal text-cream">
                {item.name}
              </div>
              <span className="inline-flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-[0.14em] text-[rgba(244,237,216,0.6)] transition-all duration-300 group-hover:gap-3 group-hover:text-terra-light">
                Voir le produit →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
