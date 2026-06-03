import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: ReactNode;
  dark?: boolean;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({ eyebrow, title, dark = false, centered = false, className = "" }: SectionHeaderProps) {
  return (
    <div className={className}>
      <p
        className={`text-[0.72rem] tracking-[0.22em] uppercase font-normal mb-3.5 flex items-center gap-3.5 ${centered ? "justify-center before:hidden after:content-[''] after:w-8 after:h-px after:bg-current after:shrink-0" : "before:content-[''] before:w-8 before:h-px before:bg-current before:shrink-0"} ${dark ? "text-terra-light" : "text-terracotta"}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-cormorant text-[clamp(2.4rem,3.5vw,3.8rem)] font-light leading-[1.1] ${dark ? "text-cream" : "text-brown"}`}
      >
        {title}
      </h2>
    </div>
  );
}
