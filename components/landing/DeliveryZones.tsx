"use client";

import { useEffect } from "react";
import Reveal from "./Reveal";

export default function DeliveryZones() {
  useEffect(() => {
    // Nettoyé : plus de scripts externes (map supprimée)
  }, []);

  const zones = [
    {
      zone: "Casablanca",
      time: "24h",
      cities: "Casablanca, Mohammedia, Bouskoura",
      status: "Express",
    },
    {
      zone: "Rabat-Salé",
      time: "24-48h",
      cities: "Rabat, Salé, Témara",
      status: "Rapide",
    },
    {
      zone: "Nord",
      time: "48h",
      cities: "Tanger, Tétouan, Larache",
      status: "Standard",
    },
    {
      zone: "Centre",
      time: "24-48h",
      cities: "Fès, Meknès, Khouribga",
      status: "Rapide",
    },
    {
      zone: "Oriental",
      time: "48-72h",
      cities: "Oujda, Nador, Berkane",
      status: "Standard",
    },
    {
      zone: "Sud",
      time: "48-72h",
      cities: "Marrakech, Agadir, Safi",
      status: "Standard",
    },
    {
      zone: "Atlas",
      time: "48-72h",
      cities: "Beni Mellal, Azilal",
      status: "Standard",
    },
    {
      zone: "Sud-Est",
      time: "72h",
      cities: "Ouarzazate, Errachidia",
      status: "Standard",
    },
  ];

  return (
    <section className="bg-linen px-6 py-24 md:px-[72px] md:py-32 overflow-hidden">
      {/* HEADER PRINCIPAL */}
      <Reveal>
        <div className="text-center mb-20">
          <span className="text-terracotta uppercase tracking-[0.25em] text-xs font-semibold bg-terracotta/5 px-4 py-1.5 rounded-full inline-block animate-fade-in">
            Logistique Nationale
          </span>

          <h2 className="text-4xl md:text-6xl font-light font-cormorant text-brown mt-6 leading-tight">
            Nous couvrons tout le
            <span className="text-terracotta block md:inline md:ml-3 italic font-normal inline-block hover:scale-105 transition-transform duration-500 cursor-default">Royaume</span>
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-sand text-base md:text-lg leading-relaxed">
            Bayt Bio s&apos;engage à acheminer vos commandes de manière sécurisée dans toutes les régions du Maroc, en connectant les coopératives locales directement à votre table.
          </p>
        </div>
      </Reveal>

      {/* BLOC 1 : GRILLE DES ZONES DESIGN ENRICHI */}
      <Reveal delay={100}>
        <div className="bg-cream rounded-[32px] p-8 md:p-14 shadow-[0_10px_40px_-15px_rgba(194,124,91,0.08)] border border-[#f3ebe5]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#f3ebe5]">
            <div>
              <h3 className="text-3xl font-cormorant text-brown font-medium">
                Destinations &amp; Délais de prise en charge
              </h3>
              <p className="text-sand text-sm mt-2">
                Trouvez votre localité pour estimer le délai moyen de réception.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute"></span> 24h Garanti
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {zones.map((item, index) => (
              <div
                key={index}
                className="group relative bg-cream/40 rounded-2xl p-6 border border-transparent hover:border-terracotta/30 hover:bg-white hover:shadow-[0_20px_30px_rgba(194,124,91,0.06)] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-brown group-hover:text-terracotta transition-colors duration-300">
                      {item.zone}
                    </h4>
                    <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded transition-transform group-hover:scale-105 duration-300 ${
                      item.status === "Express" 
                        ? "bg-emerald-100 text-emerald-800" 
                        : item.status === "Rapide" 
                        ? "bg-amber-100 text-amber-800" 
                        : "bg-stone-200 text-stone-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <p className="text-sm text-sand leading-relaxed line-clamp-2 group-hover:text-brown transition-colors duration-300">
                    {item.cities}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f3ebe5]/60 flex items-center justify-between">
                  <span className="text-xs text-sand/80">Livraison sous :</span>
                  <span className="text-sm font-semibold text-terracotta bg-terracotta/5 group-hover:bg-terracotta group-hover:text-white px-3 py-1 rounded-lg transition-all duration-300">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

     {/* BLOC 2 : ETAPES DE LIVRAISON */}
<Reveal delay={200}>
  <div className="mt-24">
    <div className="text-center mb-16">
      <h3 className="text-3xl font-cormorant text-brown">
        Un processus d&apos;expédition transparent
      </h3>
      <p className="text-sand mt-2 text-sm max-w-lg mx-auto">
        Suivez le parcours de vos produits bio de nos entrepôts jusqu&apos;à votre porte.
      </p>
    </div>

    {/* Conteneur de la grille en position relative pour servir de repère */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative">
      
      {/* LIGNE CONNECTANCE CORRIGÉE : Positionnée à top-[32px] (milieu exact d'un cercle de h-16) */}
      <div className="hidden md:block absolute top-[32px] left-[12%] right-[12%] h-[2px] z-0 overflow-hidden">
        <div 
          className="w-[200%] h-full opacity-30" 
          style={{
            backgroundImage: 'linear-gradient(to right, #C27C5B 50%, transparent 50%)',
            backgroundSize: '16px 2px',
            animation: 'processLineMove 4s linear infinite'
          }}
        />
      </div>

      {/* Injection de la micro-animation */}
      <style jsx global>{`
        @keyframes processLineMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-16px); }
        }
      `}</style>

      {/* Les étapes restent en z-10 pour passer au-dessus de la ligne */}
      {[
        { num: "01", title: "Commande validée", desc: "Traitement instantané et sécurisé dès validation de votre panier." },
        { num: "02", title: "Préparation soignée", desc: "Emballage éco-responsable ajusté pour préserver la fraîcheur." },
        { num: "03", title: "Transit optimisé", desc: "Expédition immédiate via nos transporteurs partenaires spécialisés." },
        { num: "04", title: "Livraison chez vous", desc: "Remise en main propre après notification et prise de rendez-vous." }
      ].map((step, idx) => (
        <div key={idx} className="text-center group relative z-10">
          <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-white text-terracotta text-lg font-bold shadow-sm group-hover:bg-terracotta group-hover:text-white group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 border border-[#f3ebe5]">
            {step.num}
          </div>
          <h4 className="mt-5 font-semibold text-brown text-base group-hover:text-terracotta transition-colors duration-300">{step.title}</h4>
          <p className="text-sm text-sand mt-2 max-w-[220px] mx-auto leading-relaxed">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</Reveal>

      {/* BLOC 3 : PREMIUM PROMISES (BENTO STYLE) */}
      <Reveal delay={250}>
        <div className="mt-28 bg-olive text-white rounded-[32px] p-8 md:p-14 relative overflow-hidden shadow-xl group/bento">
          <div className="absolute right-0 top-0 w-96 h-96 bg-terracotta/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover/bento:bg-terracotta/20 group-hover/bento:scale-110" />
          
          <div className="relative max-w-xl mb-12">
            <span className="text-terracotta text-xs font-semibold uppercase tracking-widest block animate-pulse">Charte Qualité</span>
            <h3 className="text-3xl md:text-4xl font-cormorant mt-3">
              Notre engagement envers votre satisfaction
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Carte 1 */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/[0.09] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center text-terracotta mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <h4 className="font-medium text-lg mb-2">Chaîne logistique agile</h4>
              <p className="text-sm text-linen/70 leading-relaxed">
                Des tournées quotidiennes structurées pour réduire l&apos;empreinte carbone et optimiser les délais par région.
              </p>
            </div>

            {/* Carte 2 */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/[0.09] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center text-terracotta mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <h4 className="font-medium text-lg mb-2">Préservation Isotherme</h4>
              <p className="text-sm text-linen/70 leading-relaxed">
                Emballages spécifiques maintenant la fraîcheur et les qualités nutritionnelles intactes de vos produits biologiques.
              </p>
            </div>

            {/* Carte 3 */}
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/[0.09] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center text-terracotta mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <h4 className="font-medium text-lg mb-2">Suivi par SMS &amp; Appel</h4>
              <p className="text-sm text-linen/70 leading-relaxed">
                Un livreur vous contacte en amont pour valider votre présence et garantir une remise en main propre fluide.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* STATS CHIFFRES */}
      <Reveal delay={300}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14">
          <div className="bg-cream/50 backdrop-blur-sm border border-[#f3ebe5] p-8 text-center rounded-2xl group hover:bg-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-5xl font-cormorant text-terracotta font-medium group-hover:scale-110 transition-transform duration-300">12</h3>
            <p className="text-brown font-medium mt-3 text-sm tracking-wide uppercase">Régions couvertes</p>
            <p className="text-xs text-sand mt-1">Du Nord aux provinces du Sud</p>
          </div>

          <div className="bg-cream/50 backdrop-blur-sm border border-[#f3ebe5] p-8 text-center rounded-2xl group hover:bg-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-5xl font-cormorant text-terracotta font-medium group-hover:scale-110 transition-transform duration-300">24h</h3>
            <p className="text-brown font-medium mt-3 text-sm tracking-wide uppercase">Délai Axe Principal</p>
            <p className="text-xs text-sand mt-1">Casablanca, Rabat et environs</p>
          </div>

          <div className="bg-cream/50 backdrop-blur-sm border border-[#f3ebe5] p-8 text-center rounded-2xl group hover:bg-white hover:shadow-[0_15px_30px_rgba(0,0,0,0.02)] hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-5xl font-cormorant text-terracotta font-medium group-hover:scale-110 transition-transform duration-300">100%</h3>
            <p className="text-brown font-medium mt-3 text-sm tracking-wide uppercase">Traçabilité</p>
            <p className="text-xs text-sand mt-1">Support client dédié à votre écoute</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}