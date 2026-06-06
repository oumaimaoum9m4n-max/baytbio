import type { Metadata } from "next";
import { Navbar, Footer, Toast } from "@/components/shared";
import { FloatingWhatsApp } from "@/components/landing";
import CartPageClient from "@/components/landing/CartPageClient";

export const metadata: Metadata = {
  title: "Votre Panier — Bayt Bio",
  description: "Vérifiez vos produits avant de passer commande.",
};

export default function CartPage() {
  return (
    <main className="overflow-x-hidden bg-[#FAF6ED] font-sans text-[#1C1208] min-h-screen">
      <Navbar linksTone="brown" />
      <CartPageClient />
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
