"use client";

import type { GetAllProductsDto } from "@/features/products/types/product.dto";
import type { CartItem } from "@/components/shared/CartContext";
import ProductRow from "./ProductRow";

interface ProductsCatalogProps {
  products: GetAllProductsDto[];
  onAddToCart: (item: Omit<CartItem, "quantity">) => void;
}

export default function ProductsCatalog({ products, onAddToCart }: ProductsCatalogProps) {
  return (
    <div>
      {products.map((product, index) => (
        <ProductRow
          key={product.id}
          product={product}
          index={index}
          total={products.length}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
