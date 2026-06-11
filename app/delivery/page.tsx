// app/delivery/page.tsx  (Server Component — metadata export)
import { Navbar, Footer, Toast } from "@/components/shared";
import {
  FloatingWhatsApp,
  MarqueeStrip,
  CTASection,
} from "@/components/landing";
import DeliveryHero from "@/components/landing/DeliveryHero";
import DeliveryZones from "@/components/landing/DeliveryZones";
import DeliverySteps from "@/components/landing/DeliverySteps";
import DeliveryFAQ from "@/components/landing/DeliveryFAQ";

const DELIVERY_MARQUEE_ITEMS = [
  "Livraison à Casablanca & Rabat",
  "Paiement à la livraison",
  "Commande via WhatsApp",
  "Fraîcheur garantie",
  "Récolte le matin même",
  "التوصيل عند الباب",
  "7j/7",
  "Sans frais minimum",
];

export const metadata = {
  title: "Livraison — Bayt Bio",
  description:
    "Livraison de produits fermiers frais à Casablanca et Rabat. Commandez via WhatsApp, paiement à la livraison, 7j/7.",
};

export default function DeliveryPage() {
  return (
    <main className="overflow-x-hidden bg-cream font-sans text-brown">
      <Navbar />
      <DeliveryHero />
      <MarqueeStrip items={DELIVERY_MARQUEE_ITEMS} />
      <DeliveryZones />
      <DeliverySteps />
      <DeliveryFAQ />
      <CTASection />
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}