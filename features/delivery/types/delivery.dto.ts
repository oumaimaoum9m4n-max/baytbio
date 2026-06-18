import { z } from "zod";
import type { DeliveryCity, DeliveryDay } from "./delivery";

/* ── Cities ── */
export const CreateOrUpdateDeliveryCitySchema = z.object({
  cityName: z.string().min(1, "Le nom de la ville est obligatoire"),
  deliveryTax: z
    .number({ error: "Les frais de livraison sont obligatoires" })
    .min(0, "Les frais ne peuvent pas être négatifs"),
});

export type CreateOrUpdateDeliveryCityDto = z.infer<
  typeof CreateOrUpdateDeliveryCitySchema
>;

export type GetAllDeliveryCitiesDto = Pick<
  DeliveryCity,
  "id" | "cityName" | "deliveryTax" | "createdAt"
>;

/* ── Days ── */
export const CreateOrUpdateDeliveryDaySchema = z.object({
  deliveryDay: z
    .number({ error: "Le jour de livraison est obligatoire" })
    .int()
    .min(0)
    .max(6),
  cutoffHour: z
    .number({ error: "L'heure limite est obligatoire" })
    .int()
    .min(0, "Heure invalide (0–23)")
    .max(23, "Heure invalide (0–23)"),
});

export type CreateOrUpdateDeliveryDayDto = z.infer<
  typeof CreateOrUpdateDeliveryDaySchema
>;

export type GetAllDeliveryDaysDto = Pick<
  DeliveryDay,
  "id" | "deliveryDay" | "cutoffHour" | "createdAt"
>;

/* ── Sort options ── */
export const DELIVERY_CITY_SORT_OPTIONS = [
  { key: "createdAt_desc", label: "Plus récentes" },
  { key: "createdAt_asc", label: "Plus anciennes" },
  { key: "name_asc", label: "Ville (A→Z)" },
  { key: "name_desc", label: "Ville (Z→A)" },
  { key: "tax_asc", label: "Frais (croissant)" },
  { key: "tax_desc", label: "Frais (décroissant)" },
] as const;
