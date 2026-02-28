import type { Product } from "@/lib/types";

export type CartItem = {
  id: string;
  title: string;
  modelNumber: number;
  price: number;
  discountPrice?: number;
  hasDiscount?: boolean;
  qty: number;
  imageUrl?: string;
};

const KEY = "joodkids_cart_v1";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter(Boolean);
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cartChanged"));
}

export function cartCount(items: CartItem[]) {
  return items.reduce((a, b) => a + (b.qty || 0), 0);
}

export function addToCart(product: Product, qty: number = 1) {
  const items = readCart();
  const idx = items.findIndex((i) => i.id === product.id);
  const baseItem: CartItem = {
    id: product.id,
    title: product.title,
    modelNumber: product.modelNumber,
    price: product.price,
    discountPrice: product.discountPrice,
    hasDiscount: product.hasDiscount,
    qty: Math.max(1, qty),
    imageUrl: product.images?.[0]?.url,
  };

  if (idx >= 0) {
    items[idx] = { ...items[idx], qty: (items[idx].qty || 1) + Math.max(1, qty) };
  } else {
    items.unshift(baseItem);
  }
  writeCart(items);
}

export function updateQty(id: string, qty: number) {
  const items = readCart();
  const next = items
    .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    .filter((i) => i.qty > 0);
  writeCart(next);
}

export function removeItem(id: string) {
  const items = readCart().filter((i) => i.id !== id);
  writeCart(items);
}

export function clearCart() {
  writeCart([]);
}

export function itemUnitPrice(i: CartItem) {
  const d = !!i.hasDiscount && typeof i.discountPrice === "number" && i.discountPrice > 0 && i.discountPrice < i.price;
  return d ? (i.discountPrice as number) : i.price;
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + itemUnitPrice(i) * (i.qty || 1), 0);
}
