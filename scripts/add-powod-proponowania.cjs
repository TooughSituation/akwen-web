/**
 * Dodaje kolumnę „PowodProponowania” do public/data/produkty.xlsx.
 *
 * Analogia do Excela:
 * 1) Wstawiamy nową kolumnę po „Proponowany”
 * 2) Dla wierszy z Proponowany = „Tak” wstawiamy powód (jak formuła / lista rozwijana)
 * 3) Dla pozostałych wierszy zostawiamy puste
 *
 * Uruchom: node scripts/add-powod-proponowania.cjs
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const filePath = path.join(__dirname, "..", "public", "data", "produkty.xlsx");

function estimateMargin(row) {
  const qty = Number(row["Ilość OGÓŁEM"]) || 0;
  const value = Number(row["Wartość ogółem"]) || 0;
  const price = Number(row["Cena z cennika Cennik bazowy 100 Netto"]) || 0;
  if (qty <= 0 || value <= 0 || price <= 0) return null;
  const unitCost = value / qty;
  return ((price - unitCost) / price) * 100;
}

function isRecommended(value) {
  const n = String(value || "")
    .trim()
    .toLowerCase();
  return n === "tak" || n === "yes" || n === "1";
}

/**
 * Wybór powodu — te same reguły co heurystyka, z etykietami biznesowymi
 * (Wysoka marża, Krótki termin, Bestseller, Oferta limitowana, Wybór handlowca).
 */
function pickReason(row) {
  if (!isRecommended(row.Proponowany)) return "";

  const margin = estimateMargin(row);
  const days = Number(row["Data dostawy Różnica dni"]) || 0;
  const stock = Number(row["Ilość W magazynie Dostępna"]) || 0;

  if (margin !== null && margin >= 25) return "Wysoka marża";
  if (days <= 7 && stock > 0) return "Krótki termin";
  if (stock >= 150) return "Bestseller";
  if (stock > 0 && stock < 20) return "Oferta limitowana";
  if (margin !== null && margin >= 18) return "Wysoka marża";
  return "Wybór handlowca";
}

const wb = XLSX.read(fs.readFileSync(filePath));
const sheetName = wb.SheetNames[0];
const sheet = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const counts = {};
const enriched = rows.map((row) => {
  const reason =
    row.PowodProponowania && String(row.PowodProponowania).trim()
      ? String(row.PowodProponowania).trim()
      : pickReason(row);

  if (reason) counts[reason] = (counts[reason] || 0) + 1;

  // Zachowaj kolejność: Proponowany → PowodProponowania → reszta
  const {
    Proponowany,
    PowodProponowania: _old,
    ...rest
  } = row;

  // Rebuild with Powod right after Proponowany if possible
  const ordered = {};
  for (const [key, value] of Object.entries(row)) {
    if (key === "PowodProponowania") continue;
    ordered[key] = value;
    if (key === "Proponowany") {
      ordered.PowodProponowania = reason;
    }
  }
  if (!("PowodProponowania" in ordered)) {
    ordered.PowodProponowania = reason;
  }
  return ordered;
});

const newSheet = XLSX.utils.json_to_sheet(enriched);
wb.Sheets[sheetName] = newSheet;
XLSX.writeFile(wb, filePath);

const filled = enriched.filter((r) => r.PowodProponowania).length;
console.log(`Zapisano: ${filePath}`);
console.log(`Wierszy z PowodProponowania: ${filled}`);
console.log("Rozkład powodów:", counts);
