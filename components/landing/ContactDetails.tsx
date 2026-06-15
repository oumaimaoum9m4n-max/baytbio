"use client";

// components/landing/ContactDetails.tsx
// — WhatsApp quick-order CTA, contact info, trust block & closing text
//   shown below the contact hero / form

import { WHATSAPP_URL } from "@/components/landing/constants";
import Reveal from "./Reveal";

const INFOS = [
  { label: "Téléphone", value: "+212 660 78 63 33", href: "tel:+212660786333" },
  {
    label: "E-mail",
    value: "contact@baytbio.ma",
    href: "mailto:contact@baytbio.ma",
  },
  { label: "Ville", value: "Casablanca, Maroc" },
  { label: "Horaires", value: "Lundi – Samedi\n09h00 – 19h00" },
] as const;

const TRUST_POINTS = [
  "Réponse rapide",
  "Accompagnement personnalisé",
  "Commande simplifiée",
  "Service client à votre écoute",
];

export default function ContactDetails() {
  return (
    <section className="relative overflow-hidden bg-cream px-[72px] py-24 max-md:px-6 max-md:py-14">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 10% 6%, rgba(212,136,60,.07), transparent), radial-gradient(ellipse 55% 50% at 92% 94%, rgba(61,122,85,.07), transparent)",
        }}
      />
      <div className="relative z-10 max-w-[1080px] mx-auto flex flex-col gap-20 max-md:gap-14">
        {/* ── WhatsApp quick order ── */}
        <Reveal>
          <div className="bg-white border border-olive/10 shadow-[0_20px_50px_-25px_rgba(22,59,38,.25)] px-12 py-12 max-md:px-7 max-md:py-9 flex flex-col items-start gap-5">
            <p className="font-sans text-[0.65rem] tracking-[0.24em] uppercase text-terracotta">
              Commande rapide WhatsApp
            </p>
            <h2
              className="font-cormorant text-olive font-light leading-[1.05]"
              style={{ fontSize: "clamp(1.9rem,3.2vw,2.8rem)" }}
            >
              Préférez-vous commander{" "}
              <em className="italic text-terracotta">directement</em> ?
            </h2>
            <p className="font-sans text-[0.88rem] text-sand font-light leading-[1.85] max-w-[460px]">
              Pour une réponse rapide et un accompagnement personnalisé,
              contactez-nous directement sur WhatsApp.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-3 px-8 py-[14px] bg-olive text-cream font-sans text-[0.72rem] tracking-[0.12em] uppercase no-underline transition-all duration-300 hover:bg-olive-light hover:-translate-y-px hover:shadow-[0_12px_32px_rgba(22,59,38,.3)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.821 11.821 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.005zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              Commander via WhatsApp
            </a>
          </div>
        </Reveal>

        {/* ── Contact info ── */}
        <div>
          <Reveal>
            <div className="flex items-center gap-5 mb-12">
              <span className="font-sans text-[0.65rem] tracking-[0.24em] uppercase text-sand/70">
                Informations de contact
              </span>
              <span className="flex-1 h-px bg-olive/10" />
            </div>
          </Reveal>

          <div className="grid grid-cols-4 gap-[2px] max-md:grid-cols-1">
            {INFOS.map((info, i) => (
              <Reveal key={info.label} delay={i * 70}>
                <div className="bg-white border border-olive/[0.08] px-9 py-9 h-full hover:border-terracotta/40 hover:-translate-y-0.5 transition-all duration-300">
                  <p className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-sand/70 mb-5">
                    {info.label}
                  </p>
                  {"href" in info ? (
                    <a
                      href={info.href}
                      className="font-cormorant text-olive font-light no-underline hover:text-terracotta transition-colors duration-200 whitespace-pre-line"
                      style={{ fontSize: "1.35rem", lineHeight: 1.4 }}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p
                      className="font-cormorant text-olive font-light whitespace-pre-line"
                      style={{ fontSize: "1.35rem", lineHeight: 1.4 }}
                    >
                      {info.value}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── Trust block ── */}
        <Reveal>
          <div className="relative overflow-hidden bg-olive px-12 py-12 max-md:px-7 max-md:py-9">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 50% 60% at 88% 18%, rgba(224,154,85,.14), transparent)",
              }}
            />
            <h3
              className="relative z-10 font-cormorant text-cream font-light mb-8"
              style={{ fontSize: "clamp(1.6rem,2.6vw,2.2rem)" }}
            >
              Pourquoi nous{" "}
              <em className="italic text-terra-light">contacter</em> ?
            </h3>
            <ul className="relative z-10 grid grid-cols-2 gap-x-10 gap-y-5 max-md:grid-cols-1">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 font-sans text-[0.92rem] text-cream/80 font-light"
                >
                  <span className="text-terra-light text-[1rem]">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* ── Closing text ── */}
        <Reveal>
          <div className="text-center max-w-[560px] mx-auto flex flex-col gap-5">
            <p
              className="font-cormorant text-olive font-light italic"
              style={{ fontSize: "clamp(1.6rem,2.8vw,2.4rem)" }}
            >
              Merci pour votre confiance.
            </p>
            <p className="font-sans text-[0.9rem] text-sand font-light leading-[1.9]">
              Nous serons ravis de vous accompagner et de vous faire découvrir
              l'univers Bayt Bio.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
