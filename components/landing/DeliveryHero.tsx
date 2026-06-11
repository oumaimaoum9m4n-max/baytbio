"use client";

// components/landing/DeliveryHero.tsx

import { useEffect, useRef } from "react";
import { WHATSAPP_URL } from "@/components/landing/constants";

export default function DeliveryHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current && window.scrollY < window.innerHeight) {
            // Effet d'immersion : le fond descend légèrement moins vite pour créer de la profondeur
            heroRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.15}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { value: "7j/7", label: "Même le dimanche" },
    { value: "J+0", label: "Récolte → Porte le jour même" },
    { value: "Casablanca · Rabat", label: "Villes desservies" },
    { value: "0 DH", label: "Frais de port, sans minimum" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-between bg-olive text-cream overflow-hidden px-6 py-12 md:px-12 md:py-16">

      {/* ── ARRIÈRE-PLAN TEXTURÉ IMMERSIF ── */}
      <div
        ref={heroRef}
        className="absolute inset-0 z-0 pointer-events-none will-change-transform"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 60%),
            radial-gradient(circle at 10% 20%, rgba(184, 90, 40, 0.12) 0%, transparent 40%)
          `
        }}
      >
        {/* Grain ou trame fine de luxe en arrière-plan */}
        <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* ── EN-TÊTE : FILIGRANE TYPOGRAPHIQUE ARABE ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0 pointer-events-none select-none mix-blend-plus-lighter opacity-20">
        <span className="font-sans font-black text-white/[0.02] uppercase tracking-[0.4em] text-[12vw] block leading-none">
          Delivery
        </span>
      </div>

      {/* ── BLOC CENTRAL : CŒUR ÉDITORIAL ── */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-4xl mx-auto w-full pt-12">

        {/* Badge Surtitre Minimaliste */}
        <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          <span className="text-[0.65rem] font-sans font-medium tracking-[0.22em] uppercase text-cream/70 leading-none">
            Service Quotidien Direct Ferme
          </span>
        </div>

        {/* Titre Théâtral Centré */}
        <h1
          className="font-cormorant font-light leading-[1.05] tracking-tight mb-8 max-w-3xl"
          style={{ fontSize: "clamp(2.8rem, 6.5vw, 6.5rem)" }}
        >
          À votre porte, <br />
          <em className="font-serif italic text-terra-light font-normal">chaque matin.</em>
        </h1>

        {/* Paragraphe Poétique de Présentation */}
        <p className="font-sans text-sm md:text-base font-light max-w-xl leading-[1.8] text-cream/70 mb-12 mix-blend-plus-lighter">
          Récolte à l’aube, logistique interne sans intermédiaire. Vos essentiels laitiers et œufs extra-frais arrivent chez vous avant midi à Casablanca et Rabat.
        </p>

        {/* Boutons d'Action Minimalistes */}
        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-10 py-4.5 bg-cream text-olive font-sans text-xs font-semibold tracking-[0.16em] uppercase rounded-full shadow-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 no-underline"
          >
            Commander via WhatsApp
          </a>
          
          <button
            onClick={() => document.getElementById("zones-section")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto px-8 py-4.5 bg-transparent text-cream/80 border border-white/10 font-sans text-xs font-medium tracking-[0.16em] uppercase rounded-full hover:border-white/40 hover:text-cream hover:bg-white/[0.02] transition-all duration-300 cursor-pointer"
          >
            Explorer les zones
          </button>
        </div> */}
      </div>

      {/* ── PIED DE PAGE : FRISE DE GARANTIES CHIC ── */}

      <div className="relative z-10 w-full max-w-6xl mx-auto mt-auto pt-10">
        {/* Ligne supérieure fine avec un dégradé élégant */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10" aria-hidden="true" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {features.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-300"
            >
              {/* Séparateur vertical ultra-fin pour les grands écrans */}
              {index > 0 && (
                <div
                  className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 bg-white/5 transition-colors duration-500 group-hover:bg-terracotta/30"
                  aria-hidden="true"
                  style={{ marginLeft: '-1rem' }}
                />
              )}

              {/* Label (Surtitre) : Remonté en premier pour une lecture éditoriale plus logique */}
              <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-cream/40 font-medium mb-2 transition-colors duration-300 group-hover:text-cream/60">
                {item.label}
              </span>

              {/* Valeur Principale : Mise en valeur avec un léger effet d'élévation au survol */}
              <span
                className="font-cormorant text-2xl md:text-3xl font-light text-cream group-hover:text-terra-light transition-all duration-300 transform group-hover:translate-x-1 inline-block"
              >
                {item.value}
              </span>

              {/* Ligne de soulignement interactive discrète */}
              <div className="w-4 h-[1px] bg-white/10 mt-3 transition-all duration-500 group-hover:w-12 group-hover:bg-terracotta" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}