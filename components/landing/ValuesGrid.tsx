import Reveal from "./Reveal";

const values = [
  {
    num: "01",
    title: ["", "Authenticité"],
    desc: "Nous croyons au goût vrai et aux choses simples. Chaque produit que nous sélectionnons reflète cette conviction : rien d'artificiel, rien de superflu. Juste l'essentiel, tel qu'il devrait être.",
    delay: 0,
  },
  {
    num: "02",
    title: ["", "Famille"],
    desc: "Chaque produit est pensé pour être partagé autour de moments précieux. Nous sélectionnons ce que nous serions fiers de servir à nos propres familles — pas un label, pas une promesse creuse.",
    delay: 100,
  },
  {
    num: "03",
    title: ["", "Proximité"],
    desc: "Créer un lien plus direct entre l'origine et votre quotidien. Moins d'intermédiaires, plus de transparence. Nous savons d'où vient chaque produit — et nous vous le disons.",
    delay: 200,
  },
  {
    num: "04",
    title: ["Qualité ", "responsable"],
    desc: "Privilégier la qualité avant la quantité. Une exigence constante guide chacun de nos choix — du producteur à votre porte. Parce que bien manger est un droit, pas un luxe.",
    delay: 300,
  },
];

export default function ValuesGrid() {
  return (
    <section className="bg-cream py-[60px] px-[72px] max-md:px-6 max-md:py-16">

      {/* HEADER WITH DECORATION */}
      <div className="flex items-center justify-center mb-16 max-md:flex-col max-md:gap-5 max-md:mb-10">

        {/* Left decoration */}
        <div className="hidden md:flex items-center flex-1 justify-end pr-6">
          <div className="h-px w-24 bg-linen" />
          <div className="h-2 w-2 rounded-full bg-terracotta/40 ml-3" />
        </div>

        {/* Title */}
        <Reveal delay={100}>
          <h2
            className="font-cormorant font-light text-brown text-center px-6"
            style={{ fontSize: "clamp(1.8rem,2.5vw,2.6rem)" }}
          >
            Nos <em className="italic text-terracotta">valeurs.</em>
          </h2>
        </Reveal>

        {/* Right decoration */}
        <div className="hidden md:flex items-center flex-1 justify-start pl-6">
          <div className="h-2 w-2 rounded-full bg-terracotta/40 mr-3" />
          <div className="h-px w-24 bg-linen" />
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-[1px] bg-linen max-md:grid-cols-1">
        {values.map((v) => (
          <Reveal key={v.num} delay={v.delay}>
            <div
              className="bg-cream grid items-start py-10 px-10 transition-all duration-200 group hover:bg-[rgba(245,237,216,0.7)] max-md:px-0"
              style={{ gridTemplateColumns: "64px 1fr" }}
            >
              {/* Number */}
              <div className="font-cormorant font-light text-[3rem] leading-none text-sand opacity-25 transition-all duration-200 group-hover:opacity-100 group-hover:text-terracotta">
                {v.num}
              </div>

              {/* Body */}
              <div className="pt-1.5">
                <div className="font-cormorant text-[1.55rem] font-normal text-brown leading-[1.15] mb-3">
                  {v.title[0]}
                  <em className="italic">{v.title[1]}</em>
                </div>

                <p className="font-sans text-[0.83rem] font-light text-sand leading-[1.78]">
                  {v.desc}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

    </section>
  );
}