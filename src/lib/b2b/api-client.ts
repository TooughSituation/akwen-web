/**
 * Klient HTTP do mock API B2B.
 *
 * Analogia do VBA: zamiast bezpośredniego Workbooks.Open / Range.Value
 * wołamy „serwis” (Route Handler). localStorage zostaje warstwą trwałego
 * zapisu po stronie klienta — API waliduje i buduje rekordy.
 */

import type {
  B2BOrder,
  B2BProduct,
  B2BProfile,
  CreateOrderInput,
} from "./types";
import type { ProductSearchHit } from "./search";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Błąd API (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export interface ProductsApiResponse {
  products: B2BProduct[] | ProductSearchHit[];
  total: number;
  returned: number;
  query: {
    q: string;
    tag1: string;
    tag2: string;
    recommended: boolean;
    limit: number | null;
  };
  meta: {
    catalogTotal: number;
    recommendedCount: number;
    lastUpdated: string;
    source: string;
  };
}

export async function apiSearchProducts(options: {
  q?: string;
  limit?: number;
  compact?: boolean;
  tag1?: string;
  tag2?: string;
  recommended?: boolean;
}): Promise<ProductsApiResponse> {
  const params = new URLSearchParams();
  if (options.q) params.set("q", options.q);
  if (options.limit) params.set("limit", String(options.limit));
  if (options.compact) params.set("compact", "1");
  if (options.tag1) params.set("tag1", options.tag1);
  if (options.tag2) params.set("tag2", options.tag2);
  if (options.recommended) params.set("recommended", "1");

  const res = await fetch(`/api/products?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return parseJson<ProductsApiResponse>(res);
}

export async function apiCreateOrder(
  input: CreateOrderInput
): Promise<B2BOrder> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const data = await parseJson<{ order: B2BOrder }>(res);
  return data.order;
}

export async function apiGetDefaultProfile(): Promise<B2BProfile> {
  const res = await fetch("/api/profile", {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const data = await parseJson<{ profile: B2BProfile }>(res);
  return data.profile;
}

export async function apiValidateProfile(
  profile: B2BProfile
): Promise<B2BProfile> {
  const res = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
  });
  const data = await parseJson<{ profile: B2BProfile }>(res);
  return data.profile;
}
