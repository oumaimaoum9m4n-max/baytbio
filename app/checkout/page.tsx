import type { Metadata } from "next";
import { Navbar, Toast } from "@/components/shared";
import { FloatingWhatsApp } from "@/components/landing";
import CheckoutPageClient from "@/components/landing/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Commande - Bayt Bio",
  description: "Finalisez votre commande de produits fermiers Bayt Bio.",
};

export default function CheckoutPage() {
  return (
    <main className="overflow-x-hidden bg-[#FAF6ED] font-sans text-[#1C1208] min-h-screen">
      <Navbar linksTone="brown" />
      <CheckoutPageClient />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
