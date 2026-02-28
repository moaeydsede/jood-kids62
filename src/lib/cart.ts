const KEY = "joodkids_cart";

export type CartItem = {
  productId: string;
  title: string;
  modelNumber: number;
  price: number;
  qty: number;
  image?: string;
};

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}
