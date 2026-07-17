import { B2BHeader } from "@/components/b2b/b2b-header";
import { OrdersList } from "@/components/b2b/orders-list";
export default function B2BOrdersPage() {
  return (
    <>
      <B2BHeader
        title="Moje zamówienia"
        description="Historia zamówień hurtowych i śledzenie dostaw"
      />
      <div className="p-6">
        <OrdersList />
      </div>
    </>
  );
}