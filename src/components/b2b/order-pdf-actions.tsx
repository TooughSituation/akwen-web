"use client";

import { useCallback, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, Loader2, Mail } from "lucide-react";
import { OrderPdfDocument } from "@/lib/b2b/order-pdf";
import {
  sendOrderConfirmationEmailMock,
  type OrderEmailResult,
} from "@/lib/b2b/order-email";
import type { B2BOrder } from "@/lib/b2b/types";
import { Button } from "@/components/ui/button";

interface OrderPdfActionsProps {
  order: B2BOrder;
  customerEmail?: string;
  contactPerson?: string;
  /** Wywołane po mock-wysłaniu e-maila (np. toast / alert). */
  onEmailMock?: (result: OrderEmailResult) => void;
}

/**
 * Pobieranie PDF + mock e-mail — jak przyciski „Eksport PDF” / „Wyślij” w Access.
 */
export function OrderPdfActions({
  order,
  customerEmail,
  contactPerson,
  onEmailMock,
}: OrderPdfActionsProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const handleDownloadPdf = useCallback(async () => {
    setPdfLoading(true);
    try {
      const blob = await pdf(
        <OrderPdfDocument
          order={order}
          customerEmail={customerEmail}
          contactPerson={contactPerson}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${order.orderNumber.replace(/[^\w.-]+/g, "_")}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[AKWEN PDF] Błąd generowania", error);
      window.alert(
        "Nie udało się wygenerować PDF. Sprawdź połączenie (fonty) i spróbuj ponownie."
      );
    } finally {
      setPdfLoading(false);
    }
  }, [order, customerEmail, contactPerson]);

  const handleMockEmail = useCallback(() => {
    setEmailLoading(true);
    try {
      const result = sendOrderConfirmationEmailMock(order, {
        to: customerEmail,
        contactPerson,
      });
      onEmailMock?.(result);
    } finally {
      setEmailLoading(false);
    }
  }, [order, customerEmail, contactPerson, onEmailMock]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        type="button"
        variant="outline"
        onClick={handleDownloadPdf}
        disabled={pdfLoading}
      >
        {pdfLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Download className="size-4" />
        )}
        {pdfLoading ? "Generuję PDF…" : "Pobierz PDF"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleMockEmail}
        disabled={emailLoading}
      >
        {emailLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Mail className="size-4" />
        )}
        Wyślij e-mail (mock)
      </Button>
    </div>
  );
}
