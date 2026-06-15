import { Navbar, Footer, Toast } from "@/components/shared";
import {
  FloatingWhatsApp,
  MarqueeStrip,
  CTASection,
  AboutHero,
  OpeningQuote,
  OriginStory,
  StatsBand,
  TimelineSection,
  PullQuote,
  FarmMosaic,
  DayInLife,
  ValuesGrid,
} from "@/components/landing";

const ABOUT_MARQUEE_ITEMS = [
  "Ferme familiale depuis 2018",
  "Casablanca & Rabat",
  "100% Naturel",
  "Sans antibiotiques",
  "Élevage en plein air",
  "Récolte quotidienne à l'aube",
  "Paiement à la livraison",
  "من المزرعة لمائدتك",
];

export const metadata = {
  title: "Notre Histoire — Bayt Bio",
  description:
    "Depuis 2018, la famille Tazi produit des œufs et produits laitiers 100% naturels selon les méthodes traditionnelles marocaines.",
};

export default function AboutPage() {
  return (
    <main
      className="overflow-x-hidden bg-cream font-sans text-brown"
      style={{ ['--color-brown' as any]: 'var(--color-olive)' }}
    >
      <Navbar />
      <AboutHero />
      <MarqueeStrip items={ABOUT_MARQUEE_ITEMS} />
      {/* <OpeningQuote /> */}
      <OriginStory />
      <StatsBand />
      <TimelineSection />
      {/* <PullQuote /> */}
      <FarmMosaic />
      <DayInLife />
      <ValuesGrid />
      <CTASection />
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
