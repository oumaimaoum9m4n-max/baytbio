import { ReactNode } from "react";

type Variant = "primary" | "ghost" | "whatsapp" | "outline-cream" | "nav-whatsapp" | "footer-whatsapp";

interface ButtonProps {
  variant: Variant;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}

const styles: Record<Variant, string> = {
  primary:
    "inline-block px-9 py-4 bg-terracotta text-cream font-sans text-[0.82rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:bg-terra-light hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,136,60,0.35)] cursor-pointer border-none",
  ghost:
    "inline-block px-7 py-4 bg-olive-light text-cream border border-sand/40 font-sans text-[0.82rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:text-white hover:border-olive hover:bg-olive cursor-pointer",
  whatsapp:
    "inline-flex items-center gap-2.5 px-10 py-[18px] bg-[#25d366] text-white font-sans text-[0.85rem] tracking-[0.1em] uppercase rounded-[2px] transition-all duration-300 hover:bg-[#1db954] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,211,102,0.35)] cursor-pointer border-none whitespace-nowrap",
  "outline-cream":
    "inline-block px-10 py-[18px] bg-transparent text-cream border border-cream/30 font-sans text-[0.85rem] tracking-[0.1em] uppercase rounded-[2px] transition-all duration-300 hover:border-cream hover:bg-cream/10 cursor-pointer text-center whitespace-nowrap",
  "nav-whatsapp":
    "px-[22px] py-[9px] bg-olive text-cream font-sans text-[0.78rem] tracking-[0.1em] uppercase rounded-[2px] transition-all duration-300 hover:bg-olive-light hover:-translate-y-px cursor-pointer border-none",
  "footer-whatsapp":
    "inline-flex items-center justify-center gap-1 px-[22px] py-[9px] bg-olive text-cream font-sans text-[0.78rem] tracking-[0.1em] capitalize rounded-[2px] transition-all duration-300 hover:bg-olive-light cursor-pointer border-none no-underline",
};

export default function Button({ variant, href, onClick, children, className = "", type = "button" }: ButtonProps) {
  if (href) {
    return (
      <a href={href} className={`${styles[variant]} ${className}`}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={`${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
