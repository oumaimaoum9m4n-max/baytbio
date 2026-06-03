import { type ReactNode } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

interface TimelineEvent {
  year: string;
  sub: string;
  milestoneLabel: string;
  milestoneStyle: { bg: string; color: string; border: string };
  title: [string, string];
  desc: ReactNode;
  ar: string;
  imgSrc: string;
  imgAlt: string;
  imgCaption: string;
  imgBg: string;
}

const events: TimelineEvent[] = [
  {
    year: "2018",
    sub: "Le début",
    milestoneLabel: "✦ Fondation",
    milestoneStyle: {
      bg: "rgba(212,136,60,.12)",
      color: "#d4883c",
      border: "rgba(212,136,60,.22)",
    },
    title: ["La famille ", "plante ses racines"],
    desc: "Youssef et Fatima Tazi acquièrent 3 hectares de terrain aux abords de Casablanca. Premières poules arrivées, premiers plans de prairie plantés. La ferme n'a pas encore de nom — elle n'a que de l'espoir et beaucoup de travail à fournir.",
    ar: "بداية الرحلة — غرسنا الجذور",
    imgSrc: "/images/about/debut_ferme.png",
    imgAlt: "2018 - Les débuts",
    imgCaption: "Casablanca, 2018",
    imgBg: "linear-gradient(145deg,#163b26,#2c2c2c)",
  },
  {
    year: "2019",
    sub: "La première année",
    milestoneLabel: "✦ Premières récoltes",
    milestoneStyle: {
      bg: "rgba(61,122,85,.1)",
      color: "#3d7a55",
      border: "rgba(61,122,85,.2)",
    },
    title: ["Les premiers ", "œufs beldi"],
    desc: (
      <>
        Nos 50 premières poules commencent à pondre. Les premiers plateaux
        d&apos;œufs beldi sont livrés à la famille élargie et aux voisins. La
        réaction est unanime :{" "}
        <em>&ldquo;C&apos;est le goût de chez nous.&rdquo;</em> La conviction se
        transforme en certitude.
      </>
    ),
    ar: "البيض الأول — طعم الأصالة",
    imgSrc:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&q=82&fit=crop",
    imgAlt: "2019 - Premiers oeufs",
    imgCaption: "Les premières récoltes",
    imgBg: "linear-gradient(145deg,#d4883c,#2c2c2c)",
  },
  {
    year: "2020",
    sub: "Le lait arrive",
    milestoneLabel: "✦ Expansion",
    milestoneStyle: {
      bg: "rgba(61,122,85,.1)",
      color: "#3d7a55",
      border: "rgba(61,122,85,.2)",
    },
    title: ["Nos premières ", "vaches laitières"],
    desc: `Malgré une année difficile pour le monde entier, Bayt Bio accueille ses trois premières vaches. Le lait frais non pasteurisé est ajouté à l'offre. Les clients parlent de "retrouver le goût du lait de campagne" — exactement ce que nous voulions entendre.`,
    ar: "الحليب الطازج — مذاق الطفولة",
    imgSrc:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=82&fit=crop",
    imgAlt: "2020 - Lait frais",
    imgCaption: "Premières vaches · 2020",
    imgBg: "linear-gradient(145deg,#3d7a55,#2c2c2c)",
  },
  {
    year: "2022",
    sub: "L'artisanat",
    milestoneLabel: "✦ Savoir-faire artisanal",
    milestoneStyle: {
      bg: "rgba(176,106,40,.1)",
      color: "#b06a28",
      border: "rgba(176,106,40,.2)",
    },
    title: ["Fromages & yaourts ", "maison"],
    desc: "Notre production de lait nous permet d'aller plus loin. Avec les recettes de la mère de Youssef, nous lançons notre fromage beldi artisanal et notre yaourt fermenté 24h. Chaque pièce de fromage est façonnée à la main. Aucun raccourci industriel.",
    ar: "الجبن والزبادي — وصفات جدتنا",
    imgSrc:
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=800&q=82&fit=crop",
    imgAlt: "2022 - Fromages",
    imgCaption: "Fromage artisanal · 2022",
    imgBg: "linear-gradient(145deg,#5A3C18,#241808)",
  },
  {
    year: "2024–26",
    sub: "Et maintenant",
    milestoneLabel: "✦ Aujourd'hui",
    milestoneStyle: {
      bg: "rgba(184,90,40,.12)",
      color: "#d4883c",
      border: "rgba(184,90,40,.22)",
    },
    title: ["800+ familles, ", "une mission."],
    desc: "Aujourd'hui, plus de 800 familles à Casablanca et Rabat reçoivent leurs produits Bayt Bio chaque semaine. 200 poules, un troupeau de vaches, une cave d'affinage et une équipe de 8 personnes — tous unis autour d'une seule mission : vous livrer l'authenticité.",
    ar: "اليوم — ٨٠٠+ عائلة تثق بنا",
    imgSrc:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&q=82&fit=crop",
    imgAlt: "2024 - Bayt Bio aujourd'hui",
    imgCaption: "Bayt Bio · 2026",
    imgBg: "linear-gradient(145deg,#3d7a55,#2c2c2c)",
  },
];

export default function TimelineSection() {
  return (
    <section
      id="timeline-section"
      className="py-[112px] bg-cream relative overflow-hidden max-md:py-16"
    >
      {/* Header */}
      <div className="px-[72px] grid grid-cols-2 gap-20 items-end mb-20 max-md:grid-cols-1 max-md:px-6 max-md:gap-5 max-md:mb-10">
        <div>
          <Reveal>
            <p className="text-[0.72rem] tracking-[0.22em] uppercase text-terracotta flex items-center gap-3.5 mb-5 before:content-[''] before:w-7 before:h-px before:bg-terracotta before:shrink-0">
              Notre parcours
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className="font-cormorant font-light leading-[1.06] text-brown"
              style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
            >
              Six ans de <em className="italic text-terracotta">passion</em>
              <br />
              et de travail.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.88] text-sand self-end">
            Bayt Bio n&apos;est pas née d&apos;un business plan. Elle est née
            d&apos;une{" "}
            <strong className="text-brown font-normal">
              nostalgie du goût vrai
            </strong>{" "}
            et d&apos;une conviction profonde que l&apos;authenticité méritait
            d&apos;être défendue, une livraison à la fois.
          </p>
        </Reveal>
      </div>

      {/* Timeline */}
      <div className="px-[72px] relative max-md:px-6">
        {/* Center vertical line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-linen max-md:hidden"
          style={{ left: "calc(72px + 50% - 0.5px)" }}
        />

        {events.map((ev, idx) => {
          const isEven = (idx + 1) % 2 === 0;
          return (
            <div
              key={ev.year}
              className="grid gap-0 mb-16 items-start group max-md:block"
              style={{ gridTemplateColumns: "1fr 48px 1fr" }}
            >
              {/* TEXT */}
              <div
                className={`pt-2 ${isEven ? "order-3 pl-10 pr-0" : "order-1 px-10"} max-md:px-0 max-md:pb-10 max-md:order-none`}
              >
                <div
                  className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] uppercase px-3 py-1 rounded-full mb-3 w-fit border font-sans"
                  style={{
                    background: ev.milestoneStyle.bg,
                    color: ev.milestoneStyle.color,
                    borderColor: ev.milestoneStyle.border,
                  }}
                >
                  {ev.milestoneLabel}
                </div>
                <div className="font-cormorant text-[3.5rem] font-light text-terracotta leading-none mb-3 flex items-baseline gap-2">
                  {ev.year}
                  <small className="text-[1rem] text-sand font-sans font-light tracking-[0.06em]">
                    · {ev.sub}
                  </small>
                </div>
                <h3 className="font-cormorant text-[1.7rem] font-normal text-brown mb-3 leading-[1.15]">
                  {ev.title[0]}
                  <em className="italic text-terracotta">{ev.title[1]}</em>
                </h3>
                <p className="font-sans text-[0.86rem] font-light leading-[1.85] text-sand">
                  {ev.desc}
                </p>
                <p
                  className="font-arabic text-[0.92rem] text-[rgba(122,100,72,0.4)] mt-2"
                  dir="rtl"
                >
                  {ev.ar}
                </p>
              </div>

              {/* CENTER DOT */}
              <div className="flex flex-col items-center pt-3 relative z-10 order-2 max-md:hidden">
                <div className="w-4 h-4 rounded-full bg-cream border-2 border-terracotta shrink-0 transition-all duration-300 group-hover:bg-terracotta group-hover:scale-[1.3]" />
              </div>

              {/* VISUAL */}
              <div
                className={`${isEven ? "order-1 pl-0 pr-10" : "order-3 px-10"} max-md:hidden`}
              >
                <div
                  className="rounded-[4px] overflow-hidden h-[260px] relative"
                  style={{ background: ev.imgBg }}
                >
                  <Image
                    src={ev.imgSrc}
                    alt={ev.imgAlt}
                    fill
                    className="object-cover [filter:saturate(0.78)_contrast(1.06)] transition-transform duration-[800ms] group-hover:scale-[1.04]"
                  />
                  <span className="absolute bottom-3.5 left-3.5 font-sans text-[0.64rem] tracking-[0.14em] uppercase text-white/70 px-3 py-[5px] bg-[rgba(28,18,8,0.55)] backdrop-blur-sm rounded-[1px]">
                    {ev.imgCaption}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
