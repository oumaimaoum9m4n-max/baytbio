import Reveal from "./Reveal";
import { WHATSAPP_URL } from "./constants";

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function CTASection() {
  return (
    <section className="bg-olive py-[100px] px-20 grid grid-cols-[1fr_auto] gap-20 items-center relative overflow-hidden max-md:grid-cols-1 max-md:py-16 max-md:px-6 max-md:gap-10">
      {/* Decorative circles */}
      <span className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full bg-white/[0.03] pointer-events-none" />
      <span className="absolute right-[100px] -bottom-[120px] w-[300px] h-[300px] rounded-full bg-white/[0.03] pointer-events-none" />

      <div className="w-full">
        <Reveal>
          <p className="text-[0.72rem] tracking-[0.22em] uppercase text-cream/50 font-normal mb-3.5 flex items-center gap-3.5 before:content-[''] before:w-8 before:h-px before:bg-cream/30 before:shrink-0">
            Prêt à goûter la différence ?
          </p>
        </Reveal>
        
        <Reveal delay={100}>
          <h2 className="font-cormorant text-[clamp(2.4rem,3.5vw,3.8rem)] font-light leading-[1.1] text-cream mb-8">
            Commandez <em className="italic text-terra-light">maintenant</em>,<br />livré demain matin
          </h2>
        </Reveal>

        {/* Ligne bilingue unifiée (Split gauche / droite) */}
        <Reveal delay={200}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-white/10 pt-6">
            
            {/* Côté Gauche : Marque + Texte Français */}
            <div className="max-w-[480px] space-y-2">
              <span className="block font-sans font-medium text-[0.85rem] tracking-wider text-terra-light uppercase">
                Bayt Bio <span className="text-cream/30 font-light mx-1">|</span> بيت بيو
              </span>
              <p className="text-cream/70 leading-relaxed text-[0.95rem] font-light">
                Retrouvez une sélection de produits naturels choisis avec soin pour accompagner votre quotidien.
              </p>
            </div>

            {/* Côté Droit : Slogan Arabe */}
            <div className="text-right shrink-0" dir="rtl">
              <p className="font-arabic text-[1.25rem] font-medium leading-none text-cream/90 tracking-wide md:mb-1">
                خيرات بلادي، توصل حتى لعندك عادي
              </p>
            </div>

          </div>
        </Reveal>
      </div>

      <Reveal direction="right" className="flex flex-col gap-3.5 shrink-0 max-md:flex-row max-md:flex-wrap w-full md:w-auto">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-10 py-[18px] bg-[#25d366] text-white font-sans text-[0.85rem] tracking-[0.1em] uppercase rounded-[2px] transition-all duration-300 hover:bg-[#1db954] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,211,102,0.35)] whitespace-nowrap max-md:flex-1 max-md:justify-center"
        >
          <WhatsAppIcon />
          Commander par WhatsApp
        </a>
        <a
          href="#all-products"
          className="inline-block px-10 py-[18px] bg-transparent text-cream border border-cream/30 font-sans text-[0.85rem] tracking-[0.1em] uppercase rounded-[2px] transition-all duration-300 hover:border-cream hover:bg-cream/10 text-center whitespace-nowrap max-md:flex-1 max-[480px]:flex-none max-[480px]:w-full"
        >
          Voir nos produits &rarr;
        </a>
      </Reveal>
    </section>
  );
}