import Reveal from "./Reveal";

export default function OpeningQuote() {
  return (
    <div className="bg-cream px-[72px] py-24 grid grid-cols-[1fr_2fr] gap-20 items-center max-md:grid-cols-1 max-md:px-6 max-md:py-14 max-md:gap-8">
      {/* Vertical label */}
      <Reveal>
        <p className="font-sans text-[0.7rem] tracking-[0.22em] uppercase text-sand [writing-mode:vertical-lr] rotate-180 self-end pb-1 max-md:[writing-mode:horizontal-tb] max-md:rotate-0">
          Citation fondatrice
        </p>
      </Reveal>

      {/* Quote content */}
      <div>
        <Reveal>
          <span
            aria-hidden="true"
            className="font-cormorant text-terracotta/15 font-light block -mb-5"
            style={{ fontSize: "9rem", lineHeight: "0.7" }}
          >
            ❝
          </span>
        </Reveal>
        <Reveal delay={100}>
          <p
            className="font-cormorant text-brown font-light italic leading-[1.35] max-md:text-[clamp(1.4rem,5vw,2rem)]"
            style={{ fontSize: "clamp(1.8rem,3vw,3rem)" }}
          >
            Il était devenu impossible de trouver des œufs et du lait{" "}
            <em className="not-italic text-terracotta">vraiment frais</em> — comme ceux que nous avions
            grandi en dégustant chez nos grands-parents. Alors nous avons décidé de les faire nous-mêmes.
          </p>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-7 font-sans text-[0.78rem] text-sand font-light flex items-center gap-3.5 before:content-[''] before:w-8 before:h-px before:bg-sand before:shrink-0">
            — Youssef Tazi, fondateur de Bayt Bio
          </p>
        </Reveal>
      </div>
    </div>
  );
}
