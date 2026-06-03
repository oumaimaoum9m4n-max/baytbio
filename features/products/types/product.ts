export type ProductStatus = "enabled" | "disabled";

export type DeliveryDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type RelatedProduct = {
  id: string;
  name: string;
  mainImage: string;
};

export type Product = {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  stock: number;
  description: string;
  shortDescription: string;
  images: string[];
  rating: number;
  tags: string[];
  unit: string;
  alertThreshold: number;
  status: ProductStatus;
  deliveryDays: DeliveryDay[];
  deliveryTax: number;
  relatedProducts: RelatedProduct[];
  createdAt: string;
  updatedAt: string;
};
