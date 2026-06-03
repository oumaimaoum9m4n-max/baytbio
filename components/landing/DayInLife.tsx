import Reveal from "./Reveal";

const steps = [
  {
    num: "01",
    time: "5h00",
    title: "Lever & Récolte",
    desc: "Les fermiers récoltent les œufs encore chauds, un par un, à la main.",
    iconBg: "rgba(184,90,40,.1)",
    delay: 0,
  },
  {
    num: "02",
    time: "6h00",
    title: "Traite des vaches",
    desc: "Traite manuelle dans le calme du petit matin. Le lait est mis en bouteille immédiatement.",
    iconBg: "rgba(90,106,56,.1)",
    delay: 100,
  },
  {
    num: "03",
    time: "7h00",
    title: "Inspection & tri",
    desc: "Chaque œuf est inspecté à contre-jour. Le lait est analysé. Seul le meilleur part.",
    iconBg: "rgba(200,144,26,.1)",
    delay: 200,
  },
  {
    num: "04",
    time: "8h00",
    title: "Emballage",
    desc: "Mise en plateaux recyclables, étiquetage avec date et lot. Prêt pour la route.",
    iconBg: "rgba(184,112,48,.1)",
    delay: 300,
  },
  {
    num: "05",
    time: "9h–12h",
    title: "Livraison chez vous",
    desc: "En camion isotherme à travers Casablanca et Rabat. Frais garanti à votre porte.",
    iconBg: "rgba(90,106,56,.1)",
    delay: 400,
  },
];

export default function DayInLife() {
  return (
    <section className="bg-cream py-[112px] px-[72px] max-md:px-6 max-md:py-16">
      {/* Header */}
      <div className="grid grid-cols-2 gap-20 items-end mb-[72px] max-md:grid-cols-1 max-md:gap-5 max-md:mb-10">
        <div>
          <Reveal>
            <p className="text-[0.72rem] tracking-[0.22em] uppercase text-terracotta flex items-center gap-3.5 mb-5 before:content-[''] before:w-7 before:h-px before:bg-terracotta before:shrink-0">
              5h00 → 12h00
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className="font-cormorant font-light leading-[1.06] text-brown"
              style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
            >
              Une journée à <em className="italic text-terracotta">la ferme.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.88] text-sand self-end">
            Entre le lever du soleil et votre table, il se passe{" "}
            <strong className="text-brown font-normal">des heures de travail silencieux</strong>. Voici ce
            que nos fermiers font chaque matin pendant que vous dormez encore.
          </p>
        </Reveal>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-5 relative max-md:grid-cols-1 max-md:gap-8">
        {/* Connecting line — desktop only */}
        <div className="absolute top-7 left-7 right-7 h-px bg-linen z-0 max-md:hidden" />

        {steps.map((step) => (
          <Reveal
            key={step.num}
            delay={step.delay}
            className="flex flex-col items-center text-center relative z-10 px-4 transition-transform duration-300 hover:-translate-y-[6px]"
          >
            {/* Icon circle */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-cormorant text-[1.35rem] font-medium text-terra-light mb-5 transition-all duration-300 relative"
              style={{ background: step.iconBg }}
            >
              {/* Connector below */}
              <span className="absolute left-1/2 top-full w-px h-[18px] bg-linen -translate-x-1/2 max-md:hidden" />
              {step.num}
            </div>
            <div className="font-sans text-[0.66rem] tracking-[0.18em] uppercase text-terracotta mb-1.5 font-normal">
              {step.time}
            </div>
            <div className="font-cormorant text-[1.15rem] font-normal text-brown mb-1.5 leading-[1.15]">
              {step.title}
            </div>
            <p className="font-sans text-[0.76rem] font-light text-sand leading-[1.65]">{step.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
