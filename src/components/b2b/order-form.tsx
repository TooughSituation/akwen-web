"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useProfile } from "@/contexts/profile-context";
import {
  applyDiscount,
  formatPrice,
  sumCartNet,
  sumDiscountSavings,
} from "@/lib/b2b/format";
import { apiCreateOrder } from "@/lib/b2b/api-client";
import { calculatePointsFromNet } from "@/lib/b2b/loyalty";
import { createOrder, getOrders, saveOrder } from "@/lib/b2b/orders";
import { getNextPromotionProgress } from "@/lib/b2b/promotions";
import type { B2BOrder } from "@/lib/b2b/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  const { items, totalItems, clearCart } = useCart();
  const { profile, userId } = useProfile();
  const deliveryAddresses = profile.deliveryAddresses;
  const discountPercent = profile.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;
  const totalListNet = sumCartNet(items, 0);
  const totalNet = sumCartNet(items, discountPercent);
  const savings = sumDiscountSavings(items, discountPercent);
  const estimatedPoints = calculatePointsFromNet(totalNet);
  const promoProgress = getNextPromotionProgress(totalNet);
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
    return deliveryAddresses[selectedAddressIndex]?.address ?? "";
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

    const payload = {
      items,
      customerId: profile.id,
      companyName: profile.companyName,
      discountPercent,
      deliveryDate: format(deliveryDate, "yyyy-MM-dd"),
      deliveryAddress,
      notes,
    };

    // Mock API (Route Handler) → zapis lokalny (localStorage) — jak makro → arkusz
    void (async () => {
      try {
        let order: B2BOrder;
        try {
          order = await apiCreateOrder(payload);
        } catch {
          // Fallback offline / błąd API: stara ścieżka lokalna
          order = createOrder(payload, getOrders(userId));
        }
        saveOrder(order, userId);
        clearCart();
        onSuccess(order);
      } catch {
        setError("Nie udało się złożyć zamówienia. Spróbuj ponownie.");
        setIsSubmitting(false);
      }
    })();
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
              {deliveryAddresses.map((address, index) => (
                <label
                  key={address.id}
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
                  <span className="text-sm leading-relaxed">
                    <span className="font-medium">{address.label}</span>
                    <br />
                    {address.address}
                  </span>
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
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle>Podsumowanie zamówienia</CardTitle>
              <CardDescription>
                {items.length} {items.length === 1 ? "produkt" : "produkty"} ·{" "}
                {totalItems} {totalItems === 1 ? "sztuka" : "sztuk"}
              </CardDescription>
            </div>
            {hasDiscount && (
              <Badge className="bg-turquoise-500/15 text-turquoise-700">
                Rabat −{discountPercent}%
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            {items.map((item) => {
              const unitPrice = applyDiscount(item.priceNet, discountPercent);
              const lineTotal = unitPrice * item.quantity;

              return (
                <li
                  key={item.productId}
                  className="flex justify-between gap-4 border-b border-border/50 pb-2 last:border-0"
                >
                  <span className="line-clamp-1 text-muted-foreground">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 text-right font-medium">
                    {hasDiscount && (
                      <span className="mr-2 text-xs font-normal text-muted-foreground line-through">
                        {formatPrice(item.priceNet * item.quantity)}
                      </span>
                    )}
                    {formatPrice(lineTotal)}
                  </span>
                </li>
              );
            })}
          </ul>
          {hasDiscount && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Wartość katalogowa</span>
              <span className="line-through">{formatPrice(totalListNet)}</span>
            </div>
          )}
          {hasDiscount && (
            <div className="flex justify-between text-sm text-turquoise-700 dark:text-turquoise-400">
              <span>Oszczędność (rabat −{discountPercent}%)</span>
              <span>−{formatPrice(savings)}</span>
            </div>
          )}
          {estimatedPoints > 0 && (
            <div className="flex justify-between text-sm text-turquoise-700 dark:text-turquoise-400">
              <span>Punkty lojalnościowe (po złożeniu)</span>
              <span>+{estimatedPoints} pkt</span>
            </div>
          )}
          {promoProgress && (
            <div
              className={
                promoProgress.unlocked
                  ? "flex justify-between text-sm text-turquoise-700 dark:text-turquoise-400"
                  : "flex justify-between text-sm text-coral-600 dark:text-coral-400"
              }
            >
              <span>
                {promoProgress.unlocked
                  ? "Promocja koszykowa"
                  : "Do najbliższej promocji"}
              </span>
              <span className="text-right">
                {promoProgress.unlocked
                  ? promoProgress.promotion.badgeLabel
                  : `brakuje ${formatPrice(promoProgress.remaining)}`}
              </span>
            </div>
          )}
          <div className="flex items-end justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {hasDiscount ? "Wartość netto po rabacie" : "Wartość netto"}
              </p>
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