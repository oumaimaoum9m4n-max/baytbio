import Reveal from "./Reveal";

const values = [
  {
    num: "01",
    numColor: "#d4883c",
    iconBg: "rgba(184,90,40,.1)",
    iconColor: "#d4883c",
    title: ["100% ", "Naturel"],
    ar: "طبيعي بالكامل",
    desc: "Aucun additif, aucun conservateur, aucun antibiotique, aucune hormone. Ce que nous produisons est exactement ce que la nature donne — ni plus, ni moins. C'est notre engagement le plus fondamental.",
    barBg: "rgba(184,90,40,.15)",
    barFill: "#d4883c",
    barWidth: "100%",
    delay: 0,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-6 h-6 block stroke-current fill-none stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <path
          d="M20 4c-5.5 0-10 4.5-10 10 0 3.3 2.7 6 6 6 5.5 0 10-4.5 10-10 0-3.3-2.7-6-6-6Z"
          transform="translate(-2 -2)"
        />
        <path d="M12 20c0-4.5 2.2-8.4 6-11" />
        <path d="M12 20c-1.8-4.2-4.7-7.1-8.5-8.8" />
      </svg>
    ),
  },
  {
    num: "02",
    numColor: "#163b26",
    iconBg: "rgba(60,73,38,.1)",
    iconColor: "#163b26",
    title: ["Famille ", "d'abord"],
    ar: "العائلة أولاً",
    desc: "Nous produisons ce que nous donnons à nos propres enfants. Si ce n'est pas assez bon pour eux, ce n'est pas assez bon pour vous. C'est notre test de qualité ultime — pas un label, pas un certificat.",
    barBg: "rgba(60,73,38,.15)",
    barFill: "#163b26",
    barWidth: "80%",
    delay: 100,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-6 h-6 block stroke-current fill-none stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-1.5a3.5 3.5 0 0 0-2.5-3.35" />
        <path d="M16.5 3.5a4 4 0 0 1 0 7.7" />
      </svg>
    ),
  },
  {
    num: "03",
    numColor: "#d4883c",
    iconBg: "rgba(200,144,26,.1)",
    iconColor: "#d4883c",
    title: ["Fièrement ", "Marocain"],
    ar: "فخورون بأصولنا",
    desc: "Produit localement, pour les familles marocaines. Nos recettes viennent de nos grand-mères, notre lait vient de nos prairies, nos livraisons couvrent nos villes. Tout ce que nous faisons est ancré dans notre terre.",
    barBg: "rgba(212,136,60,.15)",
    barFill: "#d4883c",
    barWidth: "95%",
    delay: 200,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-6 h-6 block stroke-current fill-none stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <path d="M6 20V9" />
        <path d="M6 9c1.5-1.2 3.1-1.8 4.8-1.8 1.4 0 2.8.4 4.2 1.2 1.5.8 3 .8 4.5 0V19c-1.5.8-3 .8-4.5 0-1.4-.8-2.8-1.2-4.2-1.2C9.1 17.8 7.5 18.4 6 19" />
        <path d="M6 9c-1.5.8-3 .8-4.5 0V19c1.5.8 3 .8 4.5 0" />
      </svg>
    ),
  },
  {
    num: "04",
    numColor: "#3d7a55",
    iconBg: "rgba(90,106,56,.1)",
    iconColor: "#3d7a55",
    title: ["", "Durable & responsable"],
    ar: "مستدام ومسؤول",
    desc: "Respect de l'environnement, bien-être animal, emballages recyclables. Nous construisons une ferme qui existera encore dans 50 ans — pour nos enfants et les leurs. La durabilité n'est pas une option pour nous, c'est une obligation morale.",
    barBg: "rgba(90,106,56,.15)",
    barFill: "#3d7a55",
    barWidth: "75%",
    delay: 300,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="w-6 h-6 block stroke-current fill-none stroke-[1.8] [stroke-linecap:round] [stroke-linejoin:round]"
      >
        <path d="M21 12a8.5 8.5 0 0 0-14.5-6" />
        <path d="M3 12a8.5 8.5 0 0 0 14.5 6" />
        <path d="M6 4v4h4" />
        <path d="M18 20v-4h-4" />
      </svg>
    ),
  },
];

export default function ValuesGrid() {
  return (
    <section className="bg-cream py-[112px] px-[72px] max-md:px-6 max-md:py-16">
      {/* Header */}
      <div className="grid grid-cols-2 gap-20 items-end mb-[72px] max-md:grid-cols-1 max-md:gap-5 max-md:mb-10">
        <div>
          <Reveal>
            <p className="text-[0.72rem] tracking-[0.22em] uppercase text-terracotta flex items-center gap-3.5 mb-5 before:content-[''] before:w-7 before:h-px before:bg-terracotta before:shrink-0">
              Ce en quoi nous croyons
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className="font-cormorant font-light leading-[1.06] text-brown"
              style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
            >
              Nos <em className="italic text-terracotta">valeurs.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.88] text-sand self-end">
            Ces valeurs ne sont pas des mots sur un site web. Ce sont les
            principes qui guident{" "}
            <strong className="text-brown font-normal">
              chaque décision que nous prenons
            </strong>
            , chaque matin, depuis 2018.
          </p>
        </Reveal>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-[2px] bg-linen max-md:grid-cols-1">
        {values.map((v) => (
          <Reveal key={v.num} delay={v.delay}>
            <div className="bg-[#f5edd8] px-[52px] py-14 relative overflow-hidden flex flex-col gap-5 transition-colors duration-300 hover:bg-cream group">
              {/* Number watermark */}
              <span
                aria-hidden="true"
                className="absolute top-7 right-10 font-cormorant text-[5rem] font-light leading-none opacity-[0.06] pointer-events-none"
                style={{ color: v.numColor }}
              >
                {v.num}
              </span>

              {/* Icon */}
              <div
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-[10deg] group-hover:scale-110"
                style={{ background: v.iconBg, color: v.iconColor }}
              >
                {v.icon}
              </div>

              {/* Title + Arabic */}
              <div>
                <div className="font-cormorant text-[1.8rem] font-normal text-brown leading-[1.1]">
                  {v.title[0]}
                  <em className="italic">{v.title[1]}</em>
                </div>
                <div
                  className="font-arabic text-[0.9rem] text-sand opacity-55 mt-0.5"
                  dir="rtl"
                >
                  {v.ar}
                </div>
              </div>

              {/* Description */}
              <p className="font-sans text-[0.84rem] font-light text-sand leading-[1.8]">
                {v.desc}
              </p>

              {/* Progress bar */}
              <div
                className="h-0.5 rounded-[1px] mt-2"
                style={{ background: v.barBg }}
              >
                <div
                  className="h-full rounded-[1px]"
                  style={{ width: v.barWidth, background: v.barFill }}
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
