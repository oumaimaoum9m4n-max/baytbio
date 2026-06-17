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

      {/* ───────── LEFT PANEL ───────── */}
      {/* Fond olive plein — pas de gradient ici */}
      <div
        ref={heroLeftRef}
        className="flex flex-col justify-center md:justify-end px-[72px] py-20 relative overflow-hidden max-md:px-6 max-md:pt-[100px] max-md:pb-[72px]"
        style={{ backgroundColor: "#163b26" }}
      >
        {/* Arabic watermark */}
        {/* <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-arabic font-bold text-white/[0.025] pointer-events-none select-none whitespace-nowrap leading-none max-md:text-[8rem]"
          style={{ fontSize: "18rem" }}
        >
          بلدي
        </span> */}

        {/* Eyebrow */}
        <p
          className="relative z-10 text-[1.1rem] tracking-[0.24em] uppercase text-[rgba(200,178,133,0.5)] flex items-center gap-3.5 mb-[22px] pt-10"
          dir="rtl"
        >
          خيرات بلادي، توصل حتى لعندك عادي
        </p>

        {/* Title */}
        <h1
          className="relative z-10 font-cormorant text-cream font-light leading-[0.92] mb-8"
          style={{ fontSize: "clamp(3.8rem,7vw,8rem)" }}
        >
          Une passion
          <em className="italic text-terra-light block">qui nourrit.</em>
        </h1>

        {/* Text */}
        <p className="relative z-10 font-sans text-[0.9rem] font-light max-w-[380px] leading-[1.85] mb-4 text-justify text-cream">
          Chez Bayt Bio, nous croyons que les meilleures choses naissent de la simplicité.
        </p>

        <p className="relative z-10 font-sans text-[0.9rem] font-light max-w-[380px] leading-[1.85] mb-4 text-justify text-cream">
          Des produits naturels, soigneusement sélectionnés, inspirés par le rythme de la nature.
        </p>

        <p className="relative z-10 font-sans text-[0.9rem] font-light max-w-[380px] leading-[1.85] mb-6 text-justify text-cream">
          Notre ambition : rapprocher les familles de produits sincères et de qualité.
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex items-center gap-5">
          <button
            onClick={() =>
              document.getElementById("timeline-section")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-[34px] py-[15px] bg-terracotta text-cream font-sans text-[0.76rem] tracking-[0.12em] uppercase rounded-[2px] transition hover:bg-terra-light hover:-translate-y-0.5"
          >
            Notre parcours →
          </button>

          <Link
            href="/products"
            className="px-7 py-[15px] border border-[rgba(200,178,133,0.25)] text-[rgba(200,178,133,0.7)] font-sans text-[0.76rem] tracking-[0.12em] uppercase rounded-[2px] transition hover:border-[rgba(200,178,133,0.6)] hover:text-cream"
          >
            Voir nos produits
          </Link>
        </div>

       
      </div>

      {/* ───────── RIGHT MOSAIC ───────── */}
      {/* Le gradient est appliqué ICI uniquement, par-dessus les images,
          de gauche (olive pour fondre avec le panneau) vers transparent à droite */}
      <div
        className="grid gap-[3px] bg-linen max-md:hidden relative"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1.3fr 1fr",
        }}
      >
        {/* Gradient unique sur la mosaïque : fond olive à gauche → transparent à droite */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #163b26 0%, rgba(22,59,38,0.55) 40%, rgba(22,59,38,0) 75%)",
          }}
        />

        {/* FARM */}
        <div className="relative overflow-hidden group" style={{ gridRow: "1/3" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-olive to-terracotta" />
          <Image
            src="/images/about/ferme.png"
            alt="Notre ferme"
            fill
            priority
            className="object-cover transition duration-[1400ms] group-hover:scale-[1.06]"
          />
          <span className="absolute bottom-3.5 left-3.5 z-20 text-[0.65rem] uppercase text-white/80 px-3 py-[5px] bg-black/40 backdrop-blur-sm opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition">
            Notre ferme · Casablanca
          </span>
        </div>

        {/* ANIMAUX */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta to-terracotta" />
          <Image
            src="/images/about/animaux_ferme.png"
            alt="Nos animaux"
            fill
            priority
            className="object-cover transition duration-[1400ms] group-hover:scale-[1.06]"
          />
          <span className="absolute bottom-3.5 left-3.5 z-20 text-[0.65rem] uppercase text-white/80 px-3 py-[5px] bg-black/40 backdrop-blur-sm opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition">
            Nos animaux
          </span>
        </div>

        {/* LAIT */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-olive-light to-terracotta" />
          <Image
            src="/images/about/lait_ferme.png"
            alt="Récolte à la main"
            fill
            priority
            className="object-cover transition duration-[1400ms] group-hover:scale-[1.06]"
          />
          <span className="absolute bottom-3.5 left-3.5 z-20 text-[0.65rem] uppercase text-white/80 px-3 py-[5px] bg-black/40 backdrop-blur-sm opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition">
            Récolte à la main
          </span>
        </div>
      </div>

    </section>
  );
}