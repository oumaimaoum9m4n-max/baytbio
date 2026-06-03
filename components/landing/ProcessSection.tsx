import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import ProcessStep from "./ProcessStep";

const steps = [
  { num: "01", time: "Chaque matin", title: "Récolte & Traite", desc: "Nous sélectionnons les produits avec attention dès leur arrivée." },
  { num: "02", time: "Contrôle", title: "Tri & Qualité", desc: "Chaque produit est vérifié pour garantir fraîcheur, aspect et conformité." },
  { num: "03", time: "Emballage", title: "Conditionnement", desc: "Les produits sont préparés avec soin pour préserver leur qualité." },
  { num: "04", time: "Livraison", title: "Chez vous", desc: "Livraison directement à votre porte. Paiement à la réception." },
];

export default function ProcessSection() {
  return (
    <section className="py-[120px] px-20 bg-olive relative overflow-hidden max-md:py-16 max-md:px-5">
      {/* Background text watermark */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant text-[22vw] font-light text-white/[0.02] pointer-events-none whitespace-nowrap select-none tracking-[0.05em]"
        aria-hidden="true"
      >
        BELDI
      </span>

      {/* Header */}
      <div className="grid grid-cols-2 gap-20 mb-20 items-end max-md:grid-cols-1 max-md:gap-6">
        <div>
          <Reveal>
            <SectionHeader
              dark
              eyebrow="De la ferme à votre porte"
              title={<>Comment ça<br /><em className="italic text-terra-light">fonctionne ?</em></>}
            />
          </Reveal>
        </div>
        <Reveal delay={200}>
          <p className="text-[0.95rem] leading-[1.85] text-cream/90 font-light">
            Chaque matin, nos fermiers se lèvent avant l'aube pour récolter les œufs frais et traire les vaches. Un
            processus simple, clair et pensé pour vous livrer des produits de qualité sans effort.
            <br />
            <br />
            Pas d'intermédiaire. Pas d'entrepôt frigorifique. Juste la fraîcheur directe.
          </p>
        </Reveal>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-4 gap-px bg-white/[0.06] max-md:grid-cols-2 max-[480px]:grid-cols-1">
        {steps.map((s, i) => (
          <ProcessStep key={s.num} {...s} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
