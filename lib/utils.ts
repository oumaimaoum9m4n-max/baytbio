import { clsx, type ClassValue } from "clsx";
import { tv, type VariantProps } from "tailwind-variants";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Re-export tv for component variants */
export { tv, type VariantProps };
