import { B2BHeader } from "@/components/b2b/b2b-header";
import { CatalogClient } from "@/components/b2b/catalog-client";
import { getMockCustomer } from "@/lib/b2b/auth";
import { getProductCatalog } from "@/lib/b2b/products";

export default function B2BCatalogPage() {
  const customer = getMockCustomer();
  const catalog = getProductCatalog();

  return (
    <>
      <B2BHeader
        customer={customer}
        title="Katalog produktów"
        description={`${catalog.totalCount} pozycji · ceny hurtowe netto · dane z magazynu`}
      />

      <div className="p-6">
        <CatalogClient
          products={catalog.products}
          categories={catalog.categories}
        />
      </div>
    </>
  );
}