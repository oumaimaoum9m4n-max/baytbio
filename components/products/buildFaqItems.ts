import type { FaqItem } from "./StoryAccordion";

const GENERIC_FAQ: FaqItem[] = [
  {
    question: "Comment commander ?",
    answer:
      "Ajoutez le produit à votre panier ou contactez-nous directement sur WhatsApp. Nous confirmons votre commande et organisons la livraison à Casablanca ou Rabat.",
  },
  {
    question: "Quelle est la fraîcheur garantie ?",
    answer:
      "Nos produits sont préparés et livrés dans la journée selon les disponibilités. Chaque lot est contrôlé avant expédition depuis notre ferme.",
  },
];

const PACK_FAQ: FaqItem[] = [
  {
    question: "Que contient le pack ?",
    answer:
      "Le pack regroupe une sélection de nos produits phares pour une semaine. Le détail exact est indiqué dans la description du produit.",
  },
  {
    question: "Puis-je personnaliser le pack ?",
    answer:
      "Oui — contactez-nous sur WhatsApp et nous adapterons les quantités selon la taille de votre famille.",
  },
];

export function buildFaqItems(tags: string[], isPack: boolean): FaqItem[] {
  const faqTags = tags.filter((t) => t.startsWith("faq:"));
  if (faqTags.length >= 2) {
    return faqTags.map((t) => {
      const body = t.slice(4);
      const [question, ...rest] = body.split("|");
      return {
        question: question?.trim() || "Question",
        answer: rest.join("|").trim() || "",
      };
    });
  }

  if (isPack) return PACK_FAQ;
  return GENERIC_FAQ;
}

export function buildTrustItems(
  shortDescription: string,
  tags: string[],
): { icon: string; text: string }[] {
  const fromTags = tags
    .filter((t) => !t.startsWith("faq:") && t !== "pack")
    .slice(0, 4)
    .map((text, i) => ({
      icon: ["🌿", "✓", "🕔", "🥛"][i] ?? "✓",
      text,
    }));

  if (fromTags.length >= 2) return fromTags;

  const lines = shortDescription
    .split(/[•\n|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 4);

  if (lines.length >= 2) {
    return lines.map((text, i) => ({
      icon: ["🌿", "✓", "🕔", "🥛"][i] ?? "✓",
      text,
    }));
  }

  if (shortDescription) {
    return [{ icon: "✓", text: shortDescription }];
  }

  return [
    { icon: "🌿", text: "100% naturel, sans additifs" },
    { icon: "🕔", text: "Récolté et livré frais" },
    { icon: "✓", text: "Contrôle qualité à chaque lot" },
    { icon: "🚚", text: "Livraison Casablanca & Rabat" },
  ];
}
