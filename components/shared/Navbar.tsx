"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { WHATSAPP_URL } from "@/components/landing/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; 

const links = [
  { path: "/", label: "Accueil" },
  { path: "/products", label: "Nos Produits" },
  { path: "/about", label: "Notre Histoire" },
  { path: "/contact", label: "Contact" },
];

interface NavbarProps {
  linksTone?: "default" | "brown";
  variant?: "default" | "olive";
}

export default function Navbar({
  linksTone = "default",
  variant = "default",
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname(); 

  const { count } = useCart();

  // 👇 AJOUT
  const hideWhatsappButton =
    pathname === "/cart" || pathname === "/checkout" || pathname.startsWith("/products/");

  const linkColorClass =
    linksTone === "brown" || scrolled || menuOpen
      ? "text-brown"
      : "text-cream";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const logoSrc = scrolled
    ? "/images/logo/logo_baytbio.png"
    : "/images/logo/logo_baytbio_white.png";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "px-5 md:px-12 py-3 md:py-4 bg-cream/[0.88] backdrop-blur-[12px]"
            : variant === "olive"
            ? "px-5 md:px-12 py-4 bg-olive"
            : "px-5 md:px-12 py-4"
        }`}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src={logoSrc}
            alt="BaytBio"
            width={140}
            height={70}
            priority
            className={`object-contain transition-all duration-300 ${
              scrolled ? "scale-100" : "scale-110"
            }`}
          />
        </Link>

        {/* LINKS */}
        <ul className="hidden md:flex gap-10 list-none m-0 p-0">
          {links.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`text-[0.82rem] font-normal tracking-[0.12em] uppercase no-underline transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-px after:bg-terracotta after:transition-[width] after:duration-[350ms] hover:after:w-full hover:text-terracotta ${linkColorClass}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-6">
          {/* PANIER */}
          <Link
            href="/cart"
            className={`items-center gap-2 text-[0.82rem] tracking-[0.08em] uppercase cursor-pointer font-sans relative ${linkColorClass} ${
              menuOpen ? "hidden" : "flex"
            }`}
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
          </Link>

          {/* WHATSAPP */}
          {!hideWhatsappButton && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-block px-[14px] md:px-[22px] py-2 md:py-[9px] bg-olive text-cream font-sans text-[0.7rem] md:text-[0.78rem] tracking-[0.1em] uppercase rounded-[2px] transition-all duration-300 hover:bg-olive-light hover:-translate-y-px"
            >
              Commander via WhatsApp
            </a>
          )}

          {/* HAMBURGER */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] bg-transparent border-none cursor-pointer"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              className={`block w-5 h-px bg-current transition-transform duration-300 origin-center ${
                menuOpen ? "translate-y-[6px] rotate-45" : ""
              } ${linkColorClass}`}
            />
            <span
              className={`block w-5 h-px bg-current transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              } ${linkColorClass}`}
            />
            <span
              className={`block w-5 h-px bg-current transition-transform duration-300 origin-center ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              } ${linkColorClass}`}
            />
          </button>
        </div>
      </nav>
    </>
  );
}

