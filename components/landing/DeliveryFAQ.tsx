"use client";

// components/landing/DeliveryFAQ.tsx

import { useState } from "react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "Quel est le délai minimum pour passer une commande ?",
    a: "Vous pouvez commander jusqu'à 21h la veille pour une livraison le lendemain matin. Pour les grandes commandes (plus de 30 œufs ou plusieurs produits laitiers), nous vous recommandons de nous contacter 48h à l'avance.",
  },
  {
    q: "Comment passer ma commande ?",
    a: "Tout se fait via WhatsApp : envoyez-nous un message avec vos produits souhaités et votre adresse. Pas d'application à installer, pas de compte à créer. Nous vous confirmons la disponibilité et le créneau de livraison dans les 30 minutes.",
  },
  {
    q: "Quels sont les modes de paiement acceptés ?",
    a: "Nous acceptons le paiement à la livraison en espèces (DH), par virement bancaire (CIH, Attijariwafa, BMCE) ou par paiement mobile (M-Wallet). Aucun prépaiement n'est demandé.",
  },
  {
    q: "Y a-t-il un montant minimum de commande ?",
    a: "Non. Vous pouvez commander une seule boîte d'œufs si vous le souhaitez, sans frais de livraison supplémentaires.",
  },
  {
    q: "Les produits sont-ils vraiment frais le jour même ?",
    a: "Oui. Nos œufs sont récoltés entre 5h et 7h du matin et livrés avant midi. Le lait et les produits laitiers sont préparés le matin de la livraison. Aucun de nos produits ne passe par un entrepôt frigorifique.",
  },
  {
    q: "Livrez-vous dans d'autres villes ?",
    a: "Actuellement, nous livrons à Casablanca et Rabat. Nous sommes en cours d'expansion vers Marrakech et Tanger. Contactez-nous pour être notifié dès que votre ville est couverte.",
  },
];

export default function DeliveryFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream px-[72px] py-24 max-md:px-6 max-md:py-14">
      <div className="grid grid-cols-[1fr_2fr] gap-20 max-md:grid-cols-1 max-md:gap-10">
        {/* Left label */}
        <Reveal>
          <div className="sticky top-32 self-start max-md:static">
            <p className="font-sans text-[0.7rem] tracking-[0.24em] uppercase text-sand flex items-center gap-3.5 before:content-[''] before:w-7 before:h-px before:bg-terracotta before:shrink-0 mb-6">
              Questions fréquentes
            </p>
            <h2
              className="font-cormorant text-brown font-light leading-[0.95]"
              style={{ fontSize: "clamp(2.4rem,3.5vw,3.8rem)" }}
            >
              Tout ce que
              <em className="block italic text-terracotta">
                vous voulez savoir.
              </em>
            </h2>
          </div>
        </Reveal>

        {/* FAQ accordion */}
        <div className="flex flex-col">
          {FAQS.map((faq, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="border-t border-sand/25 last:border-b">
                <button
                  className="w-full flex items-start justify-between gap-6 py-7 text-left cursor-pointer bg-transparent border-none group"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-cormorant text-brown font-light group-hover:text-terracotta transition-colors duration-200" style={{ fontSize: "1.18rem" }}>
                    {faq.q}
                  </span>
                  <span
                    className={`text-terracotta font-light text-xl mt-0.5 shrink-0 transition-transform duration-300 ${
                      open === i ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-[400ms] ease-in-out ${
                    open === i ? "max-h-[300px] opacity-100 pb-7" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="font-sans text-[0.88rem] text-sand font-light leading-[1.85]">
                    {faq.a}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}