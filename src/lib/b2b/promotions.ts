/**
 * Dynamiczne promocje koszykowe.
 *
 * Analogia Excel:
 *  - Arkusz „Promocje” — wiersze: próg (zł) + nagroda
 *  - Formuła: brakuje = MAX(0; próg − SumaNettoKoszyka)
 *  - Gdy brakuje = 0 → promocja „odblokowana” (jak Conditional Formatting na zielono)
 *
 * Suma do progu = wartość koszyka netto PO rabacie klienta (jak w checkout).
 */

import { formatPrice, roundMoney } from "./format";

export type PromotionRewardType = "cart_discount_percent" | "free_product";

export interface CartPromotion {
  id: string;
  /** Próg w PLN netto (po rabacie klienta). */
  thresholdNet: number;
  /** Krótka etykieta na badge, np. „−5% od 500 zł”. */
  badgeLabel: string;
  /** Pełny tytuł promocji. */
  title: string;
  /** Opis nagrody. */
  rewardDescription: string;
  rewardType: PromotionRewardType;
  /** Dla cart_discount_percent: dodatkowy % (np. 5). */
  discountPercent?: number;
  /** Dla free_product: nazwa gratisu. */
  freeProductName?: string;
}

/** Stała tabela promocji MVP — jak arkusz bez edycji w UI. */
export const CART_PROMOTIONS: CartPromotion[] = [
  {
    id: "promo-500-discount",
    thresholdNet: 500,
    badgeLabel: "−5% od 500 zł",
    title: "Rabat 5% przy zakupie od 500 zł",
    rewardDescription:
      "Dodatkowy rabat 5% na wartość koszyka (informacyjnie w MVP — handlowiec potwierdza).",
    rewardType: "cart_discount_percent",
    discountPercent: 5,
  },
  {
    id: "promo-800-gratis",
    thresholdNet: 800,
    badgeLabel: "Gratis od 800 zł",
    title: "Gratis przy zakupie od 800 zł",
    rewardDescription:
      "Gratis: próbka pasty rybnej (ok. 3×145 g) — realizacja przez handlowca Akwen.",
    rewardType: "free_product",
    freeProductName: "Zestaw past rybnych (3 szt.)",
  },
];

export interface PromotionProgress {
  promotion: CartPromotion;
  /** Aktualna suma koszyka netto (po rabacie klienta). */
  cartNet: number;
  /** Ile brakuje do progu (0 = osiągnięto). */
  remaining: number;
  /** Czy próg osiągnięty. */
  unlocked: boolean;
  /** Postęp 0–100% do progu. */
  progressPercent: number;
  /** Tekst: „Brakuje Ci X zł do …” / „Masz promocję: …”. */
  message: string;
  /** Krótki komunikat na kartę produktu. */
  shortMessage: string;
}

/**
 * brakuje = MAX(0; próg − suma) — jak w komórce Excel.
 */
export function remainingToThreshold(
  cartNet: number,
  thresholdNet: number
): number {
  const cart = Number.isFinite(cartNet) ? cartNet : 0;
  const threshold = Number.isFinite(thresholdNet) ? thresholdNet : 0;
  return roundMoney(Math.max(0, threshold - cart));
}

export function evaluatePromotion(
  promotion: CartPromotion,
  cartNet: number
): PromotionProgress {
  const remaining = remainingToThreshold(cartNet, promotion.thresholdNet);
  const unlocked = remaining <= 0;
  const progressPercent = Math.min(
    100,
    Math.round(
      (Math.max(0, cartNet) / Math.max(1, promotion.thresholdNet)) * 100
    )
  );

  const rewardHint =
    promotion.rewardType === "cart_discount_percent"
      ? `rabatu −${promotion.discountPercent}%`
      : `gratisu (${promotion.freeProductName ?? "produkt"})`;

  const message = unlocked
    ? `Masz promocję: ${promotion.title}`
    : `Brakuje Ci ${formatPrice(remaining)} do ${rewardHint}`;

  const shortMessage = unlocked
    ? promotion.badgeLabel
    : `Brakuje ${formatPrice(remaining)}`;

  return {
    promotion,
    cartNet: roundMoney(cartNet),
    remaining,
    unlocked,
    progressPercent,
    message,
    shortMessage,
  };
}

/**
 * Wszystkie promocje posortowane po progu rosnąco.
 */
export function evaluateAllPromotions(cartNet: number): PromotionProgress[] {
  return [...CART_PROMOTIONS]
    .sort((a, b) => a.thresholdNet - b.thresholdNet)
    .map((p) => evaluatePromotion(p, cartNet));
}

/**
 * Najbliższa nieosiągnięta promocja (do licznika „brakuje”).
 * Jeśli wszystkie odblokowane — najwyższa osiągnięta.
 */
export function getNextPromotionProgress(
  cartNet: number
): PromotionProgress | null {
  const all = evaluateAllPromotions(cartNet);
  if (all.length === 0) return null;

  const next = all.find((p) => !p.unlocked);
  if (next) return next;

  // Wszystkie zdobyte — pokaż najwyższą
  return all[all.length - 1] ?? null;
}

/** Najwyższa odblokowana promocja (do badge / podsumowania). */
export function getHighestUnlockedPromotion(
  cartNet: number
): PromotionProgress | null {
  const unlocked = evaluateAllPromotions(cartNet).filter((p) => p.unlocked);
  return unlocked[unlocked.length - 1] ?? null;
}
