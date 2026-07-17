export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
  }).format(price);
}

/** Zaokrąglenie do 2 miejsc po przecinku (grosze). */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Cena jednostkowa po rabacie procentowym z profilu klienta.
 * Rabat 0% lub ujemny → zwraca cenę katalogową.
 */
export function applyDiscount(
  priceNet: number,
  discountPercent: number
): number {
  const percent = Number.isFinite(discountPercent) ? discountPercent : 0;
  if (percent <= 0) return roundMoney(priceNet);
  if (percent >= 100) return 0;
  return roundMoney(priceNet * (1 - percent / 100));
}

/** Suma netto pozycji po rabacie (cena rabatowa × ilość). */
export function sumCartNet(
  items: ReadonlyArray<{ priceNet: number; quantity: number }>,
  discountPercent = 0
): number {
  return roundMoney(
    items.reduce(
      (sum, item) =>
        sum + applyDiscount(item.priceNet, discountPercent) * item.quantity,
      0
    )
  );
}

/** Wartość oszczędności z rabatu względem cennika. */
export function sumDiscountSavings(
  items: ReadonlyArray<{ priceNet: number; quantity: number }>,
  discountPercent: number
): number {
  const listTotal = sumCartNet(items, 0);
  const discountedTotal = sumCartNet(items, discountPercent);
  return roundMoney(listTotal - discountedTotal);
}

/** Oszczędność jednostkowa (cena katalogowa − cena po rabacie). */
export function unitDiscountSavings(
  priceNet: number,
  discountPercent: number
): number {
  return roundMoney(
    priceNet - applyDiscount(priceNet, discountPercent)
  );
}

/**
 * Tekst oszczędności na karcie, np. „−5% (−1,23 zł)”.
 */
export function formatDiscountSavingsLabel(
  priceNet: number,
  discountPercent: number
): string | null {
  if (!Number.isFinite(discountPercent) || discountPercent <= 0) return null;
  const savings = unitDiscountSavings(priceNet, discountPercent);
  if (savings <= 0) return null;
  return `−${discountPercent}% (−${formatPrice(savings).replace(/\s/g, "\u00a0")})`;
}