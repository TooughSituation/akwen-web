"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/b2b/format";
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

export function CartView() {
  const { items, isHydrated, totalItems, totalNet, updateQuantity, removeItem, clearCart } =
    useCart();

  if (!isHydrated) {
    return (
      <Card className="border-border/60">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          Ładowanie koszyka…
        </CardContent>
      </Card>
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
                const lineTotal = item.priceNet * item.quantity;

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
                      {formatPrice(item.priceNet)}
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

      <Card className="border-turquoise-500/30 bg-turquoise-500/5">
        <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Wartość koszyka netto</p>
            <p className="text-3xl font-semibold text-navy-900 dark:text-white">
              {formatPrice(totalNet)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ceny hurtowe · bez VAT
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" render={<Link href="/b2b/katalog" />}>
              Kontynuuj zakupy
            </Button>
            <Button
              className="bg-turquoise-500 hover:bg-turquoise-600"
              disabled
              title="Moduł składania zamówienia — wkrótce"
            >
              Złóż zamówienie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}