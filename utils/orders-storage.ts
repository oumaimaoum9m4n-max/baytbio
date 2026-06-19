const STORAGE_KEY = "baytbio_orders";

export type StoredOrderItem = {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  mainImage: string;
};

export type StoredOrder = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  fullAddress: string;
  deliveryCity: string;
  deliveryDate: string;
  items: StoredOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
};

export function saveOrder(order: StoredOrder): void {
  const orders = getOrders();
  orders.unshift(order);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore quota errors
  }
}

export function getOrders(): StoredOrder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredOrder[]) : [];
  } catch {
    return [];
  }
}
