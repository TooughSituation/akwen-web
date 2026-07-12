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

      <div className="p-6">
        <Suspense
          fallback={
            <p className="text-sm text-muted-foreground">Ładowanie katalogu…</p>
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