import Reveal from "./Reveal";

const steps = [
  {
    num: "01",
    title: "Lever du jour",
    desc: "La journée commence avec les premiers rayons du soleil.",
    delay: 0,
  },
  {
    num: "02",
    title: "Sélection",
    desc: "Chaque produit est choisi avec soin et attention.",
    delay: 100,
  },
  {
    num: "03",
    title: "Préparation",
    desc: "La fraîcheur est préservée à chaque étape.",
    delay: 200,
  },
  {
    num: "04",
    title: "Contrôle qualité",
    desc: "Nous veillons à maintenir les standards qui font notre exigence.",
    delay: 300,
  },
  {
    num: "05",
    title: "Livraison",
    desc: "Les produits poursuivent leur route jusqu'à votre table.",
    delay: 400,
  },
];

export default function DayInLife() {
  return (
    <section className="bg-cream py-[60px] px-[72px] max-md:px-6 max-md:py-16">

      {/* HEADER WITH DECORATION */}
      <div className="flex items-center justify-center mb-[80px] max-md:flex-col max-md:gap-5 max-md:mb-12">

        {/* Left decoration */}
        <div className="hidden md:flex items-center flex-1 justify-end pr-6">
          <div className="h-px w-24 bg-linen" />
          <div className="h-2 w-2 rounded-full bg-terracotta/40 ml-3" />
        </div>

        {/* Title */}
        <Reveal delay={100}>
          <h2
            className="font-cormorant font-light leading-[1.06] text-brown text-center px-6"
            style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
          >
            Une journée au rythme{" "}
            <em className="italic text-terracotta">de la nature.</em>
          </h2>
        </Reveal>

        {/* Right decoration */}
        <div className="hidden md:flex items-center flex-1 justify-start pl-6">
          <div className="h-2 w-2 rounded-full bg-terracotta/40 mr-3" />
          <div className="h-px w-24 bg-linen" />
        </div>

      </div>

      {/* STEPS — horizontal */}
      <div className="relative">

        {/* LINE */}
        <div className="absolute top-[22px] left-0 right-0 h-px bg-linen max-md:hidden" />

        <div className="grid grid-cols-5 gap-6 max-md:grid-cols-1 max-md:gap-0">
          {steps.map((step) => (
            <Reveal key={step.num} delay={step.delay}>
              <div className="group flex flex-col pt-0 max-md:flex-row max-md:gap-5 max-md:border-b max-md:border-linen max-md:py-6 max-md:last:border-b-0">

                {/* DOT */}
                <div className="w-[22px] h-[22px] rounded-full border-2 border-linen bg-cream shrink-0 transition-all duration-300 group-hover:border-terracotta group-hover:bg-terracotta relative z-10 mb-7 max-md:mb-0 max-md:mt-1" />

                {/* CONTENT */}
                <div>
                  <span className="block font-cormorant italic text-[0.85rem] text-terracotta/50 mb-2 transition-colors duration-200 group-hover:text-terracotta">
                    {step.num}
                  </span>

                  <h3 className="font-cormorant text-[1.3rem] font-normal text-brown leading-[1.15] mb-2 transition-colors duration-200 group-hover:text-terracotta">
                    {step.title}
                  </h3>

                  <p className="font-sans text-[0.78rem] font-light text-sand leading-[1.7]">
                    {step.desc}
                  </p>
                </div>

              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}