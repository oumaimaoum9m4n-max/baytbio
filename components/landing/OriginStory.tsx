import Image from "next/image";
import Reveal from "./Reveal";
import Counter from "./Counter";

export default function OriginStory() {
  return (
    <section className="grid grid-cols-2 min-h-[90vh] max-md:grid-cols-1">
      {/* ── IMAGE LEFT ── */}
      <Reveal
        direction="left"
        className="relative overflow-hidden max-md:min-h-[280px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-olive to-brown" />
        <Image
          src="/images/about/famille_ferme.png"
          alt="La ferme familiale"
          fill
          className="object-cover [filter:saturate(0.72)_sepia(0.1)_contrast(1.1)_brightness(0.92)] transition-transform duration-[12000ms] ease-linear hover:scale-[1.04]"
        />
        {/* Cream right-edge fade */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent 55%, #faf8f5)" }}
        />
      </Reveal>

      {/* ── TEXT RIGHT ── */}
      <div className="bg-cream pt-24 pb-24 pr-20 pl-16 flex flex-col justify-center relative max-md:px-6 max-md:py-14">
        {/* Ghost quote mark */}
        <span
          aria-hidden="true"
          className="absolute top-10 left-14 font-cormorant text-[14rem] text-[rgba(184,90,40,0.06)] leading-none pointer-events-none select-none max-md:hidden"
        >
          &quot;
        </span>

        {/* <Reveal>
          <p className="text-[0.72rem] tracking-[0.22em] uppercase text-terracotta flex items-center gap-3.5 mb-5 before:content-[''] before:w-7 before:h-px before:bg-terracotta before:shrink-0">
            Pourquoi Bayt Bio ?
          </p>
        </Reveal> */}
        <Reveal delay={100}>
          <h2
            className="font-cormorant font-light leading-[1.06] text-brown mb-7"
            style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
          >
            Retourner aux <em className="italic text-terracotta">sources.</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.92] text-sand mb-5 text-justify">
            Dans un monde où tout va plus vite, nous avons choisi de revenir à l'essentiel.
          {" "}
            <strong className="text-brown font-normal"> </strong>
          
          </p>
        </Reveal>
        <Reveal delay={300}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.92] text-sand mb-5 text-justify">
            Bayt Bio est né d'une conviction simple : les produits du quotidien méritent autant d'attention que les grands moments.
          </p>
        </Reveal>
        <Reveal delay={400}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.92] text-sand mb-5 text-justify">
            Chaque œuf, chaque bouteille de lait, chaque verre de lben ou chaque morceau de beurre raconte la même histoire : celle d'un retour à l'authentique.

          </p>
        </Reveal>
        <Reveal delay={500}>
          <p className="font-sans text-[0.92rem] font-light leading-[1.92] text-sand mb-5 text-justify">
            Parce que nous croyons que le vrai goût commence toujours à la source.

          </p>
        </Reveal>
        {/* <Reveal delay={500}>
          <p className="font-cormorant text-[2rem] italic text-terracotta mt-9 mb-1">La famille Tazi</p>
          <p className="font-sans text-[0.72rem] tracking-[0.16em] uppercase text-sand">
            Fondateurs · Casablanca, 2018
          </p>
        </Reveal> */}

        {/* Floating stat cards — positioned absolutely outside the text panel */}
        {/* <div className="absolute top-20 -right-4 bg-brown text-cream rounded-sm z-10 max-md:hidden px-7 py-[22px]">
          <div className="font-cormorant text-[2.6rem] font-light text-terra-light leading-none">
            <Counter to={800} suffix="+" />
          </div>
          <div className="font-sans text-[0.68rem] tracking-[0.1em] uppercase text-sand mt-1">
            Familles fidèles
          </div>
        </div> */}
        {/* <div className="absolute bottom-[100px] -right-4 bg-brown text-cream rounded-sm z-10 max-md:hidden px-7 py-[22px]">
          <div className="font-cormorant text-[2.6rem] font-light text-terra-light leading-none">
            <Counter to={6} suffix=" ans" />
          </div>
          <div className="font-sans text-[0.68rem] tracking-[0.1em] uppercase text-sand mt-1">
            D&apos;expérience
          </div>
        </div> */}
      </div>
    </section>
  );
}
