import Reveal from "./Reveal";
import Counter from "./Counter";

const stats = [
  {
    count: 800,
    suffix: "+",
    label: "Familles servies",
    desc: "À Casablanca et Rabat — et leur nombre grandit chaque semaine.",
    delay: 0,
  },
  {
    count: 200,
    suffix: "",
    label: "Poules en plein air",
    desc: "Sur 3 hectares de prairie. Élevées sans cage, sans stress, sans chimie.",
    delay: 100,
  },
  {
    count: 6,
    suffix: "",
    label: "Ans d'expérience",
    desc: "Depuis 2018, nous affinons notre savoir-faire jour après jour.",
    delay: 200,
  },
  {
    count: 5,
    suffix: "h00",
    label: "Heure de récolte",
    desc: "Chaque matin, avant le lever du soleil. La fraîcheur commence là.",
    delay: 300,
  },
];

export default function StatsBand() {
  return (
    <div className="bg-brown py-[72px] px-[72px] grid grid-cols-4 gap-px relative overflow-hidden max-md:grid-cols-2 max-md:px-5 max-md:py-12">
      {/* BELDI watermark */}
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant font-light text-white/[0.018] pointer-events-none select-none whitespace-nowrap tracking-[0.05em]"
        style={{ fontSize: "22vw" }}
      >
        BELDI
      </span>

      {stats.map((s) => (
        <Reveal key={s.label} delay={s.delay}>
          <div className="px-11 py-12 border border-white/[0.05] relative overflow-hidden transition-colors duration-300 hover:bg-white/[0.03] group">
            {/* Top accent line on hover */}
            <span className="absolute top-0 left-0 right-0 h-0.5 bg-terracotta scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
            <div className="font-cormorant text-[4.5rem] font-light text-cream leading-none mb-2.5">
              <Counter to={s.count} suffix={s.suffix} />
            </div>
            <div className="font-sans text-[0.72rem] tracking-[0.14em] uppercase text-sand font-normal">
              {s.label}
            </div>
            <p
              className="font-sans text-[0.8rem] font-light leading-[1.65] mt-2"
              style={{ color: "var(--color-cream)" }}
            >
              {s.desc}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
