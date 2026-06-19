export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export type OrderItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
  deliveryCity: string;
  deliveryFee: number;
  /** ISO "YYYY-MM-DD". */
  deliveryDate: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type PopulatedOrderItem = OrderItem & {
  name: string;
  unit: string;
  price: number;
  image: string;
  lineTotal: number;
};
