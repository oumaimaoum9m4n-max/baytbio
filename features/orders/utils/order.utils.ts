import { init } from "@paralleldrive/cuid2";

export const DELIVERY_FEE = 20;
import type {
  GetAllOrdersDto,
  GetSingleOrderDto,
} from "../types/order.dto";
import type { PopulatedOrderItem } from "../types/order";

const createShortId = init({ length: 6 });

export const generateOrderId = () => `CO-${createShortId()}`;

const toPopulatedItem = (raw: unknown): PopulatedOrderItem => {
  const item = raw as {
    quantity?: number;
    productId?: {
      _id?: { toString: () => string } | string;
      name?: string;
      unit?: string;
      price?: number;
      images?: string[];
    } | string;
  };

  const quantity = item.quantity ?? 0;

  if (item.productId && typeof item.productId === "object") {
    const p = item.productId;
    const productId =
      typeof p._id === "string" ? p._id : (p._id?.toString() ?? "");
    const price = p.price ?? 0;
    return {
      productId,
      quantity,
      name: p.name ?? "Produit supprimé",
      unit: p.unit ?? "",
      price,
      image: p.images?.[0] ?? "",
      lineTotal: price * quantity,
    };
  }

  return {
    productId: typeof item.productId === "string" ? item.productId : "",
    quantity,
    name: "Produit supprimé",
    unit: "",
    price: 0,
    image: "",
    lineTotal: 0,
  };
};

export const toOrderDto = (order: any): GetAllOrdersDto => {
  const items: PopulatedOrderItem[] = (order.items ?? []).map(toPopulatedItem);
  const total = items.reduce((sum, it) => sum + it.lineTotal, 0);

  return {
    id: order._id?.toString?.() ?? order._id ?? "",
    fullName: order.fullName ?? "",
    phoneNumber: order.phoneNumber ?? "",
    email: order.email ?? "",
    fullAddress: order.fullAddress ?? "",
    deliveryCity: order.deliveryCity ?? "",
    deliveryFee: order.deliveryFee ?? 0,
    deliveryDate: order.deliveryDate ?? "",
    status: order.status ?? "pending",
    items,
    total,
    itemsCount: items.reduce((sum, it) => sum + it.quantity, 0),
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt ?? "",
  };
};

export const toOrderDetailDto = (order: any): GetSingleOrderDto => ({
  ...toOrderDto(order),
  updatedAt: order.updatedAt?.toISOString?.() ?? order.updatedAt ?? "",
});

export const ORDER_STATUS_STYLE: Record<
  "pending" | "confirmed" | "delivered" | "cancelled",
  { chipColor: "warning" | "primary" | "success" | "danger"; dot: string }
> = {
  pending: { chipColor: "warning", dot: "#C9960C" },
  confirmed: { chipColor: "primary", dot: "#3A6B9E" },
  delivered: { chipColor: "success", dot: "#2D5A3D" },
  cancelled: { chipColor: "danger", dot: "#C44B3C" },
};
