"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AboutHero() {
  const heroLeftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const hl = heroLeftRef.current;
      if (hl && window.scrollY < window.innerHeight) {
        hl.style.transform = `translateY(${window.scrollY * 0.15}px)`;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="min-h-screen grid grid-cols-2 relative overflow-hidden max-md:grid-cols-1">
      {/* ── LEFT PANEL ── */}
      <div
        ref={heroLeftRef}
        className="bg-olive flex flex-col justify-center md:justify-end px-[72px] py-20 relative overflow-hidden max-md:px-6 max-md:pt-[100px] max-md:pb-[72px]"
      >
        {/* Radial gradient overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 30% 70%, rgba(184,90,40,.18), transparent), radial-gradient(ellipse 80% 60% at 80% 20%, rgba(61,73,38,.22), transparent)",
          }}
        />

        {/* Arabic calligraphy watermark */}
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-arabic font-bold text-white/[0.025] pointer-events-none select-none whitespace-nowrap leading-none max-md:text-[8rem]"
          style={{ fontSize: "18rem" }}
        >
          بلدي
        </span>

        {/* Eyebrow */}
        <p className="relative z-10 text-[1.1rem] tracking-[0.24em] uppercase text-[rgba(200,178,133,0.5)] flex items-center gap-3.5 mb-[22px] before:content-[''] pt-10"
          dir="rtl">
          خيرات بلادي، توصل حتى لعندك عادي
        </p>

        {/* H1 */}
        <h1
          className="relative z-10 font-cormorant text-cream font-light leading-[0.92] mb-8"
          style={{ fontSize: "clamp(3.8rem,7vw,8rem)" }}
        >
          Une passion
          <em className="italic text-terra-light block">qui nourrit.</em>
        </h1>

        {/* Sub */}
        <p
          className="relative z-10 font-sans text-[0.9rem] font-light max-w-[380px] leading-[1.85] mb-4 text-justify"
          style={{ color: "var(--color-cream)" }}
        >
          Chez Bayt Bio, nous croyons que les meilleures choses naissent de la simplicité.

        </p>
        <p
          className="relative z-10 font-sans text-[0.9rem] font-light max-w-[380px] leading-[1.85] mb-4 text-justify"
          style={{ color: "var(--color-cream)" }}
        >

          Des produits naturels, soigneusement sélectionnés, inspirés par le rythme de la nature et le goût authentique que l'on aime retrouver autour de la table.

        </p>
        <p
          className="relative z-10 font-sans text-[0.9rem] font-light max-w-[380px] leading-[1.85] mb-6 text-justify"
          style={{ color: "var(--color-cream)" }}
        >


          Notre ambition est simple : rapprocher les familles de produits sincères, savoureux et de qualité.

        </p>

        {/* CTAs */}
        <div className="relative z-10 flex items-center gap-5">
          <button
            onClick={() =>
              document
                .getElementById("timeline-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-[34px] py-[15px] bg-terracotta text-cream font-sans text-[0.76rem] tracking-[0.12em] uppercase rounded-[2px] border-none transition-all duration-300 hover:bg-terra-light hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(184,90,40,.35)]"
          >
            Notre parcours →
          </button>
          <Link
            href="/products"
            className="px-7 py-[15px] bg-transparent text-[rgba(200,178,133,0.7)] border border-[rgba(200,178,133,0.25)] font-sans text-[0.76rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:border-[rgba(200,178,133,0.6)] hover:text-cream no-underline"
          >
            Voir nos produits
          </Link>
        </div>

        {/* Year stamp */}
        <span
          aria-hidden="true"
          className="absolute bottom-9 right-10 font-cormorant font-light leading-none text-white/[0.03] pointer-events-none select-none"
          style={{ fontSize: "7rem" }}
        >
          2018
        </span>
      </div>

      {/* ── RIGHT MOSAIC ── */}
      <div
        className="grid gap-[3px] bg-linen max-md:hidden"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1.3fr 1fr",

        }}
      >
        {/* Big spanning cell — left column, both rows */}
        <div
          className="relative overflow-hidden group "
          style={{ gridRow: "1/3" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-olive to-terracotta" />
          <Image
            src="/images/about/ferme.png"
            alt="Notre ferme"
            fill
            priority
            className="object-cover [filter:saturate(0.78)_contrast(1.08)_brightness(0.96)] transition duration-[1400ms] group-hover:scale-[1.06] group-hover:[filter:saturate(0.92)_brightness(1)]"
          />
          <span className="absolute bottom-3.5 left-3.5 font-sans text-[0.65rem] tracking-[0.16em] uppercase text-white/80 px-3 py-[5px] bg-[rgba(28,18,8,0.6)] backdrop-blur-sm rounded-[1px] opacity-0 translate-y-1.5 transition-all duration-[350ms] group-hover:opacity-100 group-hover:translate-y-0">
            Notre ferme · Casablanca
          </span>
        </div>

        {/* Top right */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta to-terracotta" />
          <Image
            src="/images/about/animaux_ferme.png"
            alt="Nos animaux"
            fill
            priority
            className="object-cover [filter:saturate(0.78)_contrast(1.08)_brightness(0.96)] transition duration-[1400ms] group-hover:scale-[1.06] group-hover:[filter:saturate(0.92)_brightness(1)]"
          />
          <span className="absolute bottom-3.5 left-3.5 font-sans text-[0.65rem] tracking-[0.16em] uppercase text-white/80 px-3 py-[5px] bg-[rgba(28,18,8,0.6)] backdrop-blur-sm rounded-[1px] opacity-0 translate-y-1.5 transition-all duration-[350ms] group-hover:opacity-100 group-hover:translate-y-0">
            Nos animaux
          </span>
        </div>

        {/* Bottom right */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-olive-light to-terracotta" />
          <Image
            src="/images/about/lait_ferme.png"
            alt="Récolte à la main"
            fill
            priority
            className="object-cover [filter:saturate(0.78)_contrast(1.08)_brightness(0.96)] transition duration-[1400ms] group-hover:scale-[1.06] group-hover:[filter:saturate(0.92)_brightness(1)]"
          />
          <span className="absolute bottom-3.5 left-3.5 font-sans text-[0.65rem] tracking-[0.16em] uppercase text-white/80 px-3 py-[5px] bg-[rgba(28,18,8,0.6)] backdrop-blur-sm rounded-[1px] opacity-0 translate-y-1.5 transition-all duration-[350ms] group-hover:opacity-100 group-hover:translate-y-0">
            Récolte à la main
          </span>
        </div>
      </div>
    </section>
  );
}
