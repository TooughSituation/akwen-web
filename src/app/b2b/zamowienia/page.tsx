import { B2BHeader } from "@/components/b2b/b2b-header";
import { OrdersList } from "@/components/b2b/orders-list";
import { getMockCustomer } from "@/lib/b2b/auth";

export default function B2BOrdersPage() {
  const customer = getMockCustomer();

  return (
    <>
      <B2BHeader
        customer={customer}
        title="Moje zamówienia"
        description="Historia zamówień hurtowych i śledzenie dostaw"
      />
      <div className="p-6">
        <OrdersList />
      </div>
    </>
  );
}