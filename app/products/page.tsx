import { Navbar, Footer, Toast } from "@/components/shared";
import { FloatingWhatsApp } from "@/components/landing";
import ProductsListClient from "@/components/products/ProductsListClient";

export const metadata = {
  title: "Nos Produits — Bayt Bio",
  description:
    "Découvrez nos œufs fermiers et produits laitiers 100% naturels, livrés frais à Casablanca et Rabat.",
};

export default function ProductsPage() {
  return (
    <main className="overflow-x-hidden bg-cream font-sans text-brown">
      <Navbar />
      <ProductsListClient />
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
