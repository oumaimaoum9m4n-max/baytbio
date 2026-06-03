import {
  HeroSection,
  MarqueeStrip,
  TrustSection,
  ProductsSection,
  StorySection,
  ProcessSection,
  TestimonialsSection,
  CTASection,
  FloatingWhatsApp,
} from "@/components/landing";
import { Navbar, Footer, Toast } from "@/components/shared";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-cream font-sans text-brown">
      <Navbar />
      <HeroSection />
      <MarqueeStrip />
      <TrustSection />
      <ProductsSection />
      <StorySection />
      <ProcessSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
      <FloatingWhatsApp />
      <Toast />
    </main>
  );
}
