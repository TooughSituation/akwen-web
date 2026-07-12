"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { ClipboardList, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useOrders } from "@/hooks/use-orders";
import { countOrderItems } from "@/lib/b2b/orders";
import { formatPrice } from "@/lib/b2b/format";
import type { B2BOrder } from "@/lib/b2b/types";
import { OrderDetailsDialog } from "@/components/b2b/order-details-dialog";
import { OrderStatusBadge } from "@/components/b2b/order-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OrdersList() {
  const router = useRouter();
  const { orders, isHydrated } = useOrders();
  const { reorderFromOrder } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  function openDetails(order: B2BOrder) {
    setSelectedOrder(order);
    setDialogOpen(true);
  }

  function handleReorder(order: B2BOrder, goToCart = false) {
    setReorderingId(order.id);
    reorderFromOrder(order);
    setReorderingId(null);

    if (goToCart) {
      router.push("/b2b/koszyk");
      return;
    }

    setDialogOpen(false);
    router.push("/b2b/koszyk");
  }

  if (!isHydrated) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Ładowanie historii zamówień…
        </CardContent>
      </Card>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="border-dashed border-border/60">
        <CardHeader className="items-center text-center">
          <ClipboardList className="size-12 text-muted-foreground/50" />
          <CardTitle className="mt-2">Brak zamówień</CardTitle>
          <CardDescription>
            Złóż pierwsze zamówienie hurtowe z katalogu produktów.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button
            className="bg-turquoise-500 hover:bg-turquoise-600"
            render={<Link href="/b2b/katalog" />}
          >
            Przejdź do katalogu
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Historia zamówień</CardTitle>
          <CardDescription>
            {orders.length}{" "}
            {orders.length === 1 ? "zamówienie" : "zamówień"} w Twoim koncie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numer</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Wartość</TableHead>
                <TableHead className="text-center">Pozycje</TableHead>
                <TableHead className="text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const itemCount = countOrderItems(order);
                const createdAt = new Date(order.createdAt);

                return (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => openDetails(order)}
                  >
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(createdAt, "d MMM yyyy", { locale: pl })}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(order.totalNet)}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {itemCount} szt.
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className="flex justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetails(order)}
                        >
                          Szczegóły
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReorder(order, true)}
                          disabled={reorderingId === order.id}
                          title="Zamów ponownie"
                        >
                          <RotateCcw className="size-4" />
                          <span className="sr-only">Zamów ponownie</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onReorder={(order) => handleReorder(order, true)}
        isReordering={reorderingId === selectedOrder?.id}
      />
    </>
  );
}