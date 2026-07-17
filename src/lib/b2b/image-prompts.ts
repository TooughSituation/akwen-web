import { formatCategoryLabel } from "./labels";

/**
 * Sceny produktowe per Tag1 — konkretny typ opakowania/serwowania,
 * z wstawionym angielskim odpowiednikiem Tag2 (kind).
 */
const TAG1_SCENES: Record<string, (kind: string) => string> = {
  Pasty: (k) =>
    `close-up of creamy ${k} fish paste spread in a clear glass jar with lid slightly open, rich texture visible`,
  Mrożonki: (k) =>
    `frozen ${k} seafood blocks in professional vacuum retail packaging with light frost crystals`,
  "Garmażeria mrożona": (k) =>
    `frozen ready-to-cook ${k} dumplings or garmazeria dish in branded commercial freezer packaging`,
  "Filety rybne": (k) =>
    `premium frozen ${k} fish fillets, skinless portions, vacuum-sealed on white tray`,
  Panierowane: (k) =>
    `golden breaded frozen ${k} fish portions in a retail carton, crispy coating visible`,
  "Ryba Wędzona": (k) =>
    `artisan cold-smoked ${k} fish slices fanned on a slate board, golden smoke color`,
  "Ryby pieczone": (k) =>
    `oven-roasted ${k} fish product in transparent retail packaging, appetizing glaze`,
  "Konserwy rybne": (k) =>
    `classic metal tin can of ${k} fish preserve, lid open showing packed fish inside`,
  "Ryba w oleju": (k) =>
    `open tin of ${k} fish fillets in golden oil, glistening pieces, European delicatessen style`,
  "Ryba w sosie": (k) =>
    `open tin of ${k} fish in rich tomato sauce, saucy and appetizing Polish preserve style`,
  Śledzie: (k) =>
    `traditional Polish marinated ${k} herring pieces in a clear plastic tub or glass jar`,
  "Ryba faszerowana": (k) =>
    `sliced stuffed ${k} fish terrine on a ceramic plate, festive Polish style`,
  "Owoce morza": (k) =>
    `premium frozen ${k} seafood in professional IQF retail bag packaging`,
  "Paluszki krabowe": () =>
    `orange-white crab sticks surimi sticks in transparent retail packaging, clean cut ends`,
  Kawiory: (k) =>
    `luxury small glass jar of ${k} fish roe or caviar, pearls glistening under soft light`,
  Sałatki: (k) =>
    `fresh ready-to-eat ${k} seafood salad in a clear plastic deli tub, colorful ingredients`,
  "Dania rybne": (k) =>
    `ready meal with ${k} fish in commercial food tray packaging, microwave-ready style`,
  "Farsz rybny": (k) =>
    `finely ground ${k} fish mince (farsz) in vacuum retail packaging`,
  "Wątrobka rybna": (k) =>
    `canned ${k} fish liver pâté in a small tin or glass jar, gourmet style`,
  Mięsne: (k) =>
    `sliced ${k} deli meat product in vacuum retail packaging, cold cuts style`,
  Warzywa: (k) =>
    `frozen ${k} vegetables in a clear retail freezer bag, vibrant natural colors`,
  Inne: (k) =>
    `wholesale food product featuring ${k} in clean modern retail packaging`,
};

/** Pełne mapowanie Tag2 → angielski opis do promptów Imagine. */
const KIND_EN: Record<string, string> = {
  Łosoś: "Atlantic salmon",
  Dorsz: "cod",
  Makrela: "mackerel",
  Śledź: "herring",
  "Śledz": "herring",
  Tuńczyk: "tuna",
  Krewetki: "shrimp",
  Kawior: "caviar roe",
  Paprykarz: "paprika fish spread",
  Miruna: "hoki blue whiting",
  Mintaj: "Alaska pollock",
  Pstrąg: "trout",
  Halibut: "halibut",
  Karp: "carp",
  Sandacz: "zander pike-perch",
  Kalmar: "squid",
  Kałamarnica: "squid calamari",
  Krab: "crab",
  Anchois: "anchovy",
  Sardynki: "sardines",
  Szprot: "sprat",
  Szprota: "sprat",
  Surimi: "surimi",
  Jesiotr: "sturgeon",
  Zębacz: "wolffish",
  Srebrzyk: "silver smelt",
  Tilapia: "tilapia",
  Panga: "pangasius",
  Morszczuk: "hake",
  Nototenia: "notothenia",
  Błękitek: "blue whiting",
  Karmazyn: "redfish",
  Limanda: "yellowfin sole",
  Miętus: "burbot",
  Okoń: "perch",
  Pałasz: "escolar oilfish",
  Sajra: "saury",
  Trewal: "butterfish",
  Byczki: "goby fish",
  Szczupak: "pike",
  "Mix ryb": "mixed fish",
  "Paluszki rybne": "fish sticks",
  Burgery: "fish burgers",
  Awokado: "avocado",
  Brzoskwinia: "peach",
  Grzyby: "mushrooms",
  Jajeczne: "egg",
  Pomidory: "tomato",
  Zioła: "herbs",
  Tzatziki: "tzatziki",
  Ciecierzyca: "chickpea",
  Fasola: "beans",
  Groszek: "peas",
  Kapusta: "cabbage",
  Kukurudza: "corn",
  "Mix warzyw": "mixed vegetables",
  Brukselka: "Brussels sprouts",
  "Fasolka szparagowa": "green beans",
  Kalafior: "cauliflower",
  Marchew: "carrot",
  Szpinak: "spinach",
  Oliwki: "olives",
  Papryczki: "peppers",
  Kurczak: "chicken",
  Indyk: "turkey",
  Wieprzowina: "pork",
  Wołowina: "beef",
  Pierogi: "pierogi dumplings",
  Pyzy: "potato dumplings",
  Kopytka: "potato gnocchi",
  Kluski: "noodles",
  Kartacze: "potato kartacze dumplings",
  Chinkali: "khinkali dumplings",
  Olej: "cooking oil",
  Oliwa: "olive oil",
  Ryż: "rice",
  Zupy: "soup base",
  Sa: "fish",
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

/**
 * Prompt pod Grok Imagine — zbudowany z Tag1 (scena/opakowanie) + Tag2 (składnik).
 * Struktura: subject → material/kind → composition → lighting → quality → negatives.
 */
export function buildImaginePrompt(
  tag1: string,
  tag2: string,
  productName?: string
): string {
  const kind = normalizeKind(tag2);
  const sceneBuilder = TAG1_SCENES[tag1];
  const category = formatCategoryLabel(tag1);
  const kindLabel = tag2 ? tag2 : "produkt spożywczy";

  const scene = sceneBuilder
    ? sceneBuilder(kind)
    : `${category} wholesale product featuring ${kind}, Polish B2B seafood catalog style`;

  const nameHint = productName
    ? ` Product reference name: "${productName.slice(0, 70)}".`
    : "";

  const tagHint =
    tag1 || tag2
      ? ` Category tags: ${[tag1, tag2].filter(Boolean).join(" / ")} (${kindLabel}).`
      : "";

  return [
    `Ultra-realistic professional e-commerce product photo of ${scene}.`,
    nameHint,
    tagHint,
    `Hero product shot, centered 3/4 angle, clean seamless white or very light gray studio backdrop,`,
    `soft dual softbox lighting, subtle natural shadow under product, shallow depth of field,`,
    `tack-sharp focus on product, appetizing commercial food styling, high dynamic range,`,
    `shot on 85mm lens look, 8k detail, suitable for wholesale grocery catalog thumbnail.`,
    `Strictly no text, no brand logos, no nutrition labels, no watermarks, no people, no hands, no clutter.`,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getGeneratedImagePublicPath(tag1: string, tag2: string): string {
  return `/images/products/${getTagComboSlug(tag1, tag2)}.jpg`;
}

export function isGeneratedProductPhoto(imageUrl: string): boolean {
  return imageUrl.startsWith("/images/products/");
}

/** Czy URL to lokalne zdjęcie w public/ (wygenerowane lub oferta). */
export function isLocalProductPhoto(imageUrl: string): boolean {
  return (
    imageUrl.startsWith("/images/products/") ||
    imageUrl.startsWith("/images/oferta") ||
    imageUrl.startsWith("/images/oferta-")
  );
}
