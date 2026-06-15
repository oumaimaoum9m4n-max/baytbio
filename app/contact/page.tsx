// app/contact/page.tsx

import { Navbar, Footer, Toast } from "@/components/shared";
import { FloatingWhatsApp, MarqueeStrip } from "@/components/landing";
import ContactHero from "@/components/landing/ContactHero";
import ContactInfo from "@/components/landing/ContactInfo";
import ContactForm from "@/components/landing/ContactForm";
import ContactDetails from "@/components/landing/ContactDetails";

const CONTACT_MARQUEE_ITEMS = [
  "Réponse en moins d'1h",
  "WhatsApp · Email · Téléphone",
  "Casablanca & Rabat",
  "7j/7",
  "نحن هنا لخدمتكم",
  "Paiement à la livraison",
  "Produits 100% naturels",
  "Famille Tazi depuis 2018",
];

export const metadata = {
  title: "Contact — Bayt Bio",
  description:
    "Contactez Bayt Bio pour passer commande, poser une question ou nous donner votre avis. Réponse sous 1h, 7j/7.",
};

export default function ContactPage() {
  return (
    // Fond sombre comme base de page — override du bg-cream global
    <main className="overflow-x-hidden bg-[#1A1210] font-sans text-cream">
      <Navbar linksTone="default" />
      <ContactHero />
      <ContactDetails />
      {/* <MarqueeStrip
        items={CONTACT_MARQUEE_ITEMS}
       
      /> */}
      {/* <ContactInfo /> */}
      {/* <ContactForm /> */}
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}