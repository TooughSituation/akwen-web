"use client";

/**
 * Potwierdzenie anulacji — jak MsgBox vbYesNo w VBA.
 * Po OK: status zamówienia → cancelled (localStorage).
 */

import { useState } from "react";
import { cancelOrder, canModifyOrder } from "@/lib/b2b/orders";
import type { B2BOrder } from "@/lib/b2b/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderCancelDialogProps {
  order: B2BOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string | null;
  onCancelled?: (order: B2BOrder) => void;
}

export function OrderCancelDialog({
  order,
  open,
  onOpenChange,
  userId,
  onCancelled,
}: OrderCancelDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  if (!order) return null;

  const gate = canModifyOrder(order);

  function handleConfirm() {
    setError(null);

    if (!order) return;

    if (!gate.allowed) {
      setError(gate.message ?? "Nie można anulować tego zamówienia.");
      return;
    }

    setIsCancelling(true);
    try {
      const updated = cancelOrder(order.id, userId);
      onCancelled?.(updated);
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Nie udało się anulować zamówienia."
      );
      setIsCancelling(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Anulować zamówienie?</DialogTitle>
          <DialogDescription>
            Zamówienie <strong>{order.orderNumber}</strong> otrzyma status
            „Anulowane”. Tej operacji nie da się cofnąć w portalu B2B.
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCancelling}
          >
            Nie, zostaw
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={!gate.allowed || isCancelling}
          >
            {isCancelling ? "Anulowanie…" : "Tak, anuluj zamówienie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
