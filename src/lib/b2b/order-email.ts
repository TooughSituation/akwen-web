/**
 * Mock potwierdzenia e-mail zamówienia.
 *
 * Analogia VBA: Application.SendMail / Outlook.CreateItem — tutaj na MVP
 * logujemy payload do konsoli (jak Debug.Print). W przyszłości: Resend/SMTP.
 */

import { formatPrice } from "./format";
import type { B2BOrder } from "./types";

export interface OrderEmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
  orderNumber: string;
  sentAt: string;
  provider: "mock-console";
}

export interface OrderEmailResult {
  ok: boolean;
  mock: true;
  payload: OrderEmailPayload;
  message: string;
}

function buildTextBody(order: B2BOrder, contactPerson?: string): string {
  const lines = [
    "Potwierdzenie zamówienia — AKWEN Sp. z o.o.",
    "==========================================",
    "",
    `Numer: ${order.orderNumber}`,
    `Firma: ${order.companyName}`,
    contactPerson ? `Kontakt: ${contactPerson}` : null,
    `Data dostawy: ${order.deliveryDate}`,
    `Adres: ${order.deliveryAddress}`,
    order.notes ? `Uwagi: ${order.notes}` : null,
    order.discountPercent > 0
      ? `Rabat handlowy: −${order.discountPercent}%`
      : null,
    "",
    "Pozycje:",
    ...order.items.map(
      (item) =>
        `  - ${item.name} (${item.symbol}) × ${item.quantity} ${item.unit} = ${formatPrice(item.lineTotal)}`
    ),
    "",
    `Razem netto: ${formatPrice(order.totalNet)}`,
    (order.loyaltyPointsEarned ?? 0) > 0
      ? `Punkty lojalnościowe: +${order.loyaltyPointsEarned} pkt`
      : null,
    "",
    "To jest automatyczne potwierdzenie z portalu B2B (mock MVP).",
    "Dokument nie stanowi faktury VAT.",
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

function buildHtmlBody(order: B2BOrder, contactPerson?: string): string {
  const items = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.name)}</td>
          <td style="padding:6px;border-bottom:1px solid #e2e8f0">${escapeHtml(item.symbol)}</td>
          <td style="padding:6px;border-bottom:1px solid #e2e8f0;text-align:right">${item.quantity} ${escapeHtml(item.unit)}</td>
          <td style="padding:6px;border-bottom:1px solid #e2e8f0;text-align:right">${formatPrice(item.lineTotal)}</td>
        </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="pl">
<body style="font-family:system-ui,sans-serif;color:#001F3F;max-width:640px;margin:0 auto;padding:24px">
  <h1 style="color:#0077B6;font-size:20px;margin:0 0 8px">AKWEN — potwierdzenie zamówienia</h1>
  <p style="margin:0 0 16px;color:#64748b">Portal hurtowy B2B</p>
  <p><strong>Numer:</strong> ${escapeHtml(order.orderNumber)}</p>
  <p><strong>Firma:</strong> ${escapeHtml(order.companyName)}</p>
  ${contactPerson ? `<p><strong>Kontakt:</strong> ${escapeHtml(contactPerson)}</p>` : ""}
  <p><strong>Data dostawy:</strong> ${escapeHtml(order.deliveryDate)}</p>
  <p><strong>Adres:</strong> ${escapeHtml(order.deliveryAddress)}</p>
  ${order.discountPercent > 0 ? `<p><strong>Rabat:</strong> −${order.discountPercent}%</p>` : ""}
  <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px">
    <thead>
      <tr style="background:#f1f5f9">
        <th style="text-align:left;padding:6px">Produkt</th>
        <th style="text-align:left;padding:6px">Symbol</th>
        <th style="text-align:right;padding:6px">Ilość</th>
        <th style="text-align:right;padding:6px">Suma netto</th>
      </tr>
    </thead>
    <tbody>${items}</tbody>
  </table>
  <p style="font-size:16px"><strong>Razem netto: ${formatPrice(order.totalNet)}</strong></p>
  ${(order.loyaltyPointsEarned ?? 0) > 0 ? `<p>Punkty lojalnościowe: <strong>+${order.loyaltyPointsEarned} pkt</strong></p>` : ""}
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
  <p style="font-size:12px;color:#64748b">Wiadomość wygenerowana automatycznie (mock MVP — console.log / brak realnego SMTP).</p>
</body>
</html>`.trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * „Wysyła” e-mail potwierdzający — na MVP log do konsoli przeglądarki.
 * Zwraca payload (jak zwrotka z SendMail), żeby UI mógł pokazać status.
 */
export function sendOrderConfirmationEmailMock(
  order: B2BOrder,
  options?: { to?: string; contactPerson?: string }
): OrderEmailResult {
  const to =
    options?.to?.trim() ||
    "partner@example.pl (brak e-mailu w profilu — mock)";

  const payload: OrderEmailPayload = {
    to,
    subject: `Akwen B2B — potwierdzenie zamówienia ${order.orderNumber}`,
    text: buildTextBody(order, options?.contactPerson),
    html: buildHtmlBody(order, options?.contactPerson),
    orderNumber: order.orderNumber,
    sentAt: new Date().toISOString(),
    provider: "mock-console",
  };

  // Jak Debug.Print w VBA — w DevTools (F12) widać pełną treść
  console.info("[AKWEN MOCK EMAIL] Potwierdzenie zamówienia", payload);
  console.info("[AKWEN MOCK EMAIL] Treść tekstowa:\n", payload.text);

  return {
    ok: true,
    mock: true,
    payload,
    message: `Mock e-mail wysłany do ${to} (szczegóły w konsoli przeglądarki).`,
  };
}
