"use client";

// components/landing/ContactInfo.tsx

import Reveal from "./Reveal";

export default function ContactInfo() {
  return (
    <section className="bg-[#1A1210] px-[72px] py-20 max-md:px-6 max-md:py-12">
      <Reveal>
        <div className="flex items-center gap-5 mb-16">
          <span className="font-sans text-[0.65rem] tracking-[0.24em] uppercase text-sand/40">
            Nous trouver
          </span>
          <span className="flex-1 h-px bg-white/[0.06]" />
        </div>
      </Reveal>

      <div className="grid grid-cols-3 gap-[2px] max-md:grid-cols-1">
        {/* Address */}
        <Reveal>
          <div className="bg-white/[0.03] px-10 py-10 group hover:bg-white/[0.05] transition-colors duration-300">
            <p className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-sand/40 mb-5">
              Ferme principale
            </p>
            <h3
              className="font-cormorant text-cream font-light mb-4"
              style={{ fontSize: "1.5rem" }}
            >
              Casablanca
            </h3>
            <address className="not-italic font-sans text-[0.8rem] text-cream/45 font-light leading-[1.95]">
              Route de Bouskoura<br />
              Km 12, Casablanca<br />
              Maroc
            </address>
            <p className="font-sans text-[0.7rem] text-sand/30 font-light mt-4 italic">
              Visites sur rendez-vous uniquement
            </p>
          </div>
        </Reveal>

        {/* Hours */}
        <Reveal delay={80}>
          <div className="bg-white/[0.03] px-10 py-10 group hover:bg-white/[0.05] transition-colors duration-300">
            <p className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-sand/40 mb-5">
              Horaires
            </p>
            <h3
              className="font-cormorant text-cream font-light mb-6"
              style={{ fontSize: "1.5rem" }}
            >
              7 jours sur 7
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { day: "Lun – Ven", hours: "8h – 20h" },
                { day: "Sam", hours: "8h – 18h" },
                { day: "Dim", hours: "9h – 15h" },
              ].map((row) => (
                <div
                  key={row.day}
                  className="flex items-center justify-between border-b border-white/[0.05] pb-3 last:border-0 last:pb-0"
                >
                  <span className="font-sans text-[0.78rem] text-cream/40">
                    {row.day}
                  </span>
                  <span
                    className="font-cormorant text-cream/70 font-light"
                    style={{ fontSize: "1.05rem" }}
                  >
                    {row.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Social */}
        <Reveal delay={160}>
          <div className="bg-terracotta/[0.08] px-10 py-10 group hover:bg-terracotta/[0.12] transition-colors duration-300 flex flex-col justify-between">
            <div>
              <p className="font-sans text-[0.62rem] tracking-[0.2em] uppercase text-sand/40 mb-5">
                Nous suivre
              </p>
              <h3
                className="font-cormorant text-cream font-light mb-4"
                style={{ fontSize: "1.5rem" }}
              >
                Restez en contact
              </h3>
              <p className="font-sans text-[0.8rem] text-cream/45 font-light leading-[1.85]">
                Actualités de la ferme, arrivages du jour et recettes — sur
                Instagram et Facebook.
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-8">
              <a
                href="https://instagram.com/baytbio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-sans text-[0.78rem] tracking-[0.06em] text-cream/40 hover:text-terra-light transition-colors duration-200 no-underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                @baytbio
              </a>
              <a
                href="https://facebook.com/baytbio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 font-sans text-[0.78rem] tracking-[0.06em] text-cream/40 hover:text-terra-light transition-colors duration-200 no-underline"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                Bayt Bio Maroc
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}