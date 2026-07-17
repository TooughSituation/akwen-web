import { formatCategoryLabel, formatKindLabel } from "./labels";
import type { B2BProduct } from "./types";

/**
 * Globalne wyszukiwanie produktów.
 *
 * Analogia do Excela: filtr automatyczny na wielu kolumnach naraz
 * (Nazwa, Symbol, Producent, Tag1, Tag2) — jak Ctrl+Shift+L z wieloma kryteriami OR.
 */
export function matchesProductQuery(
  product: B2BProduct,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    product.name,
    product.symbol,
    product.producer,
    product.tag1,
    product.tag2,
    formatCategoryLabel(product.tag1),
    formatKindLabel(product.tag2),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Wszystkie tokeny muszą pasować (jak AND w filtrze Excel)
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

export function searchProducts(
  products: B2BProduct[],
  query: string,
  limit?: number
): B2BProduct[] {
  const filtered = products.filter((p) => matchesProductQuery(p, query));
  if (limit && limit > 0) return filtered.slice(0, limit);
  return filtered;
}

/** Lekki rekord pod podpowiedzi w headerze (mniej danych niż pełna karta). */
export interface ProductSearchHit {
  id: string;
  symbol: string;
  name: string;
  producer: string;
  tag1: string;
  tag2: string;
  priceNet: number;
  stock: number;
  isRecommended: boolean;
  imageUrl: string;
}

export function toSearchHit(product: B2BProduct): ProductSearchHit {
  return {
    id: product.id,
    symbol: product.symbol,
    name: product.name,
    producer: product.producer,
    tag1: product.tag1,
    tag2: product.tag2,
    priceNet: product.priceNet,
    stock: product.stock,
    isRecommended: product.isRecommended,
    imageUrl: product.imageUrl,
  };
}
