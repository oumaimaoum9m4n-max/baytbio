import type { GetAllProductsDto, GetSingleProductDto } from "../types/product.dto";

export const toProductDto = (product: any): GetAllProductsDto => ({
  id: product._id.toString(),
  name: product.name,
  nameAr: product.nameAr ?? "",
  price: product.price,
  stock: product.stock ?? 0,
  unit: product.unit,
  status: product.status ?? "enabled",
  images: product.images ?? [],
  rating: product.rating ?? 0,
  alertThreshold: product.alertThreshold ?? 0,
  createdAt: product.createdAt?.toISOString?.() ?? product.createdAt ?? "",
  description: product.description ?? "",
  shortDescription: product.shortDescription ?? "",
  tags: product.tags ?? [],
});

export const toProductDetailDto = (product: any): GetSingleProductDto => ({
  ...toProductDto(product),
  deliveryTax: product.deliveryTax ?? 0,
  relatedProducts: (product.relatedProducts ?? []).map((r: any) => ({
    id: r.id?.toString() ?? "",
    name: r.name ?? "",
    mainImage: r.mainImage ?? "",
  })),
});
