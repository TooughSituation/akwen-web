import { formatCategoryLabel } from "./labels";

const TAG1_SCENES: Record<string, (kind: string) => string> = {
  Pasty: (k) =>
    `appetizing fish paste with ${k} in a glass jar, creamy texture visible through glass`,
  Mrożonki: (k) =>
    `frozen ${k} seafood product in professional retail packaging with visible frost`,
  "Garmażeria mrożona": (k) =>
    `frozen ready-made ${k} fish dish in commercial food packaging`,
  "Filety rybne": (k) =>
    `frozen ${k} fish fillets in vacuum-sealed retail packaging`,
  Panierowane: (k) =>
    `breaded frozen ${k} fish product in a box, golden coating visible`,
  "Ryba Wędzona": (k) =>
    `premium smoked ${k} fish, sliced and arranged appetizingly`,
  "Ryby pieczone": (k) =>
    `oven-baked ${k} fish product in retail packaging`,
  "Konserwy rybne": (k) =>
    `canned ${k} fish in a metal tin can, classic Polish seafood preserve`,
  "Ryba w oleju": (k) =>
    `canned ${k} fish in oil inside a tin can, glistening and appetizing`,
  "Ryba w sosie": (k) =>
    `canned ${k} fish in tomato sauce in a tin can`,
  Śledzie: (k) =>
    `marinated herring ${k} product in a jar or tub, traditional Polish style`,
  "Ryba faszerowana": (k) =>
    `stuffed ${k} fish product in elegant food packaging`,
  "Owoce morza": (k) =>
    `frozen ${k} seafood in professional retail packaging`,
  "Paluszki krabowe": () =>
    `crab sticks surimi product in transparent packaging`,
  Kawiory: (k) =>
    `premium ${k} caviar or roe in a small glass jar`,
  Sałatki: (k) =>
    `ready-to-eat ${k} fish salad in a plastic tub, fresh and colorful`,
  "Dania rybne": (k) =>
    `ready-made ${k} fish meal in commercial food packaging`,
  "Farsz rybny": (k) =>
    `fish mince or ground ${k} product in retail packaging`,
  "Wątrobka rybna": (k) =>
    `fish liver ${k} product in a tin or jar`,
  Mięsne: (k) =>
    `meat product with ${k} flavoring in retail packaging`,
  Warzywa: (k) =>
    `frozen vegetable product with ${k} in retail bag packaging`,
  Inne: (k) =>
    `Polish food product featuring ${k} in clean retail packaging`,
};

const KIND_EN: Record<string, string> = {
  Łosoś: "salmon",
  Dorsz: "cod",
  Makrela: "mackerel",
  Śledź: "herring",
  Tuńczyk: "tuna",
  Krewetki: "shrimp",
  Kawior: "caviar",
  Paprykarz: "fish spread",
  Miruna: "blue whiting",
  Mintaj: "pollock",
  Pstrąg: "trout",
  Halibut: "halibut",
  Karp: "carp",
  Sandacz: "pike-perch",
  Kalmar: "squid",
  Kałamarnica: "squid",
  Krab: "crab",
  Anchois: "anchovy",
  Sardynka: "sardine",
  Szprota: "sprat",
};

function normalizeKind(tag2: string): string {
  if (!tag2) return "seafood";
  return KIND_EN[tag2] ?? tag2.toLowerCase();
}

export function getTagComboKey(tag1: string, tag2: string): string {
  return `${tag1}|${tag2}`;
}

export function getTagComboSlug(tag1: string, tag2: string): string {
  const raw = `${tag1}-${tag2}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return raw || "produkt";
}

export function buildImaginePrompt(
  tag1: string,
  tag2: string,
  productName?: string
): string {
  const kind = normalizeKind(tag2);
  const sceneBuilder = TAG1_SCENES[tag1];
  const category = formatCategoryLabel(tag1);

  const scene = sceneBuilder
    ? sceneBuilder(kind)
    : `${category} product with ${kind}, Polish wholesale seafood`;

  const nameHint = productName
    ? ` Inspired by wholesale product "${productName.slice(0, 60)}".`
    : "";

  return (
    `Professional e-commerce product photography of ${scene}.${nameHint} ` +
    `Centered composition on a clean bright white studio background, soft diffused lighting, ` +
    `sharp focus, appetizing commercial food styling, single product hero shot, ` +
    `no text, no labels, no watermark, no people. High-end online grocery store quality.`
  );
}

export function getGeneratedImagePublicPath(tag1: string, tag2: string): string {
  return `/images/products/${getTagComboSlug(tag1, tag2)}.jpg`;
}

export function isGeneratedProductPhoto(imageUrl: string): boolean {
  return imageUrl.startsWith("/images/products/");
}