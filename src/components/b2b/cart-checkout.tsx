"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useProfile } from "@/contexts/profile-context";
import { CartPromotionsBanner } from "@/components/b2b/cart-promotions-banner";
import { OrderForm } from "@/components/b2b/order-form";
import { OrderSuccess } from "@/components/b2b/order-success";
import {
  applyDiscount,
  formatPrice,
  sumCartNet,
  sumDiscountSavings,
} from "@/lib/b2b/format";
import {
  getPaymentArrearsMessage,
  hasPaymentArrears,
} from "@/lib/b2b/profile";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CheckoutStep = "cart" | "form" | "success";

export function CartCheckout() {
  const { items, isHydrated, totalItems, updateQuantity, removeItem, clearCart } =
    useCart();
  const { profile } = useProfile();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [completedOrder, setCompletedOrder] = useState<B2BOrder | null>(null);

  const discountPercent = profile.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;
  const totalListNet = sumCartNet(items, 0);
  const totalNet = sumCartNet(items, discountPercent);
  const savings = sumDiscountSavings(items, discountPercent);
  // Blokada jak w VBA: If Zaleglosci Then Exit Sub
  const orderBlocked = hasPaymentArrears(profile);
  const arrearsMessage = getPaymentArrearsMessage(profile);

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="h-48 animate-pulse rounded-2xl bg-muted/50" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted/40" />
        <p className="text-center text-sm text-muted-foreground">
          Ładowanie koszyka…
        </p>
      </div>
    );
  }

  if (step === "success" && completedOrder) {
    return (
      <OrderSuccess
        order={completedOrder}
        onNewOrder={() => {
          setCompletedOrder(null);
          setStep("cart");
        }}
      />
    );
  }

  if (step === "form") {
    return (
      <OrderForm
        onSuccess={(order) => {
          setCompletedOrder(order);
          setStep("success");
        }}
        onCancel={() => setStep("cart")}
      />
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed border-border/60">
        <CardHeader className="items-center text-center">
          <ShoppingCart className="size-12 text-muted-foreground/50" />
          <CardTitle className="mt-2">Koszyk jest pusty</CardTitle>
          <CardDescription>
            Dodaj produkty z katalogu, aby złożyć zamówienie hurtowe.
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
    <div className="space-y-6">
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Pozycje w koszyku</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? "produkt" : "produkty"} ·{" "}
              {totalItems} {totalItems === 1 ? "sztuka" : "sztuk"} łącznie
              {hasDiscount && (
                <>
                  {" "}
                  · rabat klienta{" "}
                  <span className="font-medium text-turquoise-700 dark:text-turquoise-400">
                    −{discountPercent}%
                  </span>
                </>
              )}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={clearCart}>
            Wyczyść koszyk
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Produkt</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Cena netto</TableHead>
                <TableHead className="text-center">Ilość</TableHead>
                <TableHead className="text-right">Suma</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const unitPrice = applyDiscount(item.priceNet, discountPercent);
                const lineTotal = unitPrice * item.quantity;

                return (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <p className="max-w-xs font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{item.unit}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.symbol}
                    </TableCell>
                    <TableCell className="text-right">
                      {hasDiscount ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.priceNet)}
                          </span>
                          <span className="font-medium text-turquoise-700 dark:text-turquoise-400">
                            {formatPrice(unitPrice)}
                          </span>
                        </div>
                      ) : (
                        formatPrice(item.priceNet)
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Zmniejsz ilość"
                        >
                          <Minus />
                        </Button>
                        <Input
                          type="number"
                          min={1}
                          max={item.stock}
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (!Number.isNaN(value)) {
                              updateQuantity(item.productId, value);
                            }
                          }}
                          className="h-8 w-16 text-center"
                          aria-label={`Ilość ${item.name}`}
                        />
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                          aria-label="Zwiększ ilość"
                        >
                          <Plus />
                        </Button>
                      </div>
                      <p className="mt-1 text-center text-[10px] text-muted-foreground">
                        max {item.stock}
                      </p>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(lineTotal)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Usuń ${item.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Licznik promocji — żywo przy zmianie ilości (jak AutoCalc w Excelu) */}
      <Card className="border-border/60">
        <CardContent className="py-5">
          <CartPromotionsBanner cartNet={totalNet} />
        </CardContent>
      </Card>

      {orderBlocked && arrearsMessage && (
        <Alert variant="destructive">
          <AlertTitle>Zamówienia zablokowane</AlertTitle>
          <AlertDescription>{arrearsMessage}</AlertDescription>
        </Alert>
      )}

      <Card className="border-turquoise-500/30 bg-turquoise-500/5">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm text-muted-foreground">
                Wartość koszyka netto
              </p>
              {hasDiscount && (
                <Badge className="bg-turquoise-500/15 text-turquoise-700">
                  Rabat −{discountPercent}%
                </Badge>
              )}
            </div>
            {hasDiscount && (
              <p className="mt-1 text-sm text-muted-foreground line-through">
                {formatPrice(totalListNet)}
              </p>
            )}
            <p className="text-3xl font-semibold text-navy-900 dark:text-white">
              {formatPrice(totalNet)}
            </p>
            {hasDiscount ? (
              <p className="mt-1 text-xs text-turquoise-700 dark:text-turquoise-400">
                Oszczędzasz {formatPrice(savings)} dzięki rabatowi z profilu
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Ceny hurtowe · bez VAT
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" render={<Link href="/b2b/katalog" />}>
              Kontynuuj zakupy
            </Button>
            <Button
              className="bg-turquoise-500 hover:bg-turquoise-600"
              onClick={() => setStep("form")}
              disabled={orderBlocked}
              title={
                orderBlocked
                  ? "Złóż zamówienie niedostępne — masz zaległości płatnicze"
                  : undefined
              }
            >
              Złóż zamówienie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
