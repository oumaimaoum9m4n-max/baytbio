import { frenchCardinal } from "./utils";

interface ProductsPageHeaderProps {
  totalItems: number;
}

export default function ProductsPageHeader({
  totalItems,
}: ProductsPageHeaderProps) {
  const countWord = frenchCardinal(totalItems);
  const displayCount = totalItems > 0 ? totalItems : "—";

  return (
    <header className="relative flex min-h-[44vh] flex-col justify-end overflow-hidden bg-olive px-[72px] pb-16 pt-[100px] max-md:px-6 max-md:pb-12 max-md:pt-[100px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(184,90,40,0.18), transparent), radial-gradient(ellipse 50% 80% at 10% 90%, rgba(61,73,38,0.35), transparent)",
        }}
        aria-hidden
      />
      <p className="relative z-[1] mb-[18px] flex items-center gap-3.5 font-sans text-[0.72rem] font-normal uppercase tracking-[0.22em] text-[rgba(200,178,133,0.55)] before:h-px before:w-7 before:shrink-0 before:bg-sand before:content-['']">
        Bayt Bio · Casablanca
      </p>
      <h1 className="relative z-[1] font-cormorant text-[clamp(3.2rem,6vw,6.5rem)] font-light leading-none text-cream">
        Nos <em className="italic text-terra-light">produits.</em>
      </h1>
      <p className="relative z-[1] mt-5 max-w-[480px] font-sans text-[0.9rem] font-light leading-[1.75] text-[rgba(250,248,245,0.72)]">
        {totalItems > 0
          ? `${totalItems} produit${totalItems > 1 ? "s" : ""}, une obsession : la qualité absolue. Pas de catalogue infini — chaque produit est maîtrisé de l'étable à votre porte.`
          : "Cinq produits, une obsession : la qualité absolue. Pas de catalogue infini — chaque produit est maîtrisé de l'étable à votre porte."}
      </p>
      <div
        className="pointer-events-none absolute bottom-[-20px] right-14 select-none font-cormorant text-[28vw] font-light leading-none text-white/[0.025] max-md:right-6 max-md:text-[40vw]"
        aria-hidden
      >
        {displayCount}
      </div>
    </header>
  );
}
