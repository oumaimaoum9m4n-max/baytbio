import Reveal from "./Reveal";

interface TestimonialCardProps {
  text: string;
  authorName: string;
  authorDetail: string;
  initial: string;
  featured?: boolean;
  direction?: "up" | "left" | "right";
}

export default function TestimonialCard({
  text,
  authorName,
  authorDetail,
  initial,
  featured = false,
  direction = "up",
}: TestimonialCardProps) {
  return (
    <Reveal direction={direction} delay={featured ? 0 : undefined} className={featured ? "-translate-y-4" : ""}>
      <div
        className={`relative rounded-[4px] transition-all duration-[400ms] hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(44,44,44,0.1)] ${
          featured
            ? "p-[52px] bg-olive hover:-translate-y-[22px] hover:shadow-[0_24px_60px_rgba(44,44,44,0.3)]"
            : "p-10 bg-linen"
        }`}
      >
        <span
          className={`absolute top-5 right-5 text-[0.65rem] tracking-[0.1em] uppercase flex items-center gap-1 before:content-['✓'] before:w-4 before:h-4 before:rounded-full before:flex before:items-center before:justify-center before:text-[0.6rem] ${
            featured ? "text-cream before:bg-cream/10" : "text-olive-light before:bg-olive-light/15"
          }`}
        >
          Vérifié
        </span>
        <div className={`flex gap-0.5 mb-5 ${featured ? "text-terra-light" : "text-terracotta"} text-[0.9rem]`}>
          ★★★★★
        </div>
        <p
          className={`font-cormorant italic font-light leading-[1.7] mb-7 ${
            featured ? "text-cream text-[1.25rem]" : "text-brown text-[1.15rem]"
          }`}
        >
          {text}
        </p>
        <div className="flex items-center gap-3.5">
          <div
            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center font-cormorant text-[1.1rem] font-medium shrink-0 ${
              featured ? "bg-cream/10 text-terra-light" : "bg-cream text-terracotta"
            }`}
          >
            {initial}
          </div>
          <div>
            <div className={`text-[0.85rem] font-medium ${featured ? "text-cream" : "text-brown"}`}>{authorName}</div>
            <div className={`text-[0.72rem] tracking-[0.08em] uppercase mt-0.5 ${featured ? "text-terra-light" : "text-sand"}`}>
              {authorDetail}
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
