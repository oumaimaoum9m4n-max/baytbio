import { ReactNode } from "react";
import Reveal from "./Reveal";

interface TrustPillarProps {
  icon: ReactNode;
  number: string;
  label: string;
  desc: string;
  delay?: number;
}

export default function TrustPillar({ icon, number, label, desc, delay = 0 }: TrustPillarProps) {
  return (
    <Reveal delay={delay} className="bg-cream hover:bg-[#faf8f5] transition-colors duration-[400ms] p-12 px-10 relative">
      <div className="w-11 h-11 mb-6 text-terracotta">{icon}</div>
      <div className="font-cormorant text-5xl font-light text-terracotta leading-none mb-2">{number}</div>
      <div className="text-[0.8rem] tracking-[0.1em] uppercase text-sand font-normal">{label}</div>
      <p className="mt-3 text-[0.85rem] text-sand leading-[1.7] font-light">{desc}</p>
    </Reveal>
  );
}
