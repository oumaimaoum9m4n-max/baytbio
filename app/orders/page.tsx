import type { Metadata } from "next";
import { Navbar, Toast } from "@/components/shared";
import { FloatingWhatsApp } from "@/components/landing";
import OrdersPageClient from "@/components/landing/OrdersPageClient";

export const metadata: Metadata = {
  title: "Mes commandes - Bayt Bio",
  description: "Consultez l'historique de vos commandes Bayt Bio.",
};

export default function OrdersPage() {
  return (
    <main className="overflow-x-hidden bg-[#FAF6ED] font-sans text-[#1C1208] min-h-screen">
      <Navbar linksTone="brown" />
      <OrdersPageClient />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
