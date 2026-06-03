import Reveal from "./Reveal";

export default function PullQuote() {
  return (
    <div className="bg-olive py-[100px] px-[72px] grid grid-cols-[1fr_2fr] gap-20 items-center relative overflow-hidden max-md:grid-cols-1 max-md:px-6 max-md:py-16 max-md:gap-8">
      {/* Decorative circles */}
      <span className="absolute -right-[60px] -top-[60px] w-[360px] h-[360px] rounded-full bg-white/[0.03] pointer-events-none" />
      <span className="absolute left-20 -bottom-20 w-[260px] h-[260px] rounded-full bg-white/[0.03] pointer-events-none" />

      {/* Author left */}
      <Reveal>
        <p className="font-sans text-[0.68rem] tracking-[0.22em] uppercase text-[rgba(200,178,133,0.4)] mb-5 flex items-center gap-3 before:content-[''] before:w-6 before:h-px before:bg-[rgba(200,178,133,0.3)] before:shrink-0">
          Fondatrice
        </p>
        <p className="font-cormorant text-[2rem] italic text-cream mb-1">Fatima Tazi</p>
        <p className="font-sans text-[0.76rem] tracking-[0.1em] uppercase text-sand font-light">
          Co-fondatrice &amp; Responsable qualité
        </p>
      </Reveal>

      {/* Blockquote right */}
      <Reveal delay={200}>
        <blockquote
          className="font-cormorant font-light leading-[1.38] text-cream italic relative z-10"
          style={{ fontSize: "clamp(1.7rem,2.8vw,2.8rem)" }}
        >
          &ldquo;Chaque matin à 5h, quand je ramasse les premiers œufs encore chauds, je pense aux familles
          qui vont les manger au petit-déjeuner.{" "}
          <em className="not-italic text-terra-light">
            C&apos;est pour elles que nous nous levons si tôt.
          </em>{" "}
          C&apos;est notre raison d&apos;être.&rdquo;
          <span
            className="font-arabic text-[1.1rem] text-[rgba(200,178,133,0.3)] mt-[18px] block"
            dir="rtl"
          >
            كل صباح، حين أجمع البيض الدافئ، أفكر في العائلات التي ستأكله على الإفطار
          </span>
        </blockquote>
      </Reveal>
    </div>
  );
}
