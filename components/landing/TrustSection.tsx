import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import TrustPillar from "./TrustPillar";

const pillars = [
  {
    icon: (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-full h-full"
      >
        {/* Feuille */}
        <path d="M34 10C20 10 10 20 10 34c14 0 24-10 24-24z" />
        <path d="M14 30c5-5 10-10 16-14" />
      </svg>
    ),
    number: "01",
    label: "Fraîcheur maîtrisée",
    desc: "Livrés avec soin, dans le respect de la fraîcheur et de la qualité.",
  },

  {
    icon: (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-full h-full"
      >
        {/* Badge qualité */}
        <circle cx="22" cy="18" r="10" />
        <path d="M17 27l-2 10 7-4 7 4-2-10" />
        <path d="M18 18l3 3 5-5" />
      </svg>
    ),
    number: "02",
    label: "Qualité",
    desc: "Des produits simples, authentiques et sélectionnés avec exigence.",
  },

  {
   icon: (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="w-full h-full"
  >
    <path d="M22 8v28" />
    <path d="M22 12l-5-4M22 16l-6-4M22 20l-6-4M22 24l-6-4" />
    <path d="M22 12l5-4M22 16l6-4M22 20l6-4M22 24l6-4" />
  </svg>
),
    number: "03",
    label: "Sincérité",
    desc: "Aucun superflu. Juste le goût vrai, comme il doit être.",
  },

  {
    icon: (
  <svg
    viewBox="0 0 44 44"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="w-full h-full"
  >
    <path
      d="M24 5L12 24h8l-2 15 14-22h-8l0-12z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
),
    number: "04",
    label: "Rapidité",
    desc: "Commande facile, livraison rapide, service réactif.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-linen py-[72px] px-20 max-md:py-16 max-md:px-5">
      <div>
        <Reveal>
          <SectionHeader
            eyebrow="Nos engagements"
            title={
              <>
                Pourquoi <em className="italic text-terracotta">Bayt Bio</em>
              </>
            }
          />
        </Reveal>
      </div>
      <div className="mt-7 grid grid-cols-4 gap-px bg-linen max-md:grid-cols-1">
        {pillars.map((p, i) => (
          <TrustPillar key={p.label} {...p} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
