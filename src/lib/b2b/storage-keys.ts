/**
 * Klucze localStorage per użytkownik.
 *
 * Analogia Excel: każdy partner ma swój plik / arkusz
 * (koszyk_firmaA, zamowienia_firmaA) — nie mieszamy danych między firmami.
 */

export const STORAGE_BASE = {
  cart: "akwen-b2b-cart",
  profile: "akwen-b2b-profile",
  orders: "akwen-b2b-orders",
  priceMode: "akwen-b2b-price-mode",
} as const;

export function userScopedKey(base: string, userId: string | null | undefined): string {
  if (!userId) return base;
  return `${base}:${userId}`;
}

export function cartStorageKey(userId: string | null | undefined): string {
  return userScopedKey(STORAGE_BASE.cart, userId);
}

export function profileStorageKey(userId: string | null | undefined): string {
  return userScopedKey(STORAGE_BASE.profile, userId);
}

export function ordersStorageKey(userId: string | null | undefined): string {
  return userScopedKey(STORAGE_BASE.orders, userId);
}

export function priceModeStorageKey(userId: string | null | undefined): string {
  return userScopedKey(STORAGE_BASE.priceMode, userId);
}
