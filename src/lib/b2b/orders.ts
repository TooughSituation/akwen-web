import { applyDiscount, roundMoney } from "./format";
import { calculatePointsFromNet, earnPointsForOrder } from "./loyalty";
import { ordersStorageKey, STORAGE_BASE } from "./storage-keys";
import type {
  B2BOrder,
  CartItem,
  CreateOrderInput,
  OrderItem,
} from "./types";

export const ORDERS_STORAGE_KEY = STORAGE_BASE.orders;

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
