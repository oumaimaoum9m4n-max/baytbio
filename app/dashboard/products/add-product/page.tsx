"use client";

import { useRouter } from "next/navigation";
import ProductForm from "@/features/products/components/ProductForm";
import { useCreateProduct } from "@/features/products/apis/createProduct";
import type { CreateOrUpdateProductDto } from "@/features/products/types/product.dto";
import { PageHeader } from "@/components/ui";

export default function AddProductPage() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateProduct();

  const handleSubmit = async (data: CreateOrUpdateProductDto) => {
    await mutateAsync(data);
    router.push("/dashboard/products");
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      pageHeader={
        <PageHeader
          title="Ajouter un produit"
          description="Remplissez tous les champs pour publier le produit sur la boutique"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Produits", href: "/dashboard/products" },
            { label: "Ajouter" },
          ]}
          className="mt-7"
        />
      }
    />
  );
}
