"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { B2BProduct, TagFilterData } from "@/lib/b2b/types";
import { formatCategoryLabel, formatKindLabel } from "@/lib/b2b/labels";
import { ProductCard } from "@/components/b2b/product-card";
import { cn } from "@/lib/utils";

type CatalogView = "all" | "recommended";
type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "producer-asc"
  | "stock-desc"
  | "tag1-asc";

interface CatalogClientProps {
  products: B2BProduct[];
  tags: TagFilterData;
  recommendedCount: number;
}

const SORT_LABELS: Record<SortOption, string> = {
  "name-asc": "Nazwa A–Z",
  "name-desc": "Nazwa Z–A",
  "price-asc": "Cena rosnąco",
  "price-desc": "Cena malejąco",
  "producer-asc": "Producent A–Z",
  "stock-desc": "Stan magazynowy",
  "tag1-asc": "Kategoria A–Z",
};

function sortProducts(products: B2BProduct[], sort: SortOption): B2BProduct[] {
  const sorted = [...products];
  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "pl"));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name, "pl"));
    case "price-asc":
      return sorted.sort((a, b) => a.priceNet - b.priceNet);
    case "price-desc":
      return sorted.sort((a, b) => b.priceNet - a.priceNet);
    case "producer-asc":
      return sorted.sort((a, b) =>
        (a.producer || "zzz").localeCompare(b.producer || "zzz", "pl")
      );
    case "stock-desc":
      return sorted.sort((a, b) => b.stock - a.stock);
    case "tag1-asc":
      return sorted.sort((a, b) => {
        const tagCmp = a.tag1.localeCompare(b.tag1, "pl");
        if (tagCmp !== 0) return tagCmp;
        const tag2Cmp = a.tag2.localeCompare(b.tag2, "pl");
        if (tag2Cmp !== 0) return tag2Cmp;
        return a.name.localeCompare(b.name, "pl");
      });
    default:
      return sorted;
  }
}

export function CatalogClient({
  products,
  tags,
  recommendedCount,
}: CatalogClientProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<CatalogView>("all");

  useEffect(() => {
    if (searchParams.get("widok") === "proponowane") {
      setView("recommended");
    }
  }, [searchParams]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeKind, setActiveKind] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const availableKinds = useMemo(() => {
    if (activeCategory === "all") {
      const all = new Set<string>();
      products.forEach((p) => {
        if (p.tag2) all.add(p.tag2);
      });
      return [...all].sort((a, b) => a.localeCompare(b, "pl"));
    }
    return tags.tag2ByTag1[activeCategory] ?? [];
  }, [activeCategory, products, tags.tag2ByTag1]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesView =
        view === "all" || (view === "recommended" && product.isRecommended);
      const matchesCategory =
        activeCategory === "all" || product.tag1 === activeCategory;
      const matchesKind =
        activeKind === "all" || product.tag2 === activeKind;
      const matchesStock = !inStockOnly || product.stock > 0;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.symbol.toLowerCase().includes(query) ||
        product.producer.toLowerCase().includes(query) ||
        formatCategoryLabel(product.tag1).toLowerCase().includes(query) ||
        formatKindLabel(product.tag2).toLowerCase().includes(query);

      return (
        matchesView &&
        matchesCategory &&
        matchesKind &&
        matchesStock &&
        matchesSearch
      );
    });

    return sortProducts(filtered, sort);
  }, [
    products,
    search,
    view,
    activeCategory,
    activeKind,
    inStockOnly,
    sort,
  ]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      if (p.tag1) counts[p.tag1] = (counts[p.tag1] || 0) + 1;
    });
    return counts;
  }, [products]);

  const kindCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    const pool =
      activeCategory === "all"
        ? products
        : products.filter((p) => p.tag1 === activeCategory);
    counts.all = pool.length;
    pool.forEach((p) => {
      if (p.tag2) counts[p.tag2] = (counts[p.tag2] || 0) + 1;
    });
    return counts;
  }, [products, activeCategory]);

  function handleCategoryChange(category: string) {
    setActiveCategory(category);
    setActiveKind("all");
  }

  function clearFilters() {
    setActiveCategory("all");
    setActiveKind("all");
    setInStockOnly(false);
    setSearch("");
    setView("all");
  }

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeKind !== "all" ||
    inStockOnly ||
    search.trim() !== "" ||
    view !== "all";

  const filterPanel = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <SlidersHorizontal className="size-4 text-turquoise-600" />
        Filtruj produkty
      </div>

      <div>
        <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Kategoria
        </p>
        <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
          <FilterButton
            label="Wszystkie kategorie"
            count={categoryCounts.all}
            active={activeCategory === "all"}
            onClick={() => handleCategoryChange("all")}
          />
          {tags.tag1List.map((category) => (
            <FilterButton
              key={category}
              label={formatCategoryLabel(category)}
              count={categoryCounts[category] ?? 0}
              active={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
            />
          ))}
        </div>
      </div>

      {availableKinds.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Rodzaj
            {activeCategory !== "all" && (
              <span className="ml-1.5 font-normal normal-case text-turquoise-600">
                · {formatCategoryLabel(activeCategory)}
              </span>
            )}
          </p>
          <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
            <FilterButton
              label="Wszystkie rodzaje"
              count={kindCounts.all}
              active={activeKind === "all"}
              onClick={() => setActiveKind("all")}
            />
            {availableKinds.map((kind) => (
              <FilterButton
                key={kind}
                label={formatKindLabel(kind)}
                count={kindCounts[kind] ?? 0}
                active={activeKind === kind}
                onClick={() => setActiveKind(kind)}
              />
            ))}
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2 border-t border-border pt-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="size-4 rounded border-border accent-turquoise-500"
        />
        Tylko dostępne na magazynie
      </label>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-md border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Wyczyść filtry
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="hidden w-full shrink-0 lg:block lg:w-60">
        <div className="sticky top-4 rounded-xl border border-border bg-card p-4">
          {filterPanel}
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Szukaj po nazwie, symbolu, producencie lub kategorii..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-card py-2.5 pr-4 pl-10 text-sm outline-none transition-colors focus:border-turquoise-500 focus:ring-2 focus:ring-turquoise-500/20"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm lg:hidden"
            >
              <SlidersHorizontal className="size-4 text-turquoise-600" />
              Filtry
            </button>

            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none rounded-lg border border-border bg-card py-2.5 pr-8 pl-10 text-sm outline-none transition-colors focus:border-turquoise-500 focus:ring-2 focus:ring-turquoise-500/20"
                aria-label="Sortowanie produktów"
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <option key={key} value={key}>
                    {SORT_LABELS[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {mobileFiltersOpen && (
          <div className="rounded-xl border border-border bg-card p-4 lg:hidden">
            {filterPanel}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <ViewTab
            active={view === "all"}
            onClick={() => setView("all")}
            label="Wszystkie"
            count={products.length}
          />
          <ViewTab
            active={view === "recommended"}
            onClick={() => setView("recommended")}
            label="Polecane"
            count={recommendedCount}
            icon={<Sparkles className="size-3.5" />}
          />
        </div>

        {view === "recommended" && (
          <p className="rounded-lg border border-turquoise-500/20 bg-turquoise-500/5 px-4 py-3 text-sm text-muted-foreground">
            <Sparkles className="mr-1.5 inline size-4 text-turquoise-600" />
            Nasze rekomendacje dla Twojego asortymentu — produkty
            wybrane przez zespół Akwen.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Wyświetlono{" "}
          <span className="font-medium text-foreground">
            {filteredProducts.length}
          </span>{" "}
          z {products.length} produktów
          {activeCategory !== "all" && (
            <>
              {" "}
              · kategoria:{" "}
              <span className="font-medium text-foreground">
                {formatCategoryLabel(activeCategory)}
              </span>
            </>
          )}
          {activeKind !== "all" && (
            <>
              {" "}
              · rodzaj:{" "}
              <span className="font-medium text-foreground">
                {formatKindLabel(activeKind)}
              </span>
            </>
          )}
        </p>

        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
            <p className="font-medium text-foreground">Brak wyników</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Zmień filtry lub wpisz inną frazę wyszukiwania.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-turquoise-600 hover:underline"
              >
                Wyczyść wszystkie filtry
              </button>
            )}
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

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors",
        active
          ? "bg-turquoise-500/15 font-medium text-turquoise-700 dark:text-turquoise-300"
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      <span className="line-clamp-1">{label}</span>
      <span className="ml-2 shrink-0 text-xs">{count}</span>
    </button>
  );
}

function ViewTab({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-navy-900 text-white dark:bg-turquoise-600"
          : "border border-border bg-card text-muted-foreground hover:bg-muted"
      )}
    >
      {icon}
      {label}
      <span
        className={cn(
          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
          active ? "bg-white/20" : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}