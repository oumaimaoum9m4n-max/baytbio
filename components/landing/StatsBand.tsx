import Reveal from "./Reveal";

const engagements = [
  {
    label: "Naturel",
    desc: "Nous privilégions des produits simples, authentiques et soigneusement sélectionnés.",
    delay: 0,
  },
  {
    label: "Fraîcheur",
    desc: "Chaque produit est choisi avec attention afin de préserver sa qualité et son goût.",
    delay: 100,
  },
  {
    label: "Confiance",
    desc: "Nous construisons une relation durable basée sur la transparence et la proximité.",
    delay: 200,
  },
  {
    label: "Qualité",
    desc: "Une exigence constante guide chacun de nos choix.",
    delay: 300,
  },
];

export default function StatsBand() {
  return (
    <div className="bg-brown px-[72px] py-[80px] relative overflow-hidden max-md:px-6 max-md:py-14">
      {/* Watermark */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant font-light text-white/[0.018] pointer-events-none select-none whitespace-nowrap tracking-[0.05em]"
        style={{ fontSize: "22vw" }}
      >
        BaytBio
      </span>

      {/* Header */}
      <Reveal>
        <p className="text-[0.68rem] tracking-[0.22em] uppercase text-terra-light/90 mb-14 flex items-center gap-3 before:content-[''] before:w-6 before:h-px before:bg-sand/20 before:shrink-0 max-md:mb-8">
          Nos engagements
        </p>
      </Reveal>

      {/* Engagements — ligne unique divisée en 4 */}
      <div className="grid grid-cols-4 divide-x divide-white/[0.06] max-md:grid-cols-1 max-md:divide-x-0 max-md:divide-y max-md:divide-white/[0.06]">
        {engagements.map((e, idx) => (
          <Reveal key={e.label} delay={e.delay}>
            <div className="group px-10 first:pl-0 last:pr-0 py-2 flex flex-col gap-5 transition-all duration-300 max-md:px-0 max-md:py-8">
              {/* Index discret */}
              <span className="font-cormorant text-[2rem] italic text-terracotta/50 tracking-wide transition-colors duration-300 group-hover:text-terracotta">
                0{idx + 1}
              </span>
              {/* Label */}
              <h3
                className="font-cormorant font-light text-cream leading-none transition-all duration-300 group-hover:text-terracotta"
                style={{ fontSize: "clamp(2rem, 2.8vw, 3rem)" }}
              >
                {e.label}
              </h3>
              {/* Séparateur animé */}
              <span className="block h-px bg-white/10 w-full origin-left scale-x-100 transition-all duration-500 group-hover:bg-terracotta/50" />
              {/* Description */}
              <p className="font-sans text-[0.8rem] font-light leading-[1.7] text-cream/60 transition-colors duration-300 group-hover:text-cream/90">
                {e.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}