"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { MOCK_CUSTOMER, SAVED_DELIVERY_ADDRESSES } from "@/lib/b2b/auth";
import { formatPrice } from "@/lib/b2b/format";
import { createOrder, saveOrder } from "@/lib/b2b/orders";
import type { B2BOrder } from "@/lib/b2b/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface OrderFormProps {
  onSuccess: (order: B2BOrder) => void;
  onCancel: () => void;
}

export function OrderForm({ onSuccess, onCancel }: OrderFormProps) {
  const { items, totalItems, totalNet, clearCart } = useCart();
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [addressMode, setAddressMode] = useState<"saved" | "custom">("saved");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [customAddress, setCustomAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getDeliveryAddress(): string {
    if (addressMode === "custom") return customAddress.trim();
    return SAVED_DELIVERY_ADDRESSES[selectedAddressIndex];
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!deliveryDate) {
      setError("Wybierz datę dostawy.");
      return;
    }

    const deliveryAddress = getDeliveryAddress();
    if (!deliveryAddress) {
      setError("Podaj adres dostawy.");
      return;
    }

    if (items.length === 0) {
      setError("Koszyk jest pusty — dodaj produkty przed złożeniem zamówienia.");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        items,
        customerId: MOCK_CUSTOMER.id,
        companyName: MOCK_CUSTOMER.companyName,
        deliveryDate: format(deliveryDate, "yyyy-MM-dd"),
        deliveryAddress,
        notes,
      });

      saveOrder(order);
      clearCart();
      onSuccess(order);
    } catch {
      setError("Nie udało się złożyć zamówienia. Spróbuj ponownie.");
      setIsSubmitting(false);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Dane dostawy</CardTitle>
          <CardDescription>
            Uzupełnij informacje potrzebne do realizacji zamówienia hurtowego.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="delivery-date">Data dostawy</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id="delivery-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start font-normal",
                      !deliveryDate && "text-muted-foreground"
                    )}
                  />
                }
              >
                <CalendarIcon className="size-4" />
                {deliveryDate
                  ? format(deliveryDate, "d MMMM yyyy", { locale: pl })
                  : "Wybierz datę dostawy"}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={(date) => {
                    setDeliveryDate(date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date < today}
                  locale={pl}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label>Adres dostawy</Label>
            <div className="space-y-2">
              {SAVED_DELIVERY_ADDRESSES.map((address, index) => (
                <label
                  key={address}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    addressMode === "saved" && selectedAddressIndex === index
                      ? "border-turquoise-500 bg-turquoise-500/5"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={
                      addressMode === "saved" && selectedAddressIndex === index
                    }
                    onChange={() => {
                      setAddressMode("saved");
                      setSelectedAddressIndex(index);
                    }}
                    className="mt-1 accent-turquoise-500"
                  />
                  <span className="text-sm leading-relaxed">{address}</span>
                </label>
              ))}

              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  addressMode === "custom"
                    ? "border-turquoise-500 bg-turquoise-500/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <input
                  type="radio"
                  name="address"
                  checked={addressMode === "custom"}
                  onChange={() => setAddressMode("custom")}
                  className="mt-1 accent-turquoise-500"
                />
                <span className="text-sm font-medium">Inny adres</span>
              </label>

              {addressMode === "custom" && (
                <Input
                  placeholder="Wpisz pełny adres dostawy..."
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Uwagi do zamówienia</Label>
            <Textarea
              id="notes"
              placeholder="Np. dostawa od godz. 8:00, kontakt do magazyniera, preferowana rampa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-turquoise-500/30 bg-turquoise-500/5">
        <CardHeader>
          <CardTitle>Podsumowanie zamówienia</CardTitle>
          <CardDescription>
            {items.length} {items.length === 1 ? "produkt" : "produkty"} ·{" "}
            {totalItems} {totalItems === 1 ? "sztuka" : "sztuk"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between gap-4 border-b border-border/50 pb-2 last:border-0"
              >
                <span className="line-clamp-1 text-muted-foreground">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(item.priceNet * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-end justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Wartość netto</p>
              <p className="text-2xl font-semibold text-navy-900 dark:text-white">
                {formatPrice(totalNet)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Wróć do koszyka
              </Button>
              <Button
                type="submit"
                className="bg-turquoise-500 hover:bg-turquoise-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Składanie…" : "Potwierdź zamówienie"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}