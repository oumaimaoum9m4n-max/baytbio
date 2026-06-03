/** Accent colours cycled by product index (reference HTML). */
export const PRODUCT_ACCENTS = [
  "#c8901a",
  "#5a7a8a",
  "#b87030",
  "#4a6840",
  "#d4883c",
] as const;

export function getProductAccent(index: number): string {
  return PRODUCT_ACCENTS[index % PRODUCT_ACCENTS.length];
}

export function formatProductNum(index: number): string {
  return String(index + 1).padStart(2, "0");
}

const FRENCH_CARDINALS: Record<number, string> = {
  1: "un",
  2: "deux",
  3: "trois",
  4: "quatre",
  5: "cinq",
  6: "six",
  7: "sept",
  8: "huit",
  9: "neuf",
  10: "dix",
  11: "onze",
  12: "douze",
  13: "treize",
  14: "quatorze",
  15: "quinze",
  16: "seize",
  17: "dix-sept",
  18: "dix-huit",
  19: "dix-neuf",
  20: "vingt",
};

export function frenchCardinal(n: number): string {
  return FRENCH_CARDINALS[n] ?? String(n);
}

export function getDisplayTags(tags: string[] = []): string[] {
  return tags.filter((t) => t !== "pack" && !t.startsWith("faq:"));
}

export function isPackProduct(
  tags: string[] | undefined,
  index: number,
  total: number,
): boolean {
  return tags?.includes("pack") === true;
}

export function renderStars(rating: number): string {
  return "★".repeat(rating);
}

/** Split product name for display: first line plain, remainder italic. */
export function splitProductName(name: string): { lead: string; emphasis: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 2) {
    return { lead: name, emphasis: "" };
  }
  const mid = Math.ceil(parts.length / 2);
  return {
    lead: parts.slice(0, mid).join(" "),
    emphasis: parts.slice(mid).join(" "),
  };
}
