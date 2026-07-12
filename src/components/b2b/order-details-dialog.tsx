"use client";

import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { formatPrice } from "@/lib/b2b/format";
import type { B2BOrder } from "@/lib/b2b/types";
import { OrderStatusBadge } from "@/components/b2b/order-status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderDetailsDialogProps {
  order: B2BOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReorder: (order: B2BOrder) => void;
  isReordering?: boolean;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onReorder,
  isReordering = false,
}: OrderDetailsDialogProps) {
  if (!order) return null;

  const deliveryDate = new Date(`${order.deliveryDate}T12:00:00`);
  const createdAt = new Date(order.createdAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>{order.orderNumber}</DialogTitle>
            <OrderStatusBadge status={order.status} />
          </div>
          <DialogDescription>
            Złożono{" "}
            {format(createdAt, "d MMMM yyyy, HH:mm", { locale: pl })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Data dostawy
              </p>
              <p className="mt-1 text-sm">
                {format(deliveryDate, "d MMMM yyyy", { locale: pl })}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Wartość netto
              </p>
              <p className="mt-1 text-sm font-semibold">
                {formatPrice(order.totalNet)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Adres dostawy
            </p>
            <p className="mt-1 text-sm">{order.deliveryAddress}</p>
          </div>

          {order.notes && (
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Uwagi
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="mb-2 text-sm font-medium">Pozycje zamówienia</p>
            <ul className="space-y-2 text-sm">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between gap-3 border-b border-border/50 pb-2 last:border-0"
                >
                  <span className="text-muted-foreground">
                    {item.name} × {item.quantity} {item.unit}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatPrice(item.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zamknij
          </Button>
          <Button
            className="bg-turquoise-500 hover:bg-turquoise-600"
            onClick={() => onReorder(order)}
            disabled={isReordering}
          >
            {isReordering ? "Dodawanie…" : "Zamów ponownie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}