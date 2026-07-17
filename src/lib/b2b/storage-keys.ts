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
  /** Arkusz „Punkty” per firma. */
  loyalty: "akwen-b2b-loyalty",
  /** Arkusz „Ulubione” — lista ID produktów per firma. */
  favorites: "akwen-b2b-favorites",
  /** Historia czatu z handlowcem per firma. */
  chat: "akwen-b2b-chat",
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

export function loyaltyStorageKey(userId: string | null | undefined): string {
  return userScopedKey(STORAGE_BASE.loyalty, userId);
}

export function favoritesStorageKey(userId: string | null | undefined): string {
  return userScopedKey(STORAGE_BASE.favorites, userId);
}

export function chatStorageKey(userId: string | null | undefined): string {
  return userScopedKey(STORAGE_BASE.chat, userId);
}
