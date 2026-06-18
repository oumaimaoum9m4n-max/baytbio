import { z } from "zod";
import type { Product } from "./product";

export const RelatedProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  mainImage: z.string(),
});

export const CreateOrUpdateProductSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  nameAr: z.string().min(1, "Le nom en arabe est obligatoire"),
  price: z.number({
    error : 'Le prix est obligatoire'
  }).min(1, "Le prix est obligatoire"),
  stock: z.number().min(0).default(0),
  description: z.string().default(""),
  shortDescription: z.string().min(1, "La description courte est obligatoire"),
  images: z.array(z.string()).min(1, 'Au moins une image').default([]),
  tags: z.array(z.string()).default([]),
  unit: z.string().min(1, "L'unité est obligatoire"),
  alertThreshold: z.number().min(0).default(0),
  status: z.enum(["enabled", "disabled"]).default("enabled"),
  deliveryTax: z.number().min(0).default(0),
  relatedProducts: z.array(RelatedProductSchema).default([]),
});

export type CreateOrUpdateProductDto = z.infer<typeof CreateOrUpdateProductSchema>;

export type GetAllProductsDto = Pick<
  Product,
  | "id"
  | "name"
  | "nameAr"
  | "price"
  | "stock"
  | "unit"
  | "status"
  | "images"
  | "rating"
  | "alertThreshold"
  | "createdAt"
  | "description"
  | "shortDescription"
  | "tags"
>;

export type GetSingleProductDto = GetAllProductsDto &
  Pick<Product, "deliveryTax" | "relatedProducts">;

export type GetTopProductsDto = {
  id: string;
  name: string;
  price: number;
  stock: number;
  unit: string;
  images: string[];
  shortDescription: string;
  tags: string[];
  totalSold: number;
};
