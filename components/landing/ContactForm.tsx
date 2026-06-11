"use client";

// components/landing/ContactForm.tsx
// — standalone form section used BELOW the hero (for scroll anchor)
// — the inline hero version uses ContactFormInner directly

import { useState, useRef } from "react";
import Reveal from "./Reveal";

const SUBJECTS = [
  { value: "commande", label: "Passer commande" },
  { value: "produits", label: "Produits" },
  { value: "livraison", label: "Livraison" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
] as const;

type Subject = (typeof SUBJECTS)[number]["value"] | "";

// Shared inner form — reused in both hero panel and standalone section
export function ContactFormInner() {
  const [subject, setSubject] = useState<Subject>("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200)); // replace with real API call
    setStatus("sent");
    formRef.current?.reset();
    setSubject("");
  }

  const inputClass =
    "w-full bg-white/[0.04] border border-[rgba(160,139,114,0.12)] px-[14px] py-3 font-sans text-[0.85rem] text-cream font-light placeholder:text-cream/30 focus:outline-none focus:border-terracotta/50 transition-colors duration-200";

  if (status === "sent") {
    return (
      <div className="py-16 px-8 flex flex-col gap-5 items-start bg-white/[0.03]">
        <span className="text-3xl">✉️</span>
        <h3 className="font-cormorant text-cream font-light" style={{ fontSize: "2rem" }}>
          Message envoyé.
        </h3>
        <p className="font-sans text-[0.85rem] text-sand font-light leading-[1.85] max-w-[340px]">
          Merci de nous avoir contactés. Nous vous répondrons dans la prochaine heure.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 font-sans text-[0.75rem] tracking-[0.12em] uppercase text-terracotta border-b border-terracotta/40 pb-0.5 hover:border-terracotta transition-colors duration-200 bg-transparent cursor-pointer"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Form header */}
      <div className="mb-8">
        <p className="font-sans text-[0.65rem] tracking-[0.22em] uppercase text-cream/45 mb-3">
          Formulaire de contact
        </p>
        <h2
          className="font-cormorant text-cream font-light leading-[0.95]"
          style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}
        >
          Écrivez-<em className="italic text-terra-light">nous.</em>
        </h2>
      </div>

      {/* Subject pills */}
      <div className="flex flex-wrap gap-[6px] mb-7">
        {SUBJECTS.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setSubject(s.value)}
            className={`px-[14px] py-[6px] text-[0.7rem] tracking-[0.06em] border transition-all duration-200 cursor-pointer ${
              subject === s.value
                ? "bg-terracotta border-terracotta text-cream"
                : "bg-transparent border-[rgba(160,139,114,0.2)] text-cream/50 hover:border-terracotta/50 hover:text-terra-light"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-[2px]">
        {/* Name + Phone row */}
        <div className="grid grid-cols-2 gap-[2px] max-md:grid-cols-1">
          <div className="flex flex-col gap-[6px]">
            <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
              Nom complet *
            </label>
            <input required type="text" placeholder="Votre nom" className={inputClass} />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
              Téléphone
            </label>
            <input type="tel" placeholder="+212 6…" className={inputClass} />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-[6px] mt-[2px]">
          <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
            Email *
          </label>
          <input required type="email" placeholder="votre@email.com" className={inputClass} />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-[6px] mt-[2px] mb-6">
          <label className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-cream/45">
            Message *
          </label>
          <textarea
            required
            rows={5}
            placeholder="Votre message…"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Submit row */}
        <div className="flex items-center gap-6 flex-wrap">
          <button
            type="submit"
            disabled={status === "sending"}
            className="px-8 py-[14px] bg-terracotta text-cream font-sans text-[0.72rem] tracking-[0.12em] uppercase border-none transition-all duration-300 hover:bg-terra-light hover:-translate-y-px hover:shadow-[0_12px_32px_rgba(184,90,40,.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {status === "sending" ? "Envoi…" : "Envoyer →"}
          </button>
          <span className="font-sans text-[0.68rem] text-cream/35 font-light">
            * Champs obligatoires
          </span>
        </div>

        {status === "error" && (
          <p className="font-sans text-[0.76rem] text-red-400 font-light mt-3">
            Une erreur est survenue. Contactez-nous directement sur WhatsApp.
          </p>
        )}
      </form>
    </>
  );
}

// Default export — standalone section for scroll anchor (page bottom)
export default function ContactForm() {
  return (
    <section
      id="contact-form"
      className="bg-[#1A1210] px-[72px] py-24 max-md:px-6 max-md:py-14 border-t border-white/[0.04]"
    >
      <div className="max-w-[680px] mx-auto">
        <Reveal>
          <ContactFormInner />
        </Reveal>
      </div>
    </section>
  );
}