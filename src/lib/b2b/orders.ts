import { applyDiscount, roundMoney } from "./format";
import { calculatePointsFromNet, earnPointsForOrder } from "./loyalty";
import { ordersStorageKey, STORAGE_BASE } from "./storage-keys";
import type {
  B2BOrder,
  CartItem,
  CreateOrderInput,
  OrderItem,
  UpdateOrderInput,
} from "./types";

export const ORDERS_STORAGE_KEY = STORAGE_BASE.orders;

/**
 * Minimalny czas do daty dostawy (w godzinach), żeby jeszcze edytować/anulować.
 * Jak reguła biznesowa w Excelu: „zmiany tylko gdy DataDostawy − Teraz >= 24h”.
 */
export const ORDER_MODIFY_MIN_HOURS = 24;

function normalizeOrderItem(item: OrderItem): OrderItem {
  const listPriceNet =
    typeof item.listPriceNet === "number" && Number.isFinite(item.listPriceNet)
      ? item.listPriceNet
      : item.priceNet;

  return {
    ...item,
    listPriceNet,
    priceNet: item.priceNet,
    lineTotal: item.lineTotal,
  };
}

function normalizeOrder(order: B2BOrder): B2BOrder {
  return {
    ...order,
    discountPercent:
      typeof order.discountPercent === "number" &&
      Number.isFinite(order.discountPercent)
        ? order.discountPercent
        : 0,
    items: Array.isArray(order.items)
      ? order.items.map(normalizeOrderItem)
      : [],
  };
}

function readOrders(userId?: string | null): B2BOrder[] {
  if (typeof window === "undefined") return [];

  const key = ordersStorageKey(userId);

  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as B2BOrder[];
    return Array.isArray(parsed) ? parsed.map(normalizeOrder) : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}

export function getOrders(userId?: string | null): B2BOrder[] {
  return readOrders(userId);
}

export function saveOrder(order: B2BOrder, userId?: string | null): void {
  const scope = userId ?? order.customerId;
  const orders = readOrders(scope);
  orders.unshift(order);
  localStorage.setItem(ordersStorageKey(scope), JSON.stringify(orders));
  // Naliczenie punktów lojalnościowych (arkusz „Punkty”) — przy zapisie zamówienia
  earnPointsForOrder(order, scope);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("akwen-orders-updated"));
  }
}

/**
 * Nadpisuje listę zamówień w localStorage (jak Range.Value = tablica).
 * Nie nalicza punktów — używane przy edycji / anulacji.
 */
function writeOrders(orders: B2BOrder[], userId?: string | null): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ordersStorageKey(userId), JSON.stringify(orders));
  window.dispatchEvent(new Event("akwen-orders-updated"));
}

/**
 * Ile godzin zostało do początku dnia dostawy (lokalnie).
 * deliveryDate = „YYYY-MM-DD” → traktujemy jak 00:00 tego dnia.
 *
 * Analogia VBA:
 *   hours = DateDiff("h", Now, CDate(deliveryDate))
 */
export function hoursUntilDelivery(
  deliveryDateYmd: string,
  now: Date = new Date()
): number {
  const deliveryStart = new Date(`${deliveryDateYmd}T00:00:00`);
  if (Number.isNaN(deliveryStart.getTime())) return Number.NEGATIVE_INFINITY;
  return (deliveryStart.getTime() - now.getTime()) / (1000 * 60 * 60);
}

/**
 * Czy status pozwala na edycję/anulację w UI (tylko „new”).
 * Jak filtr: If Status = "new" Then pokaż przyciski.
 */
export function isOrderStatusModifiable(order: B2BOrder): boolean {
  return order.status === "new";
}

/**
 * Czy mieścimy się w oknie czasowym (min. 24h przed dniem dostawy).
 */
export function isWithinModificationWindow(
  order: B2BOrder,
  now: Date = new Date()
): boolean {
  return hoursUntilDelivery(order.deliveryDate, now) >= ORDER_MODIFY_MIN_HOURS;
}

export type OrderModifyBlockReason =
  | "not_new"
  | "too_late"
  | "invalid_date";

export interface OrderModifyCheck {
  allowed: boolean;
  reason?: OrderModifyBlockReason;
  /** Tekst po polsku do Alert / title przycisku. */
  message?: string;
}

/**
 * Pełna reguła: status „new” + min. 24h do dostawy.
 * Używaj przed zapisem edycji / anulacji (walidacja jak w makrze).
 */
export function canModifyOrder(
  order: B2BOrder,
  now: Date = new Date()
): OrderModifyCheck {
  if (!isOrderStatusModifiable(order)) {
    return {
      allowed: false,
      reason: "not_new",
      message:
        "Edycja i anulacja są dostępne tylko dla zamówień ze statusem „Nowe”.",
    };
  }

  const hours = hoursUntilDelivery(order.deliveryDate, now);
  if (!Number.isFinite(hours)) {
    return {
      allowed: false,
      reason: "invalid_date",
      message: "Nieprawidłowa data dostawy zamówienia.",
    };
  }

  if (hours < ORDER_MODIFY_MIN_HOURS) {
    return {
      allowed: false,
      reason: "too_late",
      message: `Zmiany możliwe do ${ORDER_MODIFY_MIN_HOURS} h przed datą dostawy. Termin już minął lub jest za blisko.`,
    };
  }

  return { allowed: true };
}

/**
 * Aktualizuje datę dostawy, adres i uwagi istniejącego zamówienia.
 * Zapis do localStorage (arkusz „Zamówienia” — Update wiersza).
 */
export function updateOrder(
  orderId: string,
  fields: UpdateOrderInput,
  userId?: string | null
): B2BOrder {
  if (typeof window === "undefined") {
    throw new Error("Edycja zamówienia działa tylko w przeglądarce.");
  }

  const orders = readOrders(userId);
  const index = orders.findIndex((o) => o.id === orderId);
  if (index < 0) {
    throw new Error("Nie znaleziono zamówienia.");
  }

  const current = orders[index];
  const check = canModifyOrder(current);
  if (!check.allowed) {
    throw new Error(check.message ?? "Nie można edytować tego zamówienia.");
  }

  const deliveryDate = fields.deliveryDate?.trim() ?? "";
  const deliveryAddress = fields.deliveryAddress?.trim() ?? "";
  const notes = (fields.notes ?? "").trim();

  if (!deliveryDate) {
    throw new Error("Wybierz datę dostawy.");
  }
  if (!deliveryAddress) {
    throw new Error("Podaj adres dostawy.");
  }

  // Nowa data też musi zachować regułę 24h (nie da się „przesunąć” na jutro)
  if (hoursUntilDelivery(deliveryDate) < ORDER_MODIFY_MIN_HOURS) {
    throw new Error(
      `Nowa data dostawy musi być co najmniej ${ORDER_MODIFY_MIN_HOURS} h od teraz.`
    );
  }

  const updated: B2BOrder = {
    ...current,
    deliveryDate,
    deliveryAddress,
    notes,
    updatedAt: new Date().toISOString(),
  };

  const next = [...orders];
  next[index] = updated;
  writeOrders(next, userId);
  return updated;
}

/**
 * Anuluje zamówienie (status → cancelled). Wymaga potwierdzenia w UI.
 */
export function cancelOrder(
  orderId: string,
  userId?: string | null
): B2BOrder {
  if (typeof window === "undefined") {
    throw new Error("Anulacja zamówienia działa tylko w przeglądarce.");
  }

  const orders = readOrders(userId);
  const index = orders.findIndex((o) => o.id === orderId);
  if (index < 0) {
    throw new Error("Nie znaleziono zamówienia.");
  }

  const current = orders[index];
  const check = canModifyOrder(current);
  if (!check.allowed) {
    throw new Error(check.message ?? "Nie można anulować tego zamówienia.");
  }

  const updated: B2BOrder = {
    ...current,
    status: "cancelled",
    updatedAt: new Date().toISOString(),
  };

  const next = [...orders];
  next[index] = updated;
  writeOrders(next, userId);
  return updated;
}

export function generateOrderNumber(existingOrders: B2BOrder[]): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const dateStr = `${year}${month}${day}`;
  const prefix = `AKW-${dateStr}-`;

  const todayCount = existingOrders.filter((order) =>
    order.orderNumber.startsWith(prefix)
  ).length;

  return `${prefix}${String(todayCount + 1).padStart(3, "0")}`;
}

function cartItemsToOrderItems(
  items: CartItem[],
  discountPercent: number
): OrderItem[] {
  return items.map((item) => {
    const listPriceNet = item.priceNet;
    const priceNet = applyDiscount(listPriceNet, discountPercent);
    const lineTotal = roundMoney(priceNet * item.quantity);

    return {
      productId: item.productId,
      symbol: item.symbol,
      name: item.name,
      unit: item.unit,
      listPriceNet,
      priceNet,
      quantity: item.quantity,
      lineTotal,
    };
  });
}

/**
 * Buduje zamówienie (czysta logika — przeglądarka i Route Handler).
 */
export function createOrder(
  input: CreateOrderInput,
  existingOrders?: B2BOrder[]
): B2BOrder {
  const knownOrders =
    existingOrders ??
    (typeof window !== "undefined" ? readOrders(input.customerId) : []);
  const discountPercent = Number.isFinite(input.discountPercent)
    ? Math.max(0, input.discountPercent)
    : 0;
  const orderItems = cartItemsToOrderItems(input.items, discountPercent);
  const totalNet = roundMoney(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0)
  );
  const loyaltyPointsEarned = calculatePointsFromNet(totalNet);

  return {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(knownOrders),
    customerId: input.customerId,
    companyName: input.companyName,
    status: "new",
    items: orderItems,
    totalNet,
    discountPercent,
    loyaltyPointsEarned,
    deliveryDate: input.deliveryDate,
    deliveryAddress: input.deliveryAddress,
    notes: input.notes.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function getOrderStatusLabel(status: B2BOrder["status"]): string {
  const labels: Record<B2BOrder["status"], string> = {
    new: "Nowe",
    processing: "W realizacji",
    shipped: "Wysłane",
    delivered: "Dostarczone",
    cancelled: "Anulowane",
  };
  return labels[status];
}

export function countOrderItems(order: B2BOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function countOpenOrders(orders: B2BOrder[]): number {
  return orders.filter(
    (order) => order.status === "new" || order.status === "processing"
  ).length;
}
