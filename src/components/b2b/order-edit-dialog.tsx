"use client";

/**
 * Edycja zamówienia (data dostawy, adres, uwagi).
 *
 * Analogia VBA: UserForm do zmiany pól wiersza arkusza „Zamówienia”,
 * potem Call updateOrder (zapis) — bez ruszania pozycji produktów.
 */

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useProfile } from "@/contexts/profile-context";
import { canModifyOrder, updateOrder } from "@/lib/b2b/orders";
import type { B2BOrder } from "@/lib/b2b/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface OrderEditDialogProps {
  order: B2BOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: (order: B2BOrder) => void;
}

export function OrderEditDialog({
  order,
  open,
  onOpenChange,
  onSaved,
}: OrderEditDialogProps) {
  const { profile, userId } = useProfile();
  const deliveryAddresses = profile.deliveryAddresses;

  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [addressMode, setAddressMode] = useState<"saved" | "custom">("custom");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [customAddress, setCustomAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Wypełnij formularz przy otwarciu (jak Load UserForm z wiersza)
  useEffect(() => {
    if (!open || !order) return;

    setError(null);
    setIsSaving(false);
    setNotes(order.notes ?? "");

    const parsed = new Date(`${order.deliveryDate}T12:00:00`);
    setDeliveryDate(Number.isNaN(parsed.getTime()) ? undefined : parsed);

    const matchIndex = deliveryAddresses.findIndex(
      (a) => a.address.trim() === order.deliveryAddress.trim()
    );
    if (matchIndex >= 0) {
      setAddressMode("saved");
      setSelectedAddressIndex(matchIndex);
      setCustomAddress("");
    } else {
      setAddressMode("custom");
      setCustomAddress(order.deliveryAddress);
    }
  }, [open, order, deliveryAddresses]);

  if (!order) return null;

  const gate = canModifyOrder(order);

  function getDeliveryAddress(): string {
    if (addressMode === "custom") return customAddress.trim();
    return deliveryAddresses[selectedAddressIndex]?.address ?? "";
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!order) return;

    if (!gate.allowed) {
      setError(gate.message ?? "Nie można edytować tego zamówienia.");
      return;
    }

    if (!deliveryDate) {
      setError("Wybierz datę dostawy.");
      return;
    }

    const deliveryAddress = getDeliveryAddress();
    if (!deliveryAddress) {
      setError("Podaj adres dostawy.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = updateOrder(
        order.id,
        {
          deliveryDate: format(deliveryDate, "yyyy-MM-dd"),
          deliveryAddress,
          notes,
        },
        userId
      );
      onSaved?.(updated);
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się zapisać zmian."
      );
      setIsSaving(false);
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edycja zamówienia</DialogTitle>
          <DialogDescription>
            {order.orderNumber} — zmień datę dostawy, adres lub uwagi. Pozycje
            produktów pozostają bez zmian.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-5">
          {!gate.allowed && (
            <Alert variant="destructive">
              <AlertDescription>{gate.message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-delivery-date">Data dostawy</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id="edit-delivery-date"
                    type="button"
                    variant="outline"
                    disabled={!gate.allowed}
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
            <p className="text-xs text-muted-foreground">
              Nowa data musi być co najmniej 24 h od teraz (reguła biznesowa).
            </p>
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
                      : "border-border hover:bg-muted/50",
                    !gate.allowed && "pointer-events-none opacity-60"
                  )}
                >
                  <input
                    type="radio"
                    name="edit-address"
                    disabled={!gate.allowed}
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
                    : "border-border hover:bg-muted/50",
                  !gate.allowed && "pointer-events-none opacity-60"
                )}
              >
                <input
                  type="radio"
                  name="edit-address"
                  disabled={!gate.allowed}
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
                  disabled={!gate.allowed}
                  className="mt-1"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Uwagi do zamówienia</Label>
            <Textarea
              id="edit-notes"
              placeholder="Np. dostawa od godz. 8:00…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!gate.allowed}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              className="bg-turquoise-500 hover:bg-turquoise-600"
              disabled={!gate.allowed || isSaving}
            >
              {isSaving ? "Zapisywanie…" : "Zapisz zmiany"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
