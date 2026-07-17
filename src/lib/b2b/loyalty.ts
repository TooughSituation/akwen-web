/**
 * Program lojalnościowy B2B.
 *
 * Analogia Excel:
 *  - Arkusz „Punkty”   = saldo + ledger (jak tabela ruchów)
 *  - Arkusz „Nagrody”  = katalog nagród (stałe wiersze)
 *  - Arkusz „Wymiany”  = redemptions
 *
 * Reguła MVP: 1 punkt za każde pełne 10 zł netto zamówienia (po rabacie).
 * Przykład: 99,99 zł → 9 pkt; 100 zł → 10 pkt.
 */

import { loyaltyStorageKey, STORAGE_BASE } from "./storage-keys";
import type {
  B2BOrder,
  LoyaltyAccount,
  LoyaltyLedgerEntry,
  LoyaltyRedemption,
  LoyaltyReward,
  LoyaltyRewardCategory,
} from "./types";

export const LOYALTY_STORAGE_KEY = STORAGE_BASE.loyalty;
export const LOYALTY_UPDATED_EVENT = "akwen-loyalty-updated";

/** 1 punkt za każde PLN_PER_POINT zł netto. */
export const PLN_PER_POINT = 10;

/**
 * Oblicz punkty z kwoty netto.
 * Jak w Excelu: =INT(SumaNetto/10)
 */
export function calculatePointsFromNet(totalNet: number): number {
  if (!Number.isFinite(totalNet) || totalNet <= 0) return 0;
  return Math.floor(totalNet / PLN_PER_POINT);
}

export function emptyLoyaltyAccount(userId: string): LoyaltyAccount {
  return {
    userId,
    balance: 0,
    ledger: [],
    redemptions: [],
    updatedAt: new Date().toISOString(),
  };
}

function normalizeAccount(
  raw: Partial<LoyaltyAccount> | null,
  userId: string
): LoyaltyAccount {
  const base = emptyLoyaltyAccount(userId);
  if (!raw) return base;
  return {
    userId,
    balance: Math.max(0, Number(raw.balance) || 0),
    ledger: Array.isArray(raw.ledger) ? raw.ledger : [],
    redemptions: Array.isArray(raw.redemptions) ? raw.redemptions : [],
    updatedAt: raw.updatedAt ?? base.updatedAt,
  };
}

export function getLoyaltyAccount(userId?: string | null): LoyaltyAccount {
  if (typeof window === "undefined" || !userId) {
    return emptyLoyaltyAccount(userId ?? "anonymous");
  }

  const key = loyaltyStorageKey(userId);
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return emptyLoyaltyAccount(userId);
    const parsed = JSON.parse(saved) as LoyaltyAccount;
    return normalizeAccount(parsed, userId);
  } catch {
    localStorage.removeItem(key);
    return emptyLoyaltyAccount(userId);
  }
}

export function saveLoyaltyAccount(account: LoyaltyAccount): void {
  if (typeof window === "undefined" || !account.userId) return;
  const next = {
    ...account,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(
    loyaltyStorageKey(account.userId),
    JSON.stringify(next)
  );
  window.dispatchEvent(new Event(LOYALTY_UPDATED_EVENT));
}

/**
 * Naliczenie punktów za zamówienie.
 * Idempotentne: jeśli w ledgerze jest już earn dla orderId — nie dubluje.
 * Analogia VBA: Sub NaliczPunkty(Order) — szuka w arkuszu, czy już jest wiersz.
 */
export function earnPointsForOrder(
  order: B2BOrder,
  userId?: string | null
): LoyaltyAccount | null {
  const scope = userId ?? order.customerId;
  if (!scope || typeof window === "undefined") return null;

  const points =
    typeof order.loyaltyPointsEarned === "number" &&
    order.loyaltyPointsEarned >= 0
      ? order.loyaltyPointsEarned
      : calculatePointsFromNet(order.totalNet);

  if (points <= 0) {
    return getLoyaltyAccount(scope);
  }

  const account = getLoyaltyAccount(scope);
  const alreadyEarned = account.ledger.some(
    (entry) => entry.type === "earn" && entry.orderId === order.id
  );
  if (alreadyEarned) return account;

  const balanceAfter = account.balance + points;
  const entry: LoyaltyLedgerEntry = {
    id: crypto.randomUUID(),
    type: "earn",
    points,
    balanceAfter,
    description: `Punkty za zamówienie ${order.orderNumber}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    createdAt: new Date().toISOString(),
  };

  const next: LoyaltyAccount = {
    ...account,
    balance: balanceAfter,
    ledger: [entry, ...account.ledger],
    updatedAt: new Date().toISOString(),
  };
  saveLoyaltyAccount(next);
  return next;
}

/**
 * Katalog nagród — jak stała tabela „Nagrody” w Excelu.
 */
export const LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: "rew-discount-2",
    name: "Dodatkowy rabat 2% na kolejne zamówienie",
    description:
      "Kupon handlowy −2% na jedno zamówienie (realizacja przez handlowca Akwen).",
    pointsCost: 50,
    category: "discount",
  },
  {
    id: "rew-discount-5",
    name: "Dodatkowy rabat 5% na kolejne zamówienie",
    description:
      "Kupon handlowy −5% na jedno zamówienie (realizacja przez handlowca Akwen).",
    pointsCost: 120,
    category: "discount",
  },
  {
    id: "rew-product-smoked",
    name: "Gratis: próbka ryby wędzonej",
    description:
      "Paczka promocyjna ryby wędzonej do degustacji w punkcie (ok. 200–300 g).",
    pointsCost: 80,
    category: "product",
  },
  {
    id: "rew-product-paste",
    name: "Gratis: zestaw past rybnych (3 szt.)",
    description: "Trzy popularne pasty z oferty Akwen — do degustacji dla personelu.",
    pointsCost: 100,
    category: "product",
  },
  {
    id: "rew-gadget-cooler",
    name: "Torba termiczna Akwen",
    description: "Mała torba chłodząca z logo — przydatna przy odbiorze towaru.",
    pointsCost: 200,
    category: "gadget",
  },
  {
    id: "rew-gadget-apron",
    name: "Fartuch roboczy Akwen",
    description: "Fartuch dla personelu sklepu / gastronomii z brandingiem.",
    pointsCost: 150,
    category: "gadget",
  },
];

export function getLoyaltyReward(id: string): LoyaltyReward | undefined {
  return LOYALTY_REWARDS.find((r) => r.id === id);
}

export function getRewardCategoryLabel(
  category: LoyaltyRewardCategory
): string {
  const labels: Record<LoyaltyRewardCategory, string> = {
    discount: "Rabat",
    product: "Produkt gratis",
    gadget: "Gadżet",
  };
  return labels[category];
}

export type RedeemResult =
  | { ok: true; account: LoyaltyAccount; redemption: LoyaltyRedemption }
  | { ok: false; error: string };

/**
 * Wymiana punktów na nagrodę.
 * Analogia Excel: odejmij z salda, dopisz wiersz w „Wymiany” i w ledgerze.
 */
export function redeemReward(
  rewardId: string,
  userId: string | null | undefined
): RedeemResult {
  if (!userId || typeof window === "undefined") {
    return { ok: false, error: "Brak zalogowanego użytkownika." };
  }

  const reward = getLoyaltyReward(rewardId);
  if (!reward) {
    return { ok: false, error: "Nie znaleziono nagrody." };
  }

  const account = getLoyaltyAccount(userId);
  if (account.balance < reward.pointsCost) {
    return {
      ok: false,
      error: `Za mało punktów (masz ${account.balance}, potrzeba ${reward.pointsCost}).`,
    };
  }

  const balanceAfter = account.balance - reward.pointsCost;
  const now = new Date().toISOString();
  const redemption: LoyaltyRedemption = {
    id: crypto.randomUUID(),
    rewardId: reward.id,
    rewardName: reward.name,
    pointsSpent: reward.pointsCost,
    createdAt: now,
    status: "requested",
  };

  const entry: LoyaltyLedgerEntry = {
    id: crypto.randomUUID(),
    type: "redeem",
    points: -reward.pointsCost,
    balanceAfter,
    description: `Wymiana: ${reward.name}`,
    rewardId: reward.id,
    rewardName: reward.name,
    createdAt: now,
  };

  const next: LoyaltyAccount = {
    ...account,
    balance: balanceAfter,
    ledger: [entry, ...account.ledger],
    redemptions: [redemption, ...account.redemptions],
    updatedAt: now,
  };
  saveLoyaltyAccount(next);
  return { ok: true, account: next, redemption };
}
