import Image from "next/image";
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
    <section className="relative min-h-[100dvh] pt-[80px] overflow-hidden flex items-end">
      {/* Background */}
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

      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, hsl(145.95deg 45.68% 15.88% / 81%) 0%, hsl(145.95deg 45.68% 15.88% / 75%) 25%, rgb(22 59 38 / 56%) 55%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-[3] w-full max-w-[720px] px-6 sm:px-10 lg:px-20 pb-24 sm:pb-28 lg:pb-32">
        
        {/* Arabic line */}
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

        {/* Title */}
        <h1 className="font-cormorant font-light leading-[1.02] text-cream mb-8 text-[clamp(2.8rem,5vw,6rem)]">
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
          className="text-base font-light text-cream/70 leading-[1.8] max-w-[520px] mb-10"
          style={{ opacity: 0, animation: "fadeUp 0.8s 1.5s forwards" }}
        >
          Des produits naturels, frais et soigneusement sélectionnés pour
          retrouver le vrai goût du quotidien.
        </p>

        {/* Buttons */}
        <div
          className="flex flex-wrap gap-4 items-center"
          style={{ opacity: 0, animation: "fadeUp 0.8s 1.8s forwards" }}
        >
          <Link
            href="/products"
            className="px-8 py-4 bg-terracotta text-cream font-sans text-[0.82rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:bg-terra-light hover:-translate-y-0.5"
          >
            Découvrir nos produits
          </Link>

          <a
            href="#story"
            className="px-7 py-4 bg-olive-light text-cream border border-sand/40 font-sans text-[0.82rem] tracking-[0.12em] uppercase rounded-[2px] transition-all duration-300 hover:bg-olive hover:border-olive"
          >
            Notre histoire →
          </a>
        </div>

        {/* Trust line */}
        <p
          className="mt-8 text-[0.7rem] tracking-[0.15em] text-cream/70 uppercase"
          style={{ opacity: 0, animation: "fadeUp 0.8s 2.1s forwards" }}
        >
          Produits fermiers • Frais du jour • Circuit court • Livraison à domicile
        </p>
      </div>
    </section>
  );
}