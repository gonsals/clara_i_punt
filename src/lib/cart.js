import { useSyncExternalStore } from 'react';

const KEY = 'clara-cart-v1';
const EMPTY = [];
let lines = EMPTY;
let initialized = false;
const listeners = new Set();

export function sanitizeLines(value) {
  if (!Array.isArray(value)) return [];
  const result = [];
  for (const line of value.slice(0, 30)) {
    if (
      !line ||
      typeof line.id !== 'string' ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      result.some((item) => item.id === line.id)
    )
      continue;
    result.push({ id: line.id, quantity: Math.min(line.quantity, 20) });
  }
  return result;
}
function publish(next, persist = true) {
  lines = next;
  if (persist) {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* A blocked storage still allows a session cart. */
    }
  }
  listeners.forEach((fn) => fn());
}
export function initializeCart() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;
  try {
    publish(sanitizeLines(JSON.parse(localStorage.getItem(KEY) || '[]')), false);
  } catch {
    publish([], false);
  }
  window.addEventListener('storage', (event) => {
    if (event.key !== KEY && event.key !== null) return;
    try {
      publish(sanitizeLines(JSON.parse(event.newValue || '[]')), false);
    } catch {
      publish([], false);
    }
  });
}
export function addToCart(product, quantity = 1) {
  initializeCart();
  if (!product.canAdd || product.preview) return false;
  const current = lines.find((line) => line.id === product.id);
  const amount = Math.min((current?.quantity || 0) + quantity, product.stock ?? 1, 20);
  publish(
    current
      ? lines.map((line) => (line.id === product.id ? { ...line, quantity: amount } : line))
      : [...lines, { id: product.id, quantity: amount }],
  );
  window.dispatchEvent(new Event('clara:open-cart'));
  return true;
}
export function setQuantity(id, quantity, stock) {
  const amount = Math.max(0, Math.min(quantity, stock, 20));
  publish(
    amount === 0
      ? lines.filter((line) => line.id !== id)
      : lines.map((line) => (line.id === id ? { ...line, quantity: amount } : line)),
  );
}
export function removeFromCart(id) {
  publish(lines.filter((line) => line.id !== id));
}
export function clearCart() {
  publish([]);
}
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const useCart = () =>
  useSyncExternalStore(
    subscribe,
    () => lines,
    () => EMPTY,
  );
