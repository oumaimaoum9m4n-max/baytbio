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
        strokeWidth="1.2"
        className="w-full h-full"
      >
        <circle cx="22" cy="22" r="20" />
        <path d="M12 22l7 7 13-13" />
      </svg>
    ),
    number: "6h",
    label: "Fraîcheur maîtrisée",
    desc: "Un circuit court pour préserver la qualité au maximum.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="w-full h-full"
      >
        <path d="M22 4l4.5 9 10 1.5-7.2 7 1.7 10-9-4.7-9 4.7 1.7-10-7.2-7 10-1.5z" />
      </svg>
    ),
    number: "4.9/5",
    label: "clients satisfaits",
    desc: "Plus de 800 familles font confiance à Bayt Bio.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="w-full h-full"
      >
        <path
          d="M22 5l4.6 9.3 10.3 1.5-7.5 7.3 1.8 10.2L22 28.5l-9.2 4.8 1.8-10.2L7.1 15.8l10.3-1.5z"
          strokeLinejoin="round"
        />
        <path
          d="M16 21.5l4 4 8-8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    number: "0",
    label: "Compromis sur la qualité",
    desc: "Nous privilégions la naturalité, la simplicité et la confiance.",
  },
  {
    icon: (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="w-full h-full"
      >
        <path d="M22 6c-9 0-16 5.4-16 12 0 4.4 2.8 8.3 7 10.6L11 38l8-4c1 .2 2 .3 3 .3 9 0 16-5.4 16-12S31 6 22 6z" />
      </svg>
    ),
    number: "24h",
    label: "Livraison rapide",
    desc: "Un service pensé pour répondre vite et bien.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-linen py-18 px-19">
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
      <div className="mt-7 grid grid-cols-4 gap-px bg-linen max-md:grid-cols-2 max-[480px]:grid-cols-1">
        {pillars.map((p, i) => (
          <TrustPillar key={p.label} {...p} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
