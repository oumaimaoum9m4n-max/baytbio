// TODO: replace with the real WhatsApp number
export const WHATSAPP_NUMBER = "212660786333";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// TODO: replace with real social media URLs
export const FACEBOOK_URL = "https://www.facebook.com/baytbio";
export const INSTAGRAM_URL = "https://www.instagram.com/baytbio";

export type BadgeVariant = "terracotta" | "olive" | "sand";

export interface Product {
  id: string;
  name: string;
  arabic?: string;
  tagline: string;
  price: number;
  unit: string;
  badge: { label: string; variant: BadgeVariant };
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "oeufs",
    name: "Petit Pack d'Œufs",
    arabic: "بيض بلدي",
    tagline: "Pour les petites familles. Goût authentique garanti.",
    price: 18,
    unit: "boîte de 6",
    badge: { label: "Frais", variant: "olive" },
    image: "/images/oeufs.png",
  },
  {
    id: "lait",
    name: "Lait Demi-Écrémé",
    arabic: "حليب",
    tagline: "Tout le goût du lait de ferme, avec moins de matière grasse.",
    price: 10,
    unit: "litre",
    badge: { label: "Léger", variant: "terracotta" },
    image: "/images/lait.png",
  },
  {
    id: "fromage",
    name: "Fromage Blanc Frais",
    tagline: "Parfait pour le petit-déjeuner ou vos recettes.",
    price: 20,
    unit: "200g",
    badge: { label: "Onctueux", variant: "sand" },
    image: "/images/fromage.png",
  },
];
