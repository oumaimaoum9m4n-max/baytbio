import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import TestimonialCard from "./TestimonialCard";

const testimonials = [
  {
    text: "\"Les œufs et le lben ont vraiment un goût différent. On sent la qualité dès la première commande.\"",
    authorName: "Nadia A.",
    authorDetail: "Cliente depuis 8 mois",
    initial: "N",
    direction: "left" as const,
  },
  {
    text: "\"Service rapide, produits frais et présentation très propre. Bayt Bio donne confiance.\"",
    authorName: "Ahmed B.",
    authorDetail: "Client depuis 1 an",
    initial: "A",
    featured: true,
    direction: "up" as const,
  },
  {
    text: "\"J'ai aimé le côté simple, naturel et authentique. Exactement ce qu'on cherchait pour la famille.\"",
    authorName: "Sara M.",
    authorDetail: "Cliente depuis 5 mois",
    initial: "S",
    direction: "right" as const,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-[120px] px-20 bg-[#faf8f5] relative max-md:py-16 max-md:px-5">
      <div className="text-center mb-16">
        <Reveal>
          <p className="text-[0.72rem] tracking-[0.22em] uppercase text-terracotta font-normal mb-3.5 flex items-center justify-center gap-3.5 after:content-[''] after:w-8 after:h-px after:bg-terracotta after:shrink-0">
            Ils nous font confiance
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-cormorant text-[clamp(2.4rem,3.5vw,3.8rem)] font-light leading-[1.1] text-brown">
            Ce que disent<br /><em className="italic text-terracotta">nos clients</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-sand text-[0.88rem] font-light mt-4 tracking-[0.04em]">Vérifiés via WhatsApp</p>
        </Reveal>
      </div>

      <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-6 items-start max-md:grid-cols-1">
        {testimonials.map((t) => (
          <TestimonialCard key={t.authorName} {...t} />
        ))}
      </div>
    </section>
  );
}
