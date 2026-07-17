import { NextRequest, NextResponse } from "next/server";
import { getProductCatalog } from "@/lib/b2b/products";
import { searchProducts, toSearchHit } from "@/lib/b2b/search";

/**
 * GET /api/products
 *
 * Analogia do Excela: odczyt arkusza „Magazyn” z opcjonalnym filtrem
 * (jak AutoFilter na kolumnach Nazwa/Symbol/Producent/Tag1/Tag2).
 *
 * Query:
 *  - q        — fraza wyszukiwania
 *  - limit    — max wyników (domyślnie wszystkie / 20 przy samym q)
 *  - recommended=1 — tylko proponowane
 *  - tag1, tag2 — filtry kategorii
 *  - compact=1 — lekkie rekordy pod autocomplete
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const tag1 = searchParams.get("tag1")?.trim() ?? "";
  const tag2 = searchParams.get("tag2")?.trim() ?? "";
  const recommendedOnly =
    searchParams.get("recommended") === "1" ||
    searchParams.get("recommended") === "true";
  const compact =
    searchParams.get("compact") === "1" ||
    searchParams.get("compact") === "true";

  const limitRaw = searchParams.get("limit");
  const parsedLimit = limitRaw ? Number(limitRaw) : NaN;
  const defaultLimit = q ? 20 : undefined;
  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, 500)
      : defaultLimit;

  const catalog = getProductCatalog();
  let products = catalog.products;

  if (recommendedOnly) {
    products = products.filter((p) => p.isRecommended);
  }
  if (tag1 && tag1 !== "all") {
    products = products.filter((p) => p.tag1 === tag1);
  }
  if (tag2 && tag2 !== "all") {
    products = products.filter((p) => p.tag2 === tag2);
  }
  if (q) {
    products = searchProducts(products, q);
  }

  const total = products.length;
  const sliced = limit ? products.slice(0, limit) : products;
  const data = compact ? sliced.map(toSearchHit) : sliced;

  return NextResponse.json({
    products: data,
    total,
    returned: data.length,
    query: { q, tag1, tag2, recommended: recommendedOnly, limit: limit ?? null },
    meta: {
      catalogTotal: catalog.totalCount,
      recommendedCount: catalog.recommendedCount,
      lastUpdated: catalog.lastUpdated,
      source: "excel",
    },
  });
}
