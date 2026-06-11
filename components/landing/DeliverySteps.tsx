"use client";

import Reveal from "./Reveal";

const JOURNEY = [
  {
    hour: "21:00",
    title: "Commande confirmée",
    text: "Vous passez votre commande via WhatsApp en quelques secondes.",
  },
  {
    hour: "05:00",
    title: "Récolte du matin",
    text: "Les œufs sont récoltés et les produits préparés dès l'aube.",
  },
  {
    hour: "08:00",
    title: "Préparation",
    text: "Chaque commande est vérifiée et emballée avec soin.",
  },
  {
    hour: "09:30",
    title: "Départ",
    text: "Les tournées de livraison commencent.",
  },
  {
    hour: "Avant midi",
    title: "Chez vous",
    text: "Des produits frais directement à votre porte.",
  },
];

export default function DeliverySteps() {
  return (
    <section className="bg-cream px-[72px] py-28 max-md:px-6">
      <Reveal>
        <div className="text-center mb-20">
          <p className="font-sans text-[0.72rem] tracking-[0.22em] uppercase text-sand mb-4">
            Notre processus
          </p>

          <h2
            className="font-cormorant font-light text-brown"
            style={{ fontSize: "clamp(2.8rem,5vw,5rem)" }}
          >
            De la ferme
            <em className="block italic text-terracotta">
              à votre porte.
            </em>
          </h2>
        </div>
      </Reveal>

      <div className="max-w-5xl mx-auto relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-sand/30 max-md:hidden" />

        {JOURNEY.map((step, i) => (
          <Reveal key={i} delay={i * 100}>
            <div
              className={`flex items-center mb-14 ${
                i % 2 === 0 ? "" : "flex-row-reverse"
              } max-md:flex-col`}
            >
              <div className="w-1/2 px-12 max-md:w-full max-md:px-0">
                <div className="bg-linen p-8 rounded-[20px]">
                  <span className="text-terracotta text-sm tracking-[0.18em] uppercase">
                    {step.hour}
                  </span>

                  <h3 className="font-cormorant text-brown text-3xl mt-2">
                    {step.title}
                  </h3>

                  <p className="text-sand mt-4 leading-8">
                    {step.text}
                  </p>
                </div>
              </div>

              <div className="relative z-10 w-6 h-6 rounded-full bg-terracotta border-4 border-cream max-md:hidden" />

              <div className="w-1/2 max-md:hidden" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}