/**
 * Powody proponowania produktów.
 *
 * Źródło preferowane: kolumna Excel „PowodProponowania”
 * (jak ręczna lista rozwijana przy wierszu z Proponowany = Tak).
 *
 * Fallback: heurystyka z danych magazynowych (marża, stan, świeżość),
 * gdy komórka w Excelu jest pusta.
 */

export type RecommendReasonCode =
  | "high_margin"
  | "short_term"
  | "bestseller"
  | "limited"
  | "sales_pick"
  | "fresh_stock"
  | "high_stock"
  | "custom";

export interface RecommendReason {
  code: RecommendReasonCode;
  /** Krótka etykieta na badge karty, np. „Wysoka marża”. */
  label: string;
  /** Jednozdaniowe wyjaśnienie dla UI. */
  description: string;
}

const REASONS: Record<
  Exclude<RecommendReasonCode, "custom">,
  Omit<RecommendReason, "code">
> = {
  high_margin: {
    label: "Wysoka marża",
    description: "Atrakcyjna relacja ceny hurtowej do wartości magazynowej.",
  },
  short_term: {
    label: "Krótki termin",
    description: "Produkt z krótkim horyzontem rotacji — warto zamówić wcześniej.",
  },
  bestseller: {
    label: "Bestseller",
    description: "Często zamawiany asortyment z wysoką dostępnością magazynową.",
  },
  limited: {
    label: "Oferta limitowana",
    description: "Ostatnie sztuki w ofercie — warto zarezerwować wcześniej.",
  },
  sales_pick: {
    label: "Wybór handlowca",
    description: "Produkt wyróżniony przez zespół handlowy Akwen.",
  },
  fresh_stock: {
    label: "Świeża partia",
    description: "Niedawna dostawa — jednolita, świeża partia towaru.",
  },
  high_stock: {
    label: "Duży stan",
    description: "Wysoka dostępność na magazynie — bezpieczne do zamówienia.",
  },
};

/** Mapowanie etykiet z Excela (różne warianty pisowni) → kod. */
const LABEL_TO_CODE: Record<string, Exclude<RecommendReasonCode, "custom">> = {
  "wysoka marża": "high_margin",
  "wysoka marza": "high_margin",
  "krótki termin": "short_term",
  "krotki termin": "short_term",
  bestseller: "bestseller",
  "oferta limitowana": "limited",
  "wybór handlowca": "sales_pick",
  "wybor handlowca": "sales_pick",
  "świeża partia": "fresh_stock",
  "swieza partia": "fresh_stock",
  "duży stan": "high_stock",
  "duzy stan": "high_stock",
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
  /**
   * Wartość z kolumny Excel „PowodProponowania”.
   * Pusta → używamy heurystyki.
   */
  excelReason?: string | null;
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
 * Mapuje tekst z Excel / UI na strukturę powodu.
 * Np. „Wysoka marża” → { code, label, description }.
 */
export function reasonFromExcelLabel(
  raw: string | null | undefined
): RecommendReason | null {
  const label = String(raw || "").trim();
  if (!label) return null;

  const key = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l");

  // dopasowanie po znormalizowanym kluczu
  const normalizedLookup: Record<string, Exclude<RecommendReasonCode, "custom">> =
    {};
  for (const [k, code] of Object.entries(LABEL_TO_CODE)) {
    const nk = k
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l");
    normalizedLookup[nk] = code;
  }

  const code = normalizedLookup[key] ?? LABEL_TO_CODE[label.toLowerCase()];
  if (code) {
    return { code, ...REASONS[code] };
  }

  // Dowolny tekst z Excela — pokazujemy jak jest (jak własna etykieta w komórce)
  return {
    code: "custom",
    label,
    description: `Powód z cennika: ${label}.`,
  };
}

/**
 * Heurystyka gdy kolumna Excel jest pusta.
 */
function resolveHeuristicReason(
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
    return { code: "short_term", ...REASONS.short_term };
  }

  if (stock >= 150) {
    return { code: "bestseller", ...REASONS.bestseller };
  }

  if (stock > 0 && stock < 20) {
    return { code: "limited", ...REASONS.limited };
  }

  if (margin !== null && margin >= 18) {
    return { code: "high_margin", ...REASONS.high_margin };
  }

  return { code: "sales_pick", ...REASONS.sales_pick };
}

/**
 * Wybiera powód proponowania:
 * 1) kolumna Excel „PowodProponowania” (priorytet — jak ręczna wartość w arkuszu)
 * 2) heurystyka z danych magazynowych
 * 3) null jeśli produkt nie jest proponowany i brak powodu w Excelu
 */
export function resolveRecommendReason(
  signals: RecommendSignals
): RecommendReason | null {
  const fromExcel = reasonFromExcelLabel(signals.excelReason);
  if (fromExcel) {
    // Powód z Excela ma pierwszeństwo nawet gdy Proponowany ≠ Tak
    // (handlowiec mógł wypełnić tylko powód)
    return fromExcel;
  }

  return resolveHeuristicReason(signals);
}

/** Tekst pomocniczy pod nagłówkiem sekcji Polecane. */
export const RECOMMENDED_SECTION_HINT =
  "Produkty oznaczone jako proponowane w cenniku Akwen — powód z kolumny „PowodProponowania” (np. Wysoka marża, Krótki termin, Bestseller).";
