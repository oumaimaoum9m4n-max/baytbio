"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { WHATSAPP_URL } from "@/components/landing/constants";
import Link from "next/link";

const links = [
  { path: "/", label: "Accueil" },
  { path: "/products", label: "Nos Produits" },
  { path: "/about", label: "Notre Histoire" },
  // { path: "/delivery", label: "Livraison" },
];

interface NavbarProps {
  linksTone?: "default" | "brown";
}

export default function Navbar({ linksTone = "default" }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();

  const linkColorClass =
    linksTone === "brown"
      ? "text-brown"
      : scrolled
        ? "text-brown"
        : "text-cream";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? "px-12 py-4 bg-cream/[0.88] backdrop-blur-[12px] border-b border-terracotta/[0.12]"
          : "px-12 py-6"
      }`}
    >
      <Link
        href="/"
        className="font-cormorant text-2xl font-semibold text-brown tracking-[0.02em] no-underline flex items-center gap-2.5"
      >
        <span
          className="w-7 h-7 bg-olive-light shrink-0"
          style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }}
        />
        Bayt<strong>Bio</strong>
      </Link>

      <ul className="hidden md:flex gap-10 list-none m-0 p-0">
        {links.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={`text-[0.82rem] font-normal tracking-[0.12em] uppercase no-underline transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-px after:bg-terracotta after:transition-[width] after:duration-[350ms] hover:after:w-full hover:text-terracotta ${
                linkColorClass
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 text-[0.82rem] tracking-[0.08em] uppercase cursor-pointer bg-transparent border-none font-sans relative"
          style={{ color: scrolled ? "#2c2c2c" : "#2c2c2c" }}
          aria-label="Panier"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="w-[18px] h-[18px] bg-terracotta rounded-full flex items-center justify-center text-[0.65rem] text-white font-medium">
            {count}
          </span>
        </button>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-[22px] py-[9px] bg-olive text-cream font-sans text-[0.78rem] tracking-[0.1em] uppercase rounded-[2px] transition-all duration-300 hover:bg-olive-light hover:-translate-y-px"
        >
          Commander via WhatsApp
        </a>
      </div>
    </nav>
  );
}
