"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import ProductForm from "@/features/products/components/ProductForm";
import { useGetSingleProduct } from "@/features/products/apis/getSingleProduct";
import { useUpdateProduct } from "@/features/products/apis/updateProduct";
import type { CreateOrUpdateProductDto } from "@/features/products/types/product.dto";
import { PageHeader } from "@/components/ui";

export default function UpdateProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading } = useGetSingleProduct(id);
  const { mutateAsync, isPending } = useUpdateProduct();

  const handleSubmit = async (data: CreateOrUpdateProductDto) => {
    await mutateAsync({ ...data, id });
    router.push("/dashboard/products");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      defaultValues={product}
      pageHeader={
        <PageHeader
          title="Modifier le produit"
          description="Mettez à jour les informations du produit"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Produits", href: "/dashboard/products" },
            { label: "Modifier" },
          ]}
          className="mt-7"
        />
      }
    />
  );
}
