import type { ProductCategory, ProductCategoryId } from "./types";

export const CATEGORY_RULES: Array<{
  id: ProductCategoryId;
  label: string;
  keywords: string[];
}> = [
  {
    id: "litewskie",
    label: "Produkty litewskie",
    keywords: ["krakus", "a-golonkowa", "a-gulasz", "a-pasztet", "bmc-", "abba ", "chrupišca", "lisn"],
  },
  {
    id: "mrozone",
    label: "Ryby mrożone",
    keywords: [
      "mroż",
      "mroz",
      "frozen",
      "frosta",
      "mr.",
      "2x10kg",
      "10kg",
      "5kg",
      "blok",
      "iqf",
      "fil.z/s",
      "fil z/s",
      "unionsur",
      "fao",
      "gf-",
    ],
  },
  {
    id: "wedzone",
    label: "Ryby wędzone",
    keywords: [
      "wędz",
      "wedz",
      "wędzone",
      "wedzone",
      "wędzon",
      "łosoś wędz",
      "losos wedz",
      "pstrąg wędz",
      "makrela wędz",
      "węgier",
      "wedgier",
      "w tłuszczu własnym",
      "w tluszczu wlasnym",
      "wštróbka",
      "wstrobka",
    ],
  },
  {
    id: "konserwy",
    label: "Konserwy",
    keywords: [
      "konserw",
      "puszk",
      "w oleju",
      "w sosie",
      "w occie",
      "w zalewie",
      "anchovis",
      "sardyn",
      "śledź w",
      "sledz w",
      "tuńczyk w",
      "tunczyk w",
      "makrela w",
      "w pomidor",
      "w s.",
      "w s ",
      "paprykarz",
      "byczki w",
      "ko-fil.",
      "fil.śl",
      "fil.sl",
    ],
  },
  {
    id: "przetwory",
    label: "Przetwory rybne",
    keywords: [
      "pasta",
      "pasztet ryb",
      "salat",
      "sałat",
      "śledzik",
      "sledzik",
      "kawior",
      "ikra",
      "tatar",
      "terrines",
      "rybny",
      "pulpety",
      "burgery rybne",
      "surimi",
      "paluszki ryb",
      "fil.zapiekany",
    ],
  },
  {
    id: "owoce-morza",
    label: "Owoce morza",
    keywords: [
      "krewet",
      "kalmar",
      "ośmiorn",
      "osmiorn",
      "małż",
      "malz",
      "mussel",
      "krab",
      "homar",
      "langust",
      "scampi",
      "mątw",
      "matw",
      "ośmiornica",
    ],
  },
  {
    id: "swieze",
    label: "Ryby świeże",
    keywords: ["śwież", "swiez", "filet św", "filet sw", " luz "],
  },
  {
    id: "inne",
    label: "Inne produkty",
    keywords: [],
  },
];

const FISH_SPECIES = [
  "dorsz",
  "łosoś",
  "losos",
  "pstrąg",
  "pstrag",
  "makrela",
  "śledź",
  "sledz",
  "szprota",
  "mintaj",
  "mintaja",
  "tilapia",
  "pangas",
  "karp",
  "sum",
  "sandacz",
  "okoń",
  "okon",
  "flądra",
  "fladra",
  "morszczuk",
  "halibut",
  "tuńczyk",
  "tunczyk",
  "błękitek",
  "blekitik",
];

export function categorizeProduct(name: string): ProductCategory {
  const lower = name.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.id === "inne") continue;
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return { id: rule.id, label: rule.label };
    }
  }

  if (FISH_SPECIES.some((species) => lower.includes(species))) {
    const frozen = CATEGORY_RULES.find((r) => r.id === "mrozone")!;
    return { id: frozen.id, label: frozen.label };
  }

  const fallback = CATEGORY_RULES.find((r) => r.id === "inne")!;
  return { id: fallback.id, label: fallback.label };
}

export function getCategoryList(): ProductCategory[] {
  return CATEGORY_RULES.map(({ id, label }) => ({ id, label }));
}