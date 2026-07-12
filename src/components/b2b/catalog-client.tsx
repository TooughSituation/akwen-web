"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { B2BProduct, ProductCategory } from "@/lib/b2b/types";
import { ProductCard } from "@/components/b2b/product-card";
import { cn } from "@/lib/utils";

interface CatalogClientProps {
  products: B2BProduct[];
  categories: ProductCategory[];
}

export function CatalogClient({ products, categories }: CatalogClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category.id === activeCategory;
      const matchesStock = !inStockOnly || product.stock > 0;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.symbol.toLowerCase().includes(query) ||
        product.producer.toLowerCase().includes(query);

      return matchesCategory && matchesStock && matchesSearch;
    });
  }, [products, search, activeCategory, inStockOnly]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      counts[p.category.id] = (counts[p.category.id] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <div className="sticky top-4 space-y-4 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <SlidersHorizontal className="size-4 text-turquoise-600" />
            Filtry
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                activeCategory === "all"
                  ? "bg-turquoise-500/15 font-medium text-turquoise-700 dark:text-turquoise-300"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              Wszystkie
              <span className="text-xs">{categoryCounts.all}</span>
            </button>
            {categories
              .filter((c) => c.id !== "inne" || (categoryCounts[c.id] ?? 0) > 0)
              .map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
                    activeCategory === category.id
                      ? "bg-turquoise-500/15 font-medium text-turquoise-700 dark:text-turquoise-300"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <span className="line-clamp-1">{category.label}</span>
                  <span className="ml-2 shrink-0 text-xs">
                    {categoryCounts[category.id] ?? 0}
                  </span>
                </button>
              ))}
          </div>

          <label className="flex cursor-pointer items-center gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="size-4 rounded border-border accent-turquoise-500"
            />
            Tylko dostępne
          </label>
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Szukaj po nazwie, symbolu lub producencie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2.5 pr-4 pl-10 text-sm outline-none transition-colors focus:border-turquoise-500 focus:ring-2 focus:ring-turquoise-500/20"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Wyświetlono{" "}
          <span className="font-medium text-foreground">
            {filteredProducts.length}
          </span>{" "}
          z {products.length} produktów
        </p>

        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
            <p className="font-medium text-foreground">Brak wyników</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Zmień filtry lub wpisz inną frazę wyszukiwania.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}