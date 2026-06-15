"use client";

// components/landing/ContactHero.tsx

import { useEffect, useRef } from "react";
import { WHATSAPP_URL } from "@/components/landing/constants";
import { ContactFormInner } from "./ContactForm";

export default function ContactHero() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      if (panelRef.current && window.scrollY < window.innerHeight) {
        panelRef.current.style.transform = `translateY(${window.scrollY * 0.1}px)`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="min-h-screen grid grid-cols-2 relative overflow-hidden max-md:grid-cols-1 bg-[#1A1210]">
      {/* ── LEFT PANEL ── */}
      <div
        ref={panelRef}
        className="bg-olive flex flex-col justify-center px-[72px] relative overflow-hidden max-md:px-6 max-md:pt-[100px] max-md:pb-[72px]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 20% 80%, rgba(184,90,40,.22), transparent), radial-gradient(ellipse 50% 50% at 85% 15%, rgba(61,73,38,.18), transparent)",
          }}
        />

        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-arabic font-light text-white/[0.03] pointer-events-none select-none whitespace-nowrap leading-none tracking-[-4px]"
          style={{ fontSize: "18rem" }}
        >
          تواصل
        </span>

        <p className="relative z-10 text-[0.7rem] tracking-[0.24em] uppercase text-[rgba(200,178,133,0.45)] flex items-center gap-3.5 mb-[22px] before:content-[''] before:w-7 before:h-px before:bg-terracotta before:shrink-0">
          Contact · تواصل معنا
        </p>

        <h1
          className="relative z-10 font-cormorant text-cream font-light leading-[0.9] mb-8"
          style={{ fontSize: "clamp(3.8rem,7vw,8rem)" }}
        >
          Contactez-
          <em className="italic text-terra-light block">nous.</em>
        </h1>

        <p className="relative z-10 font-sans text-[0.88rem] font-light max-w-[360px] leading-[1.85] mb-10 text-cream/60">
          Une question, une demande particulière ou une commande ? Notre équipe
          est à votre écoute et se fera un plaisir de vous accompagner.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <ContactFormPanel />
    </section>
  );
}

// RIGHT SIDE FORM
function ContactFormPanel() {
  return (
    <div className="bg-olive flex flex-col justify-center px-[72px] py-20 max-md:px-6 max-md:py-14">
      <ContactFormInner />
    </div>
  );
}
