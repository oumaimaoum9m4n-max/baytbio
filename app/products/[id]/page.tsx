import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Navbar, Footer, Toast } from "@/components/shared";
import { FloatingWhatsApp } from "@/components/landing";
import { productRouter } from "@/features/products/actions/product.router";
import ProductDetailClient from "@/components/products/ProductDetailClient";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { id } = await params;
  try {
    const product = await productRouter.getById(id);
    return {
      title: `${product.name} — Bayt Bio`,
      description: product.shortDescription || product.description?.slice(0, 160),
    };
  } catch {
    return { title: "Produit — Bayt Bio" };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery({
      queryKey: ["products", id],
      queryFn: () => productRouter.getById(id),
    });
  } catch {
    notFound();
  }

  const catalog = await productRouter.getAll({
    page: 0,
    size: 20,
    search: "",
    sort: "",
  });
  const productIndex = Math.max(
    0,
    catalog.data.findIndex((p) => p.id === id),
  );

  return (
    <main className="overflow-x-hidden bg-cream font-sans text-brown">
      <Navbar linksTone="brown" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductDetailClient
          productId={id}
          productIndex={productIndex}
          totalProducts={catalog.totalItems || catalog.data.length}
        />
      </HydrationBoundary>
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
