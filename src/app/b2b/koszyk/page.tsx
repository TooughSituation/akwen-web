import { B2BHeader } from "@/components/b2b/b2b-header";
import { CartCheckout } from "@/components/b2b/cart-checkout";
export default function B2BCartPage() {
  return (
    <>
      <B2BHeader
        title="Koszyk"
        description="Zarządzaj pozycjami przed złożeniem zamówienia hurtowego"
      />
      <div className="p-6">
        <CartCheckout />
      </div>
    </>
  );
}