"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";

const STORAGE_KEY = "cart_items";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  /** Latest known available stock — used to cap quantities client-side. */
  stock: number;
  unit: string;
  mainImage: string;
  quantity: number;
}

interface ToastState {
  show: boolean;
  variant: "success" | "error";
  /** Product name (success) — shown with price. */
  name: string;
  price: number;
  /** Reason shown for the error variant. */
  message: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  toast: ToastState;
  /** Adds `quantity` units of a product, capped by its stock. */
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  /** Shows an error toast with a custom message (e.g. stock limit reached). */
  notify: (message: string) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    variant: "success",
    name: "",
    price: 0,
    message: "",
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashToast = useCallback((next: Omit<ToastState, "show">) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ ...next, show: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      next.variant === "error" ? 4200 : 3200,
    );
  }, []);

  const showSuccess = useCallback(
    (name: string, price: number) =>
      flashToast({ variant: "success", name, price, message: "" }),
    [flashToast],
  );

  const showError = useCallback(
    (message: string) =>
      flashToast({ variant: "error", name: "", price: 0, message }),
    [flashToast],
  );

  // Load from localStorage only after mount to avoid SSR mismatch
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore malformed data
    }
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      const currentQty = items.find((i) => i.id === item.id)?.quantity ?? 0;

      if (item.stock <= 0) {
        showError(`${item.name} est actuellement en rupture de stock.`);
        return;
      }

      if (currentQty + quantity > item.stock) {
        const remaining = Math.max(0, item.stock - currentQty);
        showError(
          remaining > 0
            ? `Stock insuffisant pour ${item.name} : il ne reste que ${remaining} unité(s) disponible(s)${
                currentQty > 0 ? ` (vous en avez déjà ${currentQty} dans le panier)` : ""
              }.`
            : `Vous avez déjà le maximum disponible de ${item.name} dans votre panier (${item.stock}).`,
        );
        return;
      }

      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + quantity, stock: item.stock }
              : i,
          );
        }
        return [...prev, { ...item, quantity }];
      });
      showSuccess(item.name, item.price);
    },
    [items, showError, showSuccess],
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, qty: number) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const max = item.stock > 0 ? item.stock : 1;
      if (qty > item.stock) {
        showError(
          `Stock insuffisant pour ${item.name} : maximum ${item.stock} unité(s) disponible(s).`,
        );
      }

      const clamped = Math.max(1, Math.min(max, qty));
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: clamped } : i)),
      );
    },
    [items, showError],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, toast, addToCart, removeItem, updateQuantity, clearCart, notify: showError }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
