const XLSX = require("xlsx");

const wb = XLSX.readFile("public/data/produkty.xlsx");
const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });

const CATEGORY_RULES = [
  { id: "litewskie", label: "Produkty litewskie", keywords: ["krakus", "a-golonkowa", "a-gulasz", "a-pasztet", "bmc-", "abba "] },
  { id: "mrozone", label: "Ryby mrożone", keywords: ["mroż", "mroz", "frozen", "frosta", "mr.", "2x10kg", "10kg", "5kg", "blok", "iqf", "fil.z/s", "fil z/s", "unionsur", "fao"] },
  { id: "wedzone", label: "Ryby wędzone", keywords: ["wędz", "wedz", "wędzone", "wedzone", "wędzon", "łosoś wędz", "losos wedz", "pstrąg wędz", "makrela wędz", "wędzone", "węgier", "wedgier", "w tłuszczu własnym", "w tluszczu wlasnym", "wštróbka", "wstrobka"] },
  { id: "konserwy", label: "Konserwy", keywords: ["konserw", "puszk", "w oleju", "w sosie", "w occie", "w zalewie", "anchovis", "sardyn", "śledź w", "sledz w", "tuńczyk w", "tunczyk w", "makrela w", "w pomidor", "w s.", "w s ", "paprykarz", "byczki w"] },
  { id: "przetwory", label: "Przetwory rybne", keywords: ["pasta", "pasztet ryb", "salat", "sałat", "śledzik", "sledzik", "kawior", "ikra", "tatar", "terrines", "rybny", "pulpety", "burgery rybne", "surimi", "paluszki ryb"] },
  { id: "owoce-morza", label: "Owoce morza", keywords: ["krewet", "kalmar", "ośmiorn", "osmiorn", "małż", "malz", "mussel", "krab", "homar", "langust", "scampi", "mątw", "matw", "ośmiornica"] },
  { id: "swieze", label: "Ryby świeże", keywords: ["śwież", "swiez", "filet św", "filet sw", " luz "] },
  { id: "inne", label: "Inne produkty", keywords: [] },
];

function categorize(name) {
  const lower = name.toLowerCase();
  for (const rule of CATEGORY_RULES) {
    if (rule.id === "inne") continue;
    if (rule.keywords.some((kw) => lower.includes(kw))) return rule;
  }
  // Fish species fallback -> mrozone if looks like bulk fish
  const fishSpecies = ["dorsz", "łosoś", "losos", "pstrąg", "pstrag", "makrela", "śledź", "sledz", "szprota", "mintaj", "mintaja", "tilapia", "pangas", "karp", "sum", "sandacz", "okoń", "okon", "flądra", "fladra", "morszczuk", "halibut", "tuńczyk", "tunczyk", "błękitek", "blekitik"];
  if (fishSpecies.some((f) => lower.includes(f))) {
    return CATEGORY_RULES.find((r) => r.id === "mrozone");
  }
  return CATEGORY_RULES.find((r) => r.id === "inne");
}

const counts = {};
data.forEach((row) => {
  const cat = categorize(row.Nazwa || "");
  counts[cat.label] = (counts[cat.label] || 0) + 1;
});

console.log("Category distribution:");
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => console.log(`  ${k}: ${v}`));

console.log("\nSample 'Inne':");
data
  .filter((r) => categorize(r.Nazwa).id === "inne")
  .slice(0, 20)
  .forEach((r) => console.log(" -", r.Nazwa));