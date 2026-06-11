export default function CommitmentsSection() {
    const commitments = [
        {
            title: "Produits naturels",
            description:
                "Des produits sélectionnés avec soin pour préserver leur authenticité et leur qualité.",
            icon: (
                <svg
                    viewBox="0 0 44 44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                >
                    <path d="M34 10C20 10 10 20 10 34c14 0 24-10 24-24z" />
                    <path d="M14 30c5-5 10-10 16-14" />
                </svg>
            ),
        },
        {
            title: "Fraîcheur garantie",
            description:
                "Une attention particulière portée à chaque étape, du producteur jusqu’à votre table.",
            icon: (
                <svg
                    viewBox="0 0 44 44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                >
                    <path d="M22 7C17 13 13 18 13 24a9 9 0 1018 0c0-6-4-11-9-17z" />
                </svg>
            ),
        },
        {
            title: "Qualité sans compromis",
            description:
                "Chez Bayt Bio, nous croyons au naturel, à la simplicité et à la confiance.",
            icon: (
                <svg
                    viewBox="0 0 44 44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                >
                    <circle cx="22" cy="18" r="9" />
                    <path d="M17 18l3 3 6-6" />
                    <path d="M17 26l-2 9 7-4 7 4-2-9" />
                </svg>
            ),
        },
        {
            title: "Livraison simplifiée",
            description:
                "Un service pensé pour vous permettre de recevoir vos produits facilement et sereinement.",
            icon: (
                <svg
                    viewBox="0 0 44 44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-full h-full"
                >
                    <circle cx="22" cy="22" r="16" />
                    <path d="M22 14v8l5 4" />
                </svg>
            ),
        },
    ];

    return (
        <section className="relative py-20 bg-cream overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-olive" />
                <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full border border-olive" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
                {/* Header */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-block text-terracotta uppercase tracking-[0.25em] text-xs font-medium mb-4">
                        Nos engagements
                    </span>

                    <h2 className="font-cormorant text-[clamp(2.8rem,5vw,4.5rem)] font-light text-brown leading-none mb-6">
                        Les engagements <em className="italic text-terracotta">Bayt Bio</em> 
                    </h2>
{/* 
                    <p className="text-olive/70 text-lg leading-relaxed max-w-2xl mx-auto">
                        Nous sélectionnons chaque produit avec exigence afin de vous offrir
                        une expérience simple, authentique et fidèle aux valeurs du terroir.
                    </p> */}
                </div>

                {/* Commitments grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {commitments.map((item, index) => (
                        <article
                            key={item.title}
                            className="group bg-white border border-sand/20 p-10 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                        >
                            <div className="mb-8">
                                <span className="font-cormorant text-7xl leading-none text-terracotta/20 group-hover:text-terracotta/30 transition-colors duration-300">
                                    0{index + 1}
                                </span>
                            </div>

                            <h3 className="font-cormorant text-3xl text-olive mb-5 leading-tight">
                                {item.title}
                            </h3>

                            <p className="text-olive/70 leading-relaxed text-[15px]">
                                {item.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}