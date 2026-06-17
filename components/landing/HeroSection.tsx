import Image from "next/image";
import { WHATSAPP_URL } from "./constants";
import Link from "next/link";

const words = [
  { text: "Du", delay: "0.5s" },
  { text: "producteur", delay: "0.7s" },
];
const emWords = [
  { text: "à", delay: "0.9s" },
  { text: "votre", delay: "1.1s" },
  { text: "table", delay: "1.3s" },
];

export default function HeroSection() {
  return (
    <section className="min-h-screen relative overflow-hidden flex items-center md:items-end">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home.png"
          alt="bayt bio"
          fill
          priority
          sizes="100vw"
          className="object-cover [filter:saturate(0.75)_contrast(1.05)]"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, hsl(145.95deg 45.68% 15.88% / 81%) 0%, hsl(145.95deg 45.68% 15.88% / 75%) 25%, rgb(22 59 38 / 56%) 55%, transparent 100%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-[3] w-full max-w-[720px] px-20 pb-[100px] max-md:px-6 max-md:pt-25">
        

        {/* Headline */}
        <h1 className="font-cormorant text-[clamp(3.5rem,6vw,6.5rem)] font-light leading-[1.02] text-cream mb-8 max-md:text-[clamp(2.4rem,10vw,3.5rem)]">
          {words.map((w) => (
            <span
              key={w.text}
              className="inline-block"
              style={{
                opacity: 0,
                transform: "translateY(40px)",
                animation: `fadeUp 0.7s ${w.delay} forwards`,
              }}
            >
              {w.text}&nbsp;
            </span>
          ))}
          <br />
          <em className="text-terra-light not-italic">
            {emWords.map((w) => (
              <span
                key={w.text}
                className="inline-block"
                style={{
                  opacity: 0,
                  transform: "translateY(40px)",
                  animation: `fadeUp 0.7s ${w.delay} forwards`,
                }}
              >
                {w.text}&nbsp;
              </span>
            ))}
          </em>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base font-light text-cream/[0.72] leading-[1.85] max-w-[480px] mb-12"
          style={{ opacity: 0, animation: "fadeUp 0.8s 1.5s forwards" }}
        >
          Des produits naturels, frais et soigneusement sélectionnés pour
          retrouver le vrai goût du quotidien.
        </p>

        {/* Arabic subtitle */}
        <p
          className="font-arabic text-[1.1rem] text-[rgba(201,180,138,0.8)] tracking-[0.05em] mb-5"
          style={{
            opacity: 0,
            transform: "translateY(20px)",
            animation: "fadeUp 1s 0.3s forwards",
          }}
          dir="rtl"
        >
        خيرات بلادي، توصل حتى لعندك عادي

        </p>

        {/* CTAs */}
        <div
          className="flex gap-4 items-center max-md:flex-col max-md:items-start"
          style={{ opacity: 0, animation: "fadeUp 0.8s 1.8s forwards" }}
        >
          <Link
            href="/products"
            className="inline-block px-9 py-4 bg-terracotta text-cream font-sans text-[0.82rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:bg-terra-light hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(212,136,60,0.35)]"
          >
            Découvrir nos produits
          </Link>
          <a
            href="#story"
            className="inline-block px-7 py-4 bg-olive-light text-cream border border-sand/40 font-sans text-[0.82rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:bg-olive hover:border-olive"
          >
            Notre histoire →
          </a>
        </div>
       {/* Trust line */}
<p
  className="mt-8 text-[0.70rem] tracking-[0.15em] text-cream/70 uppercase"
  style={{ opacity: 0, animation: "fadeUp 0.8s 2.1s forwards" }}
>
  Produits fermiers • Frais du jour • Circuit court • Livraison à domicile
</p>
      </div>
    </section>
  );
}
