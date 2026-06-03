import Reveal from "./Reveal";

interface ProcessStepProps {
  num: string;
  time: string;
  title: string;
  desc: string;
  delay?: number;
}

export default function ProcessStep({ num, time, title, desc, delay = 0 }: ProcessStepProps) {
  return (
    <Reveal
      delay={delay}
      className="group bg-transparent p-12 px-10 border border-white/[0.06] relative overflow-hidden transition-colors duration-[400ms] hover:bg-white/[0.03] before:content-[''] before:absolute before:top-0 before:left-0 before:w-0 before:h-0.5 before:bg-terracotta before:transition-[width] before:duration-[600ms] before:[transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] hover:before:w-full"
    >
      <div className="font-cormorant text-[4rem] font-light text-white/[0.06] leading-none mb-6">{num}</div>
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-terracotta mb-3">{time}</div>
      <div className="font-cormorant text-2xl font-normal text-cream mb-3.5 leading-[1.2]">{title}</div>
      <p className="text-[0.82rem] text-cream/80 leading-[1.75] font-light">{desc}</p>
    </Reveal>
  );
}
