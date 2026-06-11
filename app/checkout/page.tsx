import type { Metadata } from "next";
import { Navbar, Footer,  Toast } from "@/components/shared";
import { FloatingWhatsApp } from "@/components/landing";
import CheckoutPageClient from "@/components/landing/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Commande - Bayt Bio",
  description: "Finalisez votre commande de produits fermiers Bayt Bio.",
};

export default function CheckoutPage() {
  return (
    <main className="overflow-x-hidden bg-cream font-sans text-[#1C1208] min-h-screen">
      <Navbar linksTone="brown" />
      <CheckoutPageClient />
      <Footer/>
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
