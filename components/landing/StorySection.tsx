import Image from "next/image";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

export default function StorySection() {
  return (
    <section
      id="story"
      className="grid grid-cols-2 min-h-[80vh] max-md:grid-cols-1"
    >
      {/* Image side */}
      <div className="relative overflow-hidden group max-md:min-h-[300px]">
        <Image
          src="/images/ferme.png"
          alt="Notre ferme"
          fill
          sizes="50vw"
          className="object-cover transition-transform duration-[10s] ease-linear group-hover:scale-[1.04] [filter:saturate(0.92)_sepia(0.04)_contrast(1.04)]"
        />
        {/* fade-to-cream gradient on the right edge */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, transparent 60%, rgb(250 248 245 / 74%))",
          }}
        />
      </div>

      {/* Text side */}
      <div className="bg-cream px-16 py-[100px] max-md:px-6 max-md:py-16 flex flex-col justify-center relative">
        {/* Decorative quote mark */}
        <span
          className="absolute top-12 left-[60px] font-cormorant text-[12rem] text-terracotta/[0.08] leading-none pointer-events-none"
          aria-hidden="true"
        >
          "
        </span>

        <Reveal>
          <SectionHeader
            eyebrow="Notre Histoire"
            title={
              <>
                Une{" "}
                <em className="italic text-terracotta">passion familiale</em>
               
              </>
            }
          />
        </Reveal>

        <Reveal delay={200}>
          <p className="text-[1.05rem] leading-[1.9] text-sand font-light mt-8 mb-10 max-w-[480px] text-justify">
            Bayt Bio est né d’une idée simple : remettre{" "}
            <strong className="text-brown font-normal">
               le vrai goût au centre du quotidien.
            </strong>{" "}
            Depuis nos débuts, nous avançons avec la même exigence :
             proposer des produits naturels, frais et sincères, dans le respect de la terre, 
             de la tradition et des familles qui nous font confiance.
            <br /> <br />
            Nous croyons qu’un bon produit {" "}
            <strong className="text-brown font-normal">
              ne doit pas seulement nourrir.
            </strong>
            Il doit rassurer, rassembler et rappeler les choses simples qui comptent vraiment.

            .
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="font-cormorant text-[1.8rem] italic text-terracotta mb-2">
            Le goût vrai. La qualité sans compromis.

          </div>
          <div
            dir="rtl"
            className="font-arabic text-[0.95rem] text-sand text-right mt-8 mb-10 max-w-[480px]"
          >
            من الأصل… كنرجعو ليكم خيرات بلادنا، كيفما خاصها تكون.
          </div>
        </Reveal>

        <Reveal delay={400} className="mt-12">
          <a
            href="/about"
            className="inline-block px-9 py-4 bg-terracotta text-cream font-sans text-[0.82rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:bg-terra-light hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,136,60,0.35)]"
          >
            Découvrir notre ferme →
          </a>
        </Reveal>

        {/* Floating stat cards */}
        <Reveal
          direction="right"
          className="absolute top-16 -right-5 max-md:hidden"
        >
          <div className="bg-olive text-cream px-8 py-6 rounded-[3px]">
            <div className="font-cormorant text-[2.4rem] font-light leading-none text-terra-light">
              800+
            </div>
            <div className="text-[0.72rem] tracking-[0.12em] uppercase text-sand mt-1">
              Familles fidèles
            </div>
          </div>
        </Reveal>
        <Reveal
          direction="right"
          delay={200}
          className="absolute bottom-20 -right-5 max-md:hidden"
        >
          <div className="bg-olive text-cream px-8 py-6 rounded-[3px]">
            <div className="font-cormorant text-[2.4rem] font-light leading-none text-terra-light">
              6ans
            </div>
            <div className="text-[0.72rem] tracking-[0.12em] uppercase text-sand mt-1">
              D'expérience
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
