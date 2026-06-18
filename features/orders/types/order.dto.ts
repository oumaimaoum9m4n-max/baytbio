import { z } from "zod";
import type { Order, OrderStatus, PopulatedOrderItem } from "./order";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const ORDER_SORT_OPTIONS = [
  { key: "default", label: "Par défaut (en attente d'abord)" },
  { key: "createdAt_desc", label: "Plus récentes" },
  { key: "createdAt_asc", label: "Plus anciennes" },
] as const;

export const OrderItemSchema = z.object({
  productId: z.string().min(1, "Produit requis"),
  quantity: z.number().int().min(1, "Quantité minimum: 1"),
});

export const CreateOrUpdateOrderSchema = z.object({
  fullName: z.string().min(1, "Le nom complet est obligatoire"),
  phoneNumber: z
    .string()
    .min(9, "Numéro de téléphone invalide")
    .max(20, "Numéro de téléphone invalide"),
  email: z
    .string()
    .email("Email invalide")
    .or(z.literal(""))
    .optional()
    .default(""),
  fullAddress: z.string().min(1, "L'adresse est obligatoire"),
  deliveryCity: z.string().min(1, "La ville de livraison est obligatoire"),
  deliveryFee: z.number().min(0).default(0),
  deliveryDate: z.string().min(1, "La date de livraison est obligatoire"),
  status: z.enum(ORDER_STATUSES).default("pending"),
  items: z
    .array(OrderItemSchema)
    .min(1, "Ajoutez au moins un produit à la commande"),
});

export type CreateOrUpdateOrderDto = z.infer<typeof CreateOrUpdateOrderSchema>;

export type GetAllOrdersDto = Pick<
  Order,
  | "id"
  | "fullName"
  | "phoneNumber"
  | "email"
  | "fullAddress"
  | "deliveryCity"
  | "deliveryFee"
  | "deliveryDate"
  | "status"
  | "createdAt"
> & {
  items: PopulatedOrderItem[];
  total: number;
  itemsCount: number;
};

export type GetSingleOrderDto = GetAllOrdersDto & {
  updatedAt: string;
};

export type OrderKpis = {
  total: number;
  pending: number;
  confirmed: number;
  delivered: number;
  cancelled: number;
};
