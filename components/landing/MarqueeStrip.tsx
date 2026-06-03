const DEFAULT_ITEMS = [
  "Livraison Express Casa & Rabat",
  "Produits 100% Naturels",
  "Paiement à la livraison",
  "Trait chaque matin à l'aube",
  "Satisfait ou remboursé",
  "Certifié sans antibiotiques",
  "من المزرعة لمائدتك",
];

interface MarqueeRowProps {
  items: string[];
}

function MarqueeRow({ items }: MarqueeRowProps) {
  return (
    <div className="flex items-center whitespace-nowrap text-[0.75rem] tracking-[0.2em] uppercase text-cream font-light px-12 gap-12">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-12">
          {item}
          <span className="w-1 h-1 bg-cream/50 rounded-full shrink-0" />
        </span>
      ))}
    </div>
  );
}

interface MarqueeStripProps {
  items?: string[];
}

export default function MarqueeStrip({ items }: MarqueeStripProps = {}) {
  const list = items ?? DEFAULT_ITEMS;
  return (
    <div className="bg-terracotta py-3.5 overflow-hidden">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        <MarqueeRow items={list} />
        <MarqueeRow items={list} />
      </div>
    </div>
  );
}
