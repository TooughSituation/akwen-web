import { Suspense } from "react";
import { B2BHeader } from "@/components/b2b/b2b-header";
import { CatalogClient } from "@/components/b2b/catalog-client";
import { getProductCatalog } from "@/lib/b2b/products";

export default function B2BCatalogPage() {
  const catalog = getProductCatalog();

  return (
    <>
      <B2BHeader
        title="Katalog produktów"
        description={`${catalog.totalCount} pozycji · ceny hurtowe netto · dane z magazynu`}
      />

      <div className="p-5 sm:p-8 lg:p-10">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-12 animate-pulse rounded-xl bg-muted/50" />
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-2xl bg-muted/40"
                  />
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Ładowanie katalogu…
              </p>
            </div>
          }
        >
          <CatalogClient
            products={catalog.products}
            tags={catalog.tags}
            recommendedCount={catalog.recommendedCount}
          />
        </Suspense>
      </div>
    </>
  );
}