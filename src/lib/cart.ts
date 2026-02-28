// src/lib/cart.ts

import type { CartItem } from "@/lib/types";

const CART_KEY = "joodkids_cart";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(CART_KEY);
}

export function addToCart(item: CartItem) {
  const cart = loadCart();

  const existing = cart.find(
    (i) => i.id === item.id && i.size === item.size
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}

export function removeFromCart(id: string, size: string) {
  const cart = loadCart().filter(
    (item) => !(item.id === id && item.size === size)
  );

  saveCart(cart);
}

export function updateQuantity(id: string, size: string, quantity: number) {
  const cart = loadCart();

  const item = cart.find(
    (i) => i.id === id && i.size === size
  );

  if (item) {
    item.quantity = quantity;
  }

  saveCart(cart);
}
