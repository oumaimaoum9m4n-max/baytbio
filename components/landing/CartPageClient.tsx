"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/shared/CartContext";
import { WHATSAPP_NUMBER } from "@/components/landing/constants";
import CartItemRow from "./CartItemRow";
import CartSummaryCard from "./CartSummaryCard";

export default function CartPageClient() {
  const router = useRouter();
  const { items, count, removeItem, updateQuantity, clearCart } = useCart();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal;

  const handleWhatsApp = () => {
    const lines = items.map(
      (i) => `• ${i.name} × ${i.quantity} — ${i.price * i.quantity} DH`,
    );
    const msg = [
      "Bonjour, je voudrais commander :",
      ...lines,
      `Sous-total : ${subtotal} DH`,
      "Livraison : à déterminer selon la ville",
      `Total (hors livraison) : ${subtotal} DH`,
    ].join("\n");
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    /* MODIFICATION : Ajout de bg-olive pour que l'espace sous la navbar soit de la même couleur que le header */
    <div className="bg-olive pt-[80px] min-h-screen animate-fade-slide">
      {/* Page Header */}
      <header className="relative overflow-hidden bg-olive px-[72px] pb-12 pt-[52px] max-md:px-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 92% 50%, rgba(200,178,100,0.11), transparent)",
          }}
          aria-hidden
        />
        <p className="relative z-[1] mb-[14px] flex items-center gap-3 font-sans text-[0.68rem] uppercase tracking-[0.22em] text-[rgba(212,200,160,0.45)] before:h-px before:w-6 before:shrink-0 before:bg-[rgba(212,200,160,0.25)] before:content-['']">
          Bayt Bio · Votre sélection
        </p>
        <h1
          className="relative z-10 font-cormorant text-cream font-light leading-[0.92] mb-8"
          style={{ fontSize: "clamp(3.8rem,7vw,8rem)" }}
        >
          Votre
          <em className="italic text-terra-light"> panier.</em>
        </h1>
        <p className="relative z-[1] mt-2.5 font-sans text-[0.83rem] font-light text-[rgba(212,200,160,0.5)]">
          {count > 0
            ? `${count} article${count > 1 ? "s" : ""} · Livraison selon la ville`
            : "Votre panier est vide"}
        </p>
        {count > 0 && (
          <div
            className="pointer-events-none absolute bottom-[-24px] right-[60px] select-none font-cormorant text-[22rem] font-light leading-none text-[rgba(255,255,255,0.025)] max-md:right-6 max-md:text-[40vw]"
            aria-hidden
          >
            {count}
          </div>
        )}
      </header>

      {/* Cart Layout */}
      {/* MODIFICATION : Ajout de bg-white (ou la couleur de fond de votre site) ici pour que le reste du panier reprenne sa couleur normale */}
      <div className="bg-white grid grid-cols-[1fr_400px] items-start max-lg:grid-cols-1">
        {/* Items column */}
        <div className="px-[72px] py-12 border-r border-[#EBD9B8] max-lg:border-r-0 max-md:px-6">
          {/* Column header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#EBD9B8]">
            <span className="text-[0.68rem] tracking-[0.18em] uppercase text-[#7A6648] font-normal">
              Produits sélectionnés
            </span>
            <span className="font-cormorant text-[1.1rem] font-light text-[#7A6648]">
              {count} article{count !== 1 ? "s" : ""}
            </span>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="bg-transparent border-none font-sans text-[0.68rem] tracking-[0.1em] uppercase text-[rgba(122,100,72,0.4)] transition-colors duration-300 flex items-center gap-1.5 hover:text-[#B85A28]"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                </svg>
                Vider le panier
              </button>
            )}
          </div>

          {/* Items list or empty state */}
          {items.length > 0 ? (
            <div>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQtyChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-5">
              <div className="text-[#A89070] opacity-35 mb-2">
                <svg
                  width="54"
                  height="54"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <h2 className="font-cormorant text-[2.2rem] font-light text-[#1C1208]">
                Votre panier est vide
              </h2>
              <p className="text-[0.88rem] text-[#7A6648] font-light max-w-[340px] leading-[1.75]">
                Découvrez nos produits fermiers et ajoutez vos favoris à votre
                panier.
              </p>
              <button
                onClick={() => router.push("/products")}
                className="mt-3 px-8 py-3.5 bg-terracotta text-[#F5EDD8] border-none font-sans text-[0.75rem] tracking-[0.12em] uppercase rounded-[3px] transition-all duration-300 hover:bg-terra-dark hover:-translate-y-0.5"
              >
                Voir nos produits →
              </button>
            </div>
          )}
        </div>

        {/* Summary column */}
        <div className="px-11 py-12 sticky top-[68px] max-lg:px-6 max-lg:border-t max-lg:border-[#EBD9B8]">
          <CartSummaryCard
            subtotal={subtotal}
            delivery={0}
            total={total}
            onCheckout={() => router.push("/checkout")}
            onWhatsApp={handleWhatsApp}
            isEmpty={items.length === 0}
          />
        </div>
      </div>
    </div>
  );
}