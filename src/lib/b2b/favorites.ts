/**
 * Ulubione produkty B2B.
 *
 * Analogia Excel: arkusz „Ulubione” z jedną kolumną ProductId
 * (jak lista zaznaczonych wierszy w magazynie). Każda firma ma swój arkusz.
 */

import { favoritesStorageKey, STORAGE_BASE } from "./storage-keys";

export const FAVORITES_STORAGE_KEY = STORAGE_BASE.favorites;
export const FAVORITES_UPDATED_EVENT = "akwen-favorites-updated";

export function getFavoriteIds(userId?: string | null): string[] {
  if (typeof window === "undefined" || !userId) return [];

  const key = favoritesStorageKey(userId);
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0);
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

export function saveFavoriteIds(
  ids: string[],
  userId?: string | null
): void {
  if (typeof window === "undefined" || !userId) return;
  const unique = [...new Set(ids)];
  localStorage.setItem(favoritesStorageKey(userId), JSON.stringify(unique));
  window.dispatchEvent(new Event(FAVORITES_UPDATED_EVENT));
}

export function isFavorite(
  productId: string,
  userId?: string | null
): boolean {
  return getFavoriteIds(userId).includes(productId);
}

/** Dodaje ID (bez duplikatów). Zwraca nową listę. */
export function addFavorite(
  productId: string,
  userId?: string | null
): string[] {
  const current = getFavoriteIds(userId);
  if (current.includes(productId)) return current;
  const next = [productId, ...current];
  saveFavoriteIds(next, userId);
  return next;
}

/** Usuwa ID. Zwraca nową listę. */
export function removeFavorite(
  productId: string,
  userId?: string | null
): string[] {
  const next = getFavoriteIds(userId).filter((id) => id !== productId);
  saveFavoriteIds(next, userId);
  return next;
}

/** Przełącza ulubione (jak checkbox w Access). */
export function toggleFavorite(
  productId: string,
  userId?: string | null
): { ids: string[]; isFavorite: boolean } {
  const current = getFavoriteIds(userId);
  if (current.includes(productId)) {
    const ids = removeFavorite(productId, userId);
    return { ids, isFavorite: false };
  }
  const ids = addFavorite(productId, userId);
  return { ids, isFavorite: true };
}
