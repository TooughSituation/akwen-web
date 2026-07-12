import { B2BHeader } from "@/components/b2b/b2b-header";
import { CartView } from "@/components/b2b/cart-view";
import { getMockCustomer } from "@/lib/b2b/auth";

export default function B2BCartPage() {
  const customer = getMockCustomer();

  return (
    <>
      <B2BHeader
        customer={customer}
        title="Koszyk"
        description="Zarządzaj pozycjami przed złożeniem zamówienia hurtowego"
      />
      <div className="p-6">
        <CartView />
      </div>
    </>
  );
}