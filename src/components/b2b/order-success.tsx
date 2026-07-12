"use client";

import Link from "next/link";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CheckCircle2, Package } from "lucide-react";
import { getOrderStatusLabel } from "@/lib/b2b/orders";
import { formatPrice } from "@/lib/b2b/format";
import type { B2BOrder } from "@/lib/b2b/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrderSuccessProps {
  order: B2BOrder;
  onNewOrder: () => void;
}

export function OrderSuccess({ order, onNewOrder }: OrderSuccessProps) {
  const deliveryDate = new Date(`${order.deliveryDate}T12:00:00`);

  return (
    <div className="space-y-6">
      <Alert className="border-turquoise-500/30 bg-turquoise-500/10">
        <CheckCircle2 className="text-turquoise-600" />
        <AlertTitle className="text-navy-900 dark:text-white">
          Zamówienie zostało złożone!
        </AlertTitle>
        <AlertDescription>
          Twoje zamówienie trafiło do działu handlowego Akwen. Numer zamówienia:{" "}
          <span className="font-semibold text-foreground">
            {order.orderNumber}
          </span>
        </AlertDescription>
      </Alert>

      <Card className="border-border/60">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>{order.orderNumber}</CardTitle>
              <CardDescription className="mt-1">
                Złożono{" "}
                {format(new Date(order.createdAt), "d MMMM yyyy, HH:mm", {
                  locale: pl,
                })}
              </CardDescription>
            </div>
            <Badge className="bg-turquoise-500/15 text-turquoise-700">
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
                Adres dostawy
              </p>
              <p className="mt-1 text-sm">{order.deliveryAddress}</p>
            </div>
          </div>

          {order.notes && (
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Uwagi
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-3 text-sm font-medium">Pozycje zamówienia</p>
            <ul className="space-y-2 text-sm">
              {order.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex justify-between gap-4"
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
            <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
              <span>Razem netto</span>
              <span>{formatPrice(order.totalNet)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="bg-turquoise-500 hover:bg-turquoise-600"
              render={<Link href="/b2b/zamowienia" />}
            >
              <Package className="size-4" />
              Moje zamówienia
            </Button>
            <Button variant="outline" render={<Link href="/b2b/katalog" />}>
              Kontynuuj zakupy
            </Button>
            <Button variant="ghost" onClick={onNewOrder}>
              Nowe zamówienie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}