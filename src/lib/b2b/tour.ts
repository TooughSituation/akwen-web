/**
 * Przewodnik po portalu B2B (product tour).
 *
 * Analogia Access: jak kreator „Pierwsze kroki” po otwarciu bazy —
 * kolejno podświetla menu i wyjaśnia, co robi każdy moduł.
 */

import { tourSeenStorageKey, STORAGE_BASE } from "./storage-keys";

export const TOUR_SEEN_STORAGE_KEY = STORAGE_BASE.tourSeen;

export interface TourStep {
  id: string;
  /** Selektor CSS elementu do podświetlenia, np. [data-tour="nav-katalog"]. */
  target: string;
  title: string;
  description: string;
  /** Opcjonalna ścieżka — tour przejdzie na tę stronę przed fokusem. */
  href?: string;
}

/**
 * Kolejność jak w menu + skróty w headerze.
 * Opisy po polsku, bez żargonu.
 */
export const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    target: '[data-tour="nav-dashboard"]',
    title: "Dashboard",
    description:
      "Strona startowa po zalogowaniu. Zobaczysz tu skróty, statystyki i produkty polecane dla Twojej firmy.",
    href: "/b2b",
  },
  {
    id: "katalog",
    target: '[data-tour="nav-katalog"]',
    title: "Katalog",
    description:
      "Pełna oferta hurtowa z filtrami (kategoria, rodzaj), sortowaniem i wyszukiwaniem. Ceny możesz oglądać z rabatem lub katalogowe.",
    href: "/b2b/katalog",
  },
  {
    id: "ulubione",
    target: '[data-tour="header-favorites"]',
    title: "Ulubione",
    description:
      "Oznaczaj produkty sercem na karcie. Lista ulubionych jest zapisana na Twoim koncie — zakładka „Ulubione” w katalogu albo ten skrót w nagłówku.",
    href: "/b2b/katalog",
  },
  {
    id: "koszyk",
    target: '[data-tour="nav-koszyk"]',
    title: "Koszyk",
    description:
      "Tu składasz zamówienie: ilości, rabat klienta, promocje koszykowe (progi 500 / 800 zł) i finalne podsumowanie przed wysłaniem.",
    href: "/b2b/koszyk",
  },
  {
    id: "zamowienia",
    target: '[data-tour="nav-zamowienia"]',
    title: "Moje zamówienia",
    description:
      "Historia zamówień, statusy, szczegóły, pobranie PDF i ponowne zamówienie tych samych pozycji.",
    href: "/b2b/zamowienia",
  },
  {
    id: "moje-dane",
    target: '[data-tour="nav-moje-dane"]',
    title: "Moje dane",
    description:
      "Dane firmy, adresy dostawy oraz program lojalnościowy — saldo punktów, katalog nagród i wymiany.",
    href: "/b2b/moje-dane",
  },
  {
    id: "lojalnosc",
    target: '[data-tour="header-loyalty"]',
    title: "Lojalność",
    description:
      "Za każde 10 zł netto zamówienia dostajesz 1 punkt. Skrót w nagłówku pokazuje saldo — szczegóły i nagrody znajdziesz w „Moje dane”.",
    href: "/b2b/moje-dane",
  },
  {
    id: "czat",
    target: '[data-tour="header-chat"]',
    title: "Czat z handlowcem",
    description:
      "Napisz do przedstawiciela handlowego Akwen. W wersji demo odpowiedzi są automatyczne (mock) — historia zapisuje się na Twoim koncie.",
  },
];

export function hasSeenTour(userId?: string | null): boolean {
  if (typeof window === "undefined" || !userId) return true;
  try {
    return localStorage.getItem(tourSeenStorageKey(userId)) === "1";
  } catch {
    return true;
  }
}

export function markTourSeen(userId?: string | null): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(tourSeenStorageKey(userId), "1");
  } catch {
    // ignore
  }
}

export function clearTourSeen(userId?: string | null): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.removeItem(tourSeenStorageKey(userId));
  } catch {
    // ignore
  }
}
