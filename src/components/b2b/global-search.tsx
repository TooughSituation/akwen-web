"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package, Search, X } from "lucide-react";
import { apiSearchProducts } from "@/lib/b2b/api-client";
import { formatPrice } from "@/lib/b2b/format";
import { formatCategoryLabel, formatKindLabel } from "@/lib/b2b/labels";
import type { ProductSearchHit } from "@/lib/b2b/search";
import { cn } from "@/lib/utils";

interface GlobalSearchProps {
  className?: string;
  /** Pełna szerokość w mobile header */
  fullWidth?: boolean;
}

/**
 * Globalne wyszukiwanie B2B (header).
 *
 * Analogia Excel: pole „Znajdź” nad arkuszem — szuka w wielu kolumnach,
 * Enter otwiera przefiltrowany widok (katalog ?q=), a lista pod spodem
 * to podgląd jak panel wyników AutoFilter.
 */
export function GlobalSearch({ className, fullWidth }: GlobalSearchProps) {
  const router = useRouter();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ProductSearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const goToCatalog = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      const href = trimmed
        ? `/b2b/katalog?q=${encodeURIComponent(trimmed)}`
        : "/b2b/katalog";
      setOpen(false);
      setActiveIndex(-1);
      router.push(href);
    },
    [router]
  );

  // Debounce podpowiedzi z /api/products (jak odświeżanie filtrów po wpisaniu)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const res = await apiSearchProducts({
          q,
          limit: 8,
          compact: true,
        });
        if (cancelled) return;
        setHits(res.products as ProductSearchHit[]);
        setTotal(res.total);
        setOpen(true);
        setActiveIndex(-1);
      } catch {
        if (!cancelled) {
          setHits([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    goToCatalog(query);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || hits.length === 0) {
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i <= 0 ? hits.length - 1 : i - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const hit = hits[activeIndex];
      if (hit) goToCatalog(hit.name);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        fullWidth ? "w-full" : "hidden w-full max-w-md md:block",
        className
      )}
    >
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor={`${listId}-input`} className="sr-only">
          Szukaj w katalogu
        </label>
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Szukaj: nazwa, symbol, producent, kategoria…"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={showDropdown ? listId : undefined}
            aria-expanded={showDropdown}
            aria-activedescendant={
              activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
            }
            className={cn(
              "w-full rounded-lg border border-border bg-background py-2 pr-9 pl-9 text-sm",
              "outline-none transition-colors",
              "placeholder:text-muted-foreground",
              "focus:border-turquoise-500 focus:ring-2 focus:ring-turquoise-500/20"
            )}
          />
          {loading ? (
            <Loader2 className="absolute right-3 size-4 animate-spin text-muted-foreground" />
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setHits([]);
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Wyczyść wyszukiwanie"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </form>

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-auto rounded-lg border border-border bg-card shadow-lg"
        >
          {hits.length === 0 && !loading ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              Brak produktów dla „{query.trim()}”
            </p>
          ) : (
            <ul className="py-1">
              {hits.map((hit, index) => {
                const active = index === activeIndex;
                return (
                  <li key={hit.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      id={`${listId}-opt-${index}`}
                      className={cn(
                        "flex w-full items-start gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                        active ? "bg-turquoise-500/10" : "hover:bg-muted/80"
                      )}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goToCatalog(hit.name)}
                    >
                      <Package className="mt-0.5 size-4 shrink-0 text-turquoise-600" />
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 font-medium text-foreground">
                          {hit.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {hit.symbol}
                          {hit.producer ? ` · ${hit.producer}` : ""}
                          {" · "}
                          {formatCategoryLabel(hit.tag1) || hit.tag1}
                          {hit.tag2
                            ? ` / ${formatKindLabel(hit.tag2) || hit.tag2}`
                            : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-medium text-navy-900 dark:text-white">
                        {formatPrice(hit.priceNet)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {total > 0 && (
            <button
              type="button"
              onClick={() => goToCatalog(query)}
              className="w-full border-t border-border px-3 py-2.5 text-left text-xs font-medium text-turquoise-700 hover:bg-muted dark:text-turquoise-400"
            >
              Pokaż wszystkie wyniki w katalogu
              {total > hits.length ? ` (${total})` : ""}
              {" →"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
