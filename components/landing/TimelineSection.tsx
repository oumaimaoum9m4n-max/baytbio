import { type ReactNode } from "react";
import Reveal from "./Reveal";

interface TimelineEvent {
  step: string;
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
    step: "I",
    sub: "Le point de départ",
    milestoneLabel: "✦ L'idée",
    milestoneStyle: { bg: "rgba(212,136,60,.12)", color: "#d4883c", border: "rgba(212,136,60,.22)" },
    title: ["Une idée ", "simple"],
    desc: "Remettre le vrai goût au centre du quotidien.",
    ar: "فكرة بسيطة — إعادة الطعم الحقيقي",
    imgSrc: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=82&fit=crop",
    imgAlt: "L'idée fondatrice",
    imgCaption: "L'idée · L'origine",
    imgBg: "linear-gradient(145deg,#163b26,#2c2c2c)",
  },
  {
    step: "II",
    sub: "Le choix exigeant",
    milestoneLabel: "✦ La sélection",
    milestoneStyle: { bg: "rgba(61,122,85,.1)", color: "#3d7a55", border: "rgba(61,122,85,.2)" },
    title: ["Une sélection ", "exigeante"],
    desc: "Choisir des produits que nous serions fiers de servir à nos propres familles.",
    ar: "الاختيار الصارم — ما نختاره لعائلتنا",
    imgSrc: "https://images.unsplash.com/photo-1506484381205-f7945653044d?w=800&q=82&fit=crop",
    imgAlt: "Sélection rigoureuse",
    imgCaption: "La sélection · L'exigence",
    imgBg: "linear-gradient(145deg,#d4883c,#2c2c2c)",
  },
  {
    step: "III",
    sub: "La promesse",
    milestoneLabel: "✦ La qualité",
    milestoneStyle: { bg: "rgba(61,122,85,.1)", color: "#3d7a55", border: "rgba(61,122,85,.2)" },
    title: ["Un engagement ", "qualité"],
    desc: "Privilégier la fraîcheur, la simplicité et l'authenticité.",
    ar: "الجودة — التزامنا الثابت",
    imgSrc: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=82&fit=crop",
    imgAlt: "Engagement qualité",
    imgCaption: "La qualité · Notre promesse",
    imgBg: "linear-gradient(145deg,#3d7a55,#2c2c2c)",
  },
  {
    step: "IV",
    sub: "Le lien direct",
    milestoneLabel: "✦ La confiance",
    milestoneStyle: { bg: "rgba(176,106,40,.1)", color: "#b06a28", border: "rgba(176,106,40,.2)" },
    title: ["Une marque ", "de confiance"],
    desc: "Créer un lien plus direct entre le producteur et le consommateur.",
    ar: "الثقة — روابط حقيقية ومباشرة",
    imgSrc: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=82&fit=crop",
    imgAlt: "Confiance et transparence",
    imgCaption: "La confiance · La transparence",
    imgBg: "linear-gradient(145deg,#5A3C18,#241808)",
  },
  {
    step: "V",
    sub: "Les familles",
    milestoneLabel: "✦ La communauté",
    milestoneStyle: { bg: "rgba(184,90,40,.12)", color: "#d4883c", border: "rgba(184,90,40,.22)" },
    title: ["Une ", "communauté"],
    desc: "Grandir avec les familles qui partagent les mêmes valeurs.",
    ar: "مجتمع — عائلات تشترك في نفس القيم",
    imgSrc: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=82&fit=crop",
    imgAlt: "La communauté Bayt Bio",
    imgCaption: "La communauté · Aujourd'hui",
    imgBg: "linear-gradient(145deg,#163b26,#2c2c2c)",
  },
  {
    step: "VI",
    sub: "La suite",
    milestoneLabel: "✦ Demain",
    milestoneStyle: { bg: "rgba(61,122,85,.1)", color: "#3d7a55", border: "rgba(61,122,85,.2)" },
    title: ["", "Demain"],
    desc: "Continuer à développer une expérience toujours plus proche, plus naturelle et plus humaine.",
    ar: "الغد — تجربة أقرب وأكثر إنسانية",
    imgSrc: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=82&fit=crop",
    imgAlt: "L'avenir de Bayt Bio",
    imgCaption: "Bayt Bio · Demain",
    imgBg: "linear-gradient(145deg,#3d7a55,#2c2c2c)",
  },
];

export default function TimelineSection() {
  return (
    <section id="timeline-section" className="py-24 bg-cream relative overflow-hidden md:py-32 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-12 md:px-16 lg:px-24">

        {/* TITLE CENTER + DECORATION */}
        <div className="flex items-center justify-center mb-16 md:mb-24">

          {/* Left line */}
          <div className="hidden md:flex items-center flex-1 justify-end pr-6">
            <div className="h-px w-24 bg-terracotta/30" />
            <div className="h-2 w-2 rounded-full bg-terracotta/40 ml-3" />
          </div>

          {/* Title */}
          <Reveal delay={100}>
            <h2
              className="font-cormorant font-light leading-[1.06] text-brown text-center whitespace-nowrap px-6"
              style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
            >
              Notre{" "}
              <em className="italic text-terracotta">parcours</em>
            </h2>
          </Reveal>

          {/* Right line */}
          <div className="hidden md:flex items-center flex-1 justify-start pl-6">
            <div className="h-2 w-2 rounded-full bg-terracotta/40 mr-3" />
            <div className="h-px w-24 bg-terracotta/30" />
          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((ev, idx) => (
            <Reveal key={ev.step} delay={idx * 50}>
              <div className="group relative bg-white/[0.4] border border-linen rounded-sm p-8 lg:p-10 min-h-[300px] flex flex-col justify-between transition-all duration-500 hover:bg-white hover:border-terracotta/20 hover:shadow-[0_16px_40px_rgba(44,44,44,0.03)]">

                <div className="absolute top-4 right-8 font-cormorant text-[6.5rem] font-light leading-none text-brown/[0.04] select-none transition-colors duration-500 group-hover:text-terracotta/[0.05]">
                  {ev.step}
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-cream/80 border border-linen text-[0.62rem] font-medium tracking-[0.15em] uppercase text-sand rounded-sm mb-8 transition-colors duration-500 group-hover:border-terracotta/20 group-hover:text-terracotta">
                    {ev.milestoneLabel.replace("✦ ", "")}
                  </div>

                  <h3 className="font-cormorant text-[1.6rem] font-normal text-brown leading-snug mb-4">
                    {ev.title[0]}
                    {ev.title[1] && (
                      <em className="italic text-terracotta font-serif font-normal">
                        {ev.title[1]}
                      </em>
                    )}
                  </h3>
                </div>

                <div className="relative z-10 mt-auto pt-6 border-t border-linen/60 transition-colors duration-500 group-hover:border-linen">
                  <p className="font-sans text-[0.88rem] font-light leading-[1.75] text-sand transition-colors duration-500 group-hover:text-brown/90">
                    {ev.desc}
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