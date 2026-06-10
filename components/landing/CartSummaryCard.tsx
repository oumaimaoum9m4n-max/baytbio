"use client";

interface CartSummaryCardProps {
  subtotal: number;
  delivery: number;
  total: number;
  onCheckout: () => void;
  onWhatsApp: () => void;
  isEmpty: boolean;
}

const TRUST_ITEMS = [
  {
    text: "Paiement sécurisé",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85A28" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    text: "Livraison à domicile partout au Maroc",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85A28" strokeWidth="1.8">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    text: "Satisfait ou remboursé",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85A28" strokeWidth="1.8">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
      </svg>
    ),
  },
  {
    text: "Commande avant 14h",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B85A28" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
];

export default function CartSummaryCard({
  subtotal,
  delivery,
  total,
  onCheckout,
  onWhatsApp,
  isEmpty,
}: CartSummaryCardProps) {
  return (
    <div className="bg-cream border border-olive rounded-[3px] overflow-hidden">
      {/* Header */}
      <div className="bg-olive px-7 py-[22px] flex items-center justify-between">
        <span className="font-cormorant text-[1.25rem] font-light text-[#F5EDD8]">
          Récapitulatif
        </span>
        <span className="font-arabic text-[0.85rem] text-cream">
          ملخص الطلب
        </span>
      </div>

      {/* Body rows */}
      <div className="px-7 py-6">
        <div className="flex justify-between items-center py-2.5 border-b border-[#EBD9B8]">
          <span className="text-[0.8rem] font-light text-[#7A6648]">Sous-total</span>
          <span className="text-[0.88rem] text-[#1C1208] font-normal">{subtotal} DH</span>
        </div>
        <div className="flex justify-between items-center py-2.5">
          <span className="text-[0.8rem] font-light text-[#7A6648]">Livraison</span>
          <span className="text-[0.88rem] text-[#1C1208] font-normal">{delivery} DH</span>
        </div>
      </div>

      {/* Total row */}
      <div className="flex justify-between items-baseline px-7 py-5 bg-terra-dark border-t border-[rgba(184,90,40,0.15)]">
        <span className="text-[0.72rem] tracking-[0.14em] uppercase text-cream">
          Total à payer
        </span>
        <div className="font-cormorant text-[2.4rem] font-normal text-olive leading-none">
          {total}{" "}
          <span className="text-[0.85rem] font-light font-sans text-cream">DH</span>
        </div>
      </div>

      {/* Payment chip */}
      <div className="flex items-center gap-2 px-7 py-2.5 bg-[#E8EDDE] border-t border-[#EBD9B8] text-[0.72rem] text-[#5A6A38] tracking-[0.06em]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
        Paiement en espèces à la livraison
      </div>

      {/* Trust grid */}
      <div className="grid grid-cols-2 gap-2.5 px-7 py-4 border-t border-[#EBD9B8]">
        {TRUST_ITEMS.map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-[0.7rem] text-[#7A6648] font-light">
            {icon}
            {text}
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="px-7 py-5 flex flex-col gap-2.5">
        <button
          onClick={onCheckout}
          disabled={isEmpty}
          className="w-full h-[54px] bg-terracotta text-[#F5EDD8] border-none font-sans text-[0.82rem] tracking-[0.14em] uppercase rounded-[3px] transition-all duration-300 flex items-center justify-center gap-2.5 hover:bg-terra-dark hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(184,90,40,0.35)] disabled:bg-terracotta disabled:cursor-not-allowed disabled:hover:bg-terra-dark disabled:hover:shadow-none"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          Passer la commande
        </button>

        <button
          onClick={onWhatsApp}
          className="w-full h-12 bg-[#25D366] text-white border-none font-sans text-[0.76rem] tracking-[0.1em] uppercase rounded-[3px] transition-all duration-300 flex items-center justify-center gap-[9px] hover:bg-[#1AB854] hover:-translate-y-px"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Commander par WhatsApp
        </button>

        <p className="text-center text-[0.72rem] text-[#A89070] flex items-center justify-center gap-2">
          <a href="/products" className="text-[#B85A28] font-normal no-underline hover:underline">
            ← Continuer mes achats
          </a>
        </p>
      </div>
    </div>
  );
}
