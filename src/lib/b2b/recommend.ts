/**
 * Powody proponowania produktów — brak osobnej kolumny w Excelu,
 * więc wyliczamy z danych magazynowych (marża, stan, świeżość partii).
 */

export type RecommendReasonCode =
  | "high_margin"
  | "fresh_stock"
  | "high_stock"
  | "limited"
  | "sales_pick";

export interface RecommendReason {
  code: RecommendReasonCode;
  /** Krótka etykieta na badge karty, np. „Wysoka marża”. */
  label: string;
  /** Jednozdaniowe wyjaśnienie dla UI. */
  description: string;
}

const REASONS: Record<RecommendReasonCode, Omit<RecommendReason, "code">> = {
  high_margin: {
    label: "Wysoka marża",
    description: "Atrakcyjna relacja ceny hurtowej do wartości magazynowej.",
  },
  fresh_stock: {
    label: "Świeża partia",
    description: "Niedawna dostawa — jednolita, świeża partia towaru.",
  },
  high_stock: {
    label: "Duży stan",
    description: "Wysoka dostępność na magazynie — bezpieczne do zamówienia.",
  },
  limited: {
    label: "Oferta limitowana",
    description: "Ostatnie sztuki w ofercie — warto zarezerwować wcześniej.",
  },
  sales_pick: {
    label: "Wybór handlowca",
    description: "Produkt wyróżniony przez zespół handlowy Akwen.",
  },
};

export interface RecommendSignals {
  /** Cena katalogowa netto. */
  priceNet: number;
  /** Stan dostępny. */
  stock: number;
  /** Wartość magazynowa ogółem (Excel). */
  stockValueTotal?: number;
  /** Ilość ogółem (Excel) — do szacunku kosztu jednostkowego. */
  stockQtyTotal?: number;
  /** Różnica dni między najstarszą a najnowszą dostawą. */
  deliveryDaysSpan?: number;
  isRecommended: boolean;
}

/**
 * Szacunkowa marża: (cena katalogowa − wartość/szt.) / cena.
 * Gdy brak danych wartości → null.
 */
export function estimateMarginPercent(signals: RecommendSignals): number | null {
  const qty = signals.stockQtyTotal ?? 0;
  const value = signals.stockValueTotal ?? 0;
  const price = signals.priceNet;

  if (qty <= 0 || value <= 0 || price <= 0) return null;

  const unitCost = value / qty;
  return ((price - unitCost) / price) * 100;
}

/**
 * Wybiera jeden główny powód proponowania (priorytet biznesowy).
 * Dla produktów nieoznaczonych jako proponowane zwraca null.
 */
export function resolveRecommendReason(
  signals: RecommendSignals
): RecommendReason | null {
  if (!signals.isRecommended) return null;

  const margin = estimateMarginPercent(signals);
  const daysSpan =
    typeof signals.deliveryDaysSpan === "number"
      ? signals.deliveryDaysSpan
      : null;
  const stock = signals.stock;

  if (margin !== null && margin >= 25) {
    return { code: "high_margin", ...REASONS.high_margin };
  }

  if (daysSpan !== null && daysSpan <= 7 && stock > 0) {
    return { code: "fresh_stock", ...REASONS.fresh_stock };
  }

  if (stock >= 150) {
    return { code: "high_stock", ...REASONS.high_stock };
  }

  if (stock > 0 && stock < 20) {
    return { code: "limited", ...REASONS.limited };
  }

  // Fallback: marża „dobra” ale poniżej progu high, albo brak sygnałów
  if (margin !== null && margin >= 18) {
    return { code: "high_margin", ...REASONS.high_margin };
  }

  return { code: "sales_pick", ...REASONS.sales_pick };
}

/** Tekst pomocniczy pod nagłówkiem sekcji Polecane. */
export const RECOMMENDED_SECTION_HINT =
  "Produkty oznaczone jako proponowane w cenniku Akwen — wybór handlowy na podstawie marży, świeżości partii i dostępności magazynowej.";
