import Reveal from "./Reveal";

export default function FarmMosaic() {
  return (
    <section className="relative bg-cream pt-20 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 md:px-16">

        {/* Le Conteneur Monolithe */}
        <div className="relative bg-brown text-cream rounded-3xl p-8 sm:p-12 md:p-20 lg:p-28 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Effet de texture géométrique en arrière-plan */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Colonne Gauche : Surtitre et Titre Impactant (Lg: 7 colonnes) */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <Reveal delay={100}>
              <h2 className="font-cormorant text-[clamp(3rem,6vw,5.8rem)] font-light leading-[1.1] text-cream">
                 Là où <em className="italic text-terra-light">tout</em>,
                <br />
                commence.
              </h2>
            </Reveal>

          
          </div>

          {/* Colonne Droite : Le Bloc Narratif (Lg: 5 colonnes) */}
          <div className="lg:col-span-5 space-y-8 relative z-10 border-t lg:border-t-0 lg:border-l border-cream/10 pt-8 lg:pt-0 lg:pl-12">
            <Reveal delay={200}>
              <div className="space-y-4 font-sans text-[0.95rem] font-light leading-[1.75] text-linen/80">
                <p>
                  Avant d'arriver chez vous, chaque produit suit un parcours unique guidé par le{" "}
                  <strong className="text-white font-normal underline decoration-terracotta decoration-2 underline-offset-4">
                    respect du naturel
                  </strong>.
                </p>
                <p>
                  La terre, le temps et le savoir-faire restent ancrés comme les piliers de notre démarche.
                </p>
              </div>
            </Reveal>

            {/* Citation en exergue style Manifeste */}
            <Reveal delay={300}>
              <div className="bg-cream/5 border-l-2 border-terracotta p-4 rounded-r-lg">
                <p className="font-cormorant text-[1.15rem] italic text-cream/90 leading-relaxed">
                  « Parce que la qualité ne se crée pas à la fin du parcours — elle commence à l'origine. »
                </p>
              </div>
            </Reveal>
          </div>

        </div>

      </div>
    </section>
  );
}