"use client";

import { useCart } from "@/components/shared/CartContext";
import { useGetAllProducts } from "@/features/products/apis/getAllProducts";
import ProductsPageHeader from "./ProductsPageHeader";
import ProductsCatalog from "./ProductsCatalog";
import ProductRowSkeleton from "./ProductRowSkeleton";

export default function ProductsListClient() {
  const { addToCart } = useCart();
  const { data, isPending, isError } = useGetAllProducts(0, 20, "", "");
  const totalItems = data?.totalItems ?? 0;
  const products = data?.data ?? [];
  return (
    <>
      <ProductsPageHeader totalItems={isPending ? 0 : totalItems} />
      {isPending && (
        <div>
          <ProductRowSkeleton layout="a" />
          <ProductRowSkeleton layout="b" />
          <ProductRowSkeleton layout="a" />
        </div>
      )}
      {isError && (
        <p className="px-[72px] py-16 font-sans text-sand max-md:px-6">
          Impossible de charger les produits. Veuillez réessayer plus tard.
        </p>
      )}
      {!isPending && !isError && products.length === 0 && (
        <p className="px-[72px] py-16 font-sans text-sand max-md:px-6">
          Aucun produit disponible pour le moment.
        </p>
      )}
      {!isPending && !isError && products.length > 0 && (
        <ProductsCatalog products={products} onAddToCart={addToCart} />
      )}
    </>
  );
}
