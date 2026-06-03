import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { productRouter } from "@/features/products/actions/product.router";
import ProductsList from "@/features/products/components/ProductsList";
import { PageHeader, LinkButton } from "@/components/ui";

export default async function ProductsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["products", 0, 10, "", ""],
    queryFn: () =>
      productRouter.getAll({ page: 0, size: 10, search: "", sort: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-6 mt-7">
        <PageHeader
          title="Gestion des produits"
          description="Gérez et publiez les produits de la boutique"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Produits" },
          ]}
          actions={
            <LinkButton
              href="/dashboard/products/add-product"
              color="primary"
              size="sm"
              startContent={<Plus size={13} />}
              className="h-9 text-[0.81rem]"
            >
              Ajouter un produit
            </LinkButton>
          }
        />
        <ProductsList />
      </div>
    </HydrationBoundary>
  );
}
