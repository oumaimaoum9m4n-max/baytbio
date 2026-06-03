import Image from "next/image";
import Reveal from "./Reveal";

const rightCells = [
  {
    src: "/images/about/vaches_ferme.png",
    alt: "Nos vaches",
    caption: "Nos vaches laitières",
    bg: "linear-gradient(145deg,#d4883c,#2c2c2c)",
    delay: 0,
  },
  {
    src: "/images/about/poules_ferme.png",
    alt: "Nos poules",
    caption: "Nos poules en plein air",
    bg: "linear-gradient(145deg,#163b26,#2c2c2c)",
    delay: 100,
  },
  {
    src: "/images/about/fromage_ferme.png",
    alt: "La cave d'affinage",
    caption: "Cave d'affinage · fromages",
    bg: "linear-gradient(145deg,#3d7a55,#2c2c2c)",
    delay: 100,
  },
  {
    src: "/images/about/prairies_ferme.png",
    alt: "Les prairies",
    caption: "Les prairies verdoyantes",
    bg: "linear-gradient(145deg,#163b26,#2c2c2c)",
    delay: 200,
  },
];

export default function FarmMosaic() {
  return (
    <section className="pt-[112px] bg-cream max-md:pt-16">
      {/* Header */}
      <div className="px-[72px] pb-16 grid grid-cols-2 gap-20 items-end max-md:grid-cols-1 max-md:px-6 max-md:pb-10 max-md:gap-5">
        <div>
          <Reveal>
            <p className="text-[0.72rem] tracking-[0.22em] uppercase text-terracotta flex items-center gap-3.5 mb-5 before:content-[''] before:w-7 before:h-px before:bg-terracotta before:shrink-0">
              Notre ferme
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2
              className="font-cormorant font-light leading-[1.06] text-brown"
              style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
            >
              3 hectares de{" "}
              <em className="italic text-terracotta">nature vraie.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.88] text-sand">
            Située aux abords de Casablanca, notre ferme s&apos;étend sur
            plusieurs hectares de terrain verdoyant. Nos poules{" "}
            <strong className="text-brown font-normal">
              picorent librement
            </strong>{" "}
            sous le soleil marocain. Nos vaches{" "}
            <strong className="text-brown font-normal">
              paissent dans des prairies fraîches
            </strong>
            , loin de tout produit chimique. La nature fait le travail — nous,
            on l&apos;accompagne avec soin.
          </p>
        </Reveal>
      </div>

      {/* Mosaic — full bleed */}
      <div
        className="grid gap-[3px] max-md:grid-cols-1 max-md:[grid-template-rows:auto]"
        style={{
          gridTemplateColumns: "1.4fr 1fr 1fr",
          gridTemplateRows: "360px 260px",
        }}
      >
        {/* Tall left cell — wrapper handles the gridRow span */}
        <div
          className="relative overflow-hidden bg-linen group max-md:h-[240px] max-md:row-auto"
          style={{ gridRow: "1/3" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(145deg,#163b26,#2c2c2c)" }}
          />
          <Image
            src="/images/about/hectares_ferme.png"
            alt="La prairie"
            fill
            className="object-cover [filter:saturate(0.78)_contrast(1.08)_brightness(0.96)] transition duration-[1200ms] group-hover:scale-[1.06] group-hover:[filter:saturate(0.92)_brightness(1)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,18,8,0.7)] to-transparent pointer-events-none z-10" />
          <span className="absolute bottom-5 left-5 z-20 font-cormorant text-[1.2rem] font-light text-cream italic">
            La prairie · 3 hectares
          </span>
        </div>

        {/* Right cells */}
        {rightCells.map((cell) => (
          <Reveal
            key={cell.alt}
            delay={cell.delay}
            className="relative overflow-hidden bg-linen group max-md:h-[240px]"
          >
            <div className="absolute inset-0" style={{ background: cell.bg }} />
            <Image
              src={cell.src}
              alt={cell.alt}
              fill
              className="object-cover [filter:saturate(0.78)_contrast(1.08)_brightness(0.96)] transition duration-[1200ms] group-hover:scale-[1.06] group-hover:[filter:saturate(0.92)_brightness(1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,18,8,0.7)] to-transparent pointer-events-none z-10" />
            <span className="absolute bottom-5 left-5 z-20 font-cormorant text-[1.2rem] font-light text-cream italic">
              {cell.caption}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
