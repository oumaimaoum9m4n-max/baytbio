"use client";

// components/landing/ContactHero.tsx

import { useEffect, useRef } from "react";
import { WHATSAPP_URL } from "@/components/landing/constants";
import { ContactFormInner } from "./ContactForm";

const CHANNELS = [
  {
    label: "WhatsApp",
    value: "+212 6 00 00 00 00",
    sub: "Réponse immédiate · 7j/7",
    href: WHATSAPP_URL,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
    iconClass: "bg-terracotta/20 text-terra-light",
  },
  {
    label: "Email",
    value: "contact@baytbio.ma",
    sub: "Réponse sous 24h",
    href: "mailto:contact@baytbio.ma",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    iconClass: "bg-olive/25 text-[#8aaa5a]",
  },
  {
    label: "Téléphone",
    value: "+212 5 22 00 00 00",
    sub: "Lun–Sam, 8h–18h",
    href: "tel:+212522000000",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    iconClass: "bg-sand/15 text-sand",
  },
];

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

      {/* ✨ LINE VERTICALE ENTRE LES DEUX BLOCS */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-1/2 w-px bg-terra-light/40 max-md:hidden"
      />

      {/* ── LEFT PANEL ── */}
      <div
        ref={panelRef}
        className="bg-olive flex flex-col justify-end px-[72px] py-20 relative overflow-hidden max-md:px-6 max-md:pt-[100px] max-md:pb-[72px]"
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
          Parlons-
          <em className="italic text-terra-light block">nous.</em>
        </h1>

        <p className="relative z-10 font-sans text-[0.88rem] font-light max-w-[360px] leading-[1.85] mb-10 text-cream/60">
          Une question, une commande, ou simplement envie de connaître la ferme
          — nous répondons tous les jours, de 8h à 21h.
        </p>

        <div className="relative z-10 flex flex-col gap-[2px]">
          {CHANNELS.map((ch) => (
            <a
              key={ch.label}
              href={ch.href}
              target={ch.label === "WhatsApp" ? "_blank" : undefined}
              rel={ch.label === "WhatsApp" ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 px-[18px] py-[14px] bg-white/[0.04] border-l-2 border-transparent hover:bg-white/[0.07] hover:border-terracotta transition-all duration-250 no-underline"
            >
              <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ch.iconClass}`}>
                {ch.icon}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-sans text-[0.65rem] tracking-[0.16em] uppercase text-sand mb-0.5">
                  {ch.label}
                </p>
                <p className="font-cormorant text-cream font-light text-[1.05rem]">
                  {ch.value}
                </p>
                <p className="font-sans text-[0.68rem] text-cream/60 font-light">
                  {ch.sub}
                </p>
              </div>

              <span className="text-terracotta opacity-0 group-hover:opacity-100 transition-all duration-250 group-hover:translate-x-1 font-sans text-[0.85rem]">
                →
              </span>
            </a>
          ))}
        </div>
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