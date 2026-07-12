import type {
  B2BOrder,
  CartItem,
  CreateOrderInput,
  OrderItem,
} from "./types";

const STORAGE_KEY = "akwen-b2b-orders";

function readOrders(): B2BOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as B2BOrder[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function getOrders(): B2BOrder[] {
  return readOrders();
}

export function saveOrder(order: B2BOrder): void {
  const orders = readOrders();
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
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

function cartItemsToOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    productId: item.productId,
    symbol: item.symbol,
    name: item.name,
    unit: item.unit,
    priceNet: item.priceNet,
    quantity: item.quantity,
    lineTotal: item.priceNet * item.quantity,
  }));
}

export function createOrder(input: CreateOrderInput): B2BOrder {
  const existingOrders = readOrders();
  const orderItems = cartItemsToOrderItems(input.items);
  const totalNet = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: crypto.randomUUID(),
    orderNumber: generateOrderNumber(existingOrders),
    customerId: input.customerId,
    companyName: input.companyName,
    status: "new",
    items: orderItems,
    totalNet,
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