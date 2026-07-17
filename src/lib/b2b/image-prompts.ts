import { formatCategoryLabel } from "./labels";

/**
 * Sceny produktowe per Tag1 — konkretny typ opakowania/serwowania,
 * z wstawionym angielskim odpowiednikiem Tag2 (kind).
 */
const TAG1_SCENES: Record<string, (kind: string) => string> = {
  Pasty: (k) =>
    `close-up of creamy ${k} fish paste spread in a clear glass jar with lid slightly open, rich texture visible`,
  Mrożonki: (k) =>
    `premium frozen ${k} seafood in thick transparent vacuum bag, soft frost crystals on surface, ice-cold look, IQF pieces visible through plastic, commercial freezer aisle product, slight condensation highlights`,
  "Garmażeria mrożona": (k) =>
    `frozen ready-to-cook ${k} dumplings or garmazeria dish in branded commercial freezer packaging, frost accents, appetizing window on the pack`,
  "Filety rybne": (k) =>
    `premium frozen ${k} fish fillets, skinless portions, vacuum-sealed on white tray with frost edge`,
  Panierowane: (k) =>
    `golden breaded frozen ${k} fish portions in a retail carton, crispy coating visible through window`,
  "Ryba Wędzona": (k) =>
    `artisan cold-smoked ${k} fish slices fanned on a slate board, golden smoke color, glossy oil sheen`,
  "Ryby pieczone": (k) =>
    `oven-roasted ${k} fish product in transparent retail packaging, appetizing glaze`,
  "Konserwy rybne": (k) =>
    `classic silver metal tin can of ${k} fish preserve, lid partially open revealing packed fish, rich oil or sauce glisten, European delicatessen can, micro scratches on metal for realism, top-down 45° view`,
  "Ryba w oleju": (k) =>
    `open tin of ${k} fish fillets in golden oil, glistening pieces, European delicatessen style, soft reflections on oil surface`,
  "Ryba w sosie": (k) =>
    `open tin of ${k} fish in rich tomato sauce, saucy and appetizing Polish preserve style, sauce texture clearly visible`,
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
    `premium sliced ${k} deli cold cuts fanned in vacuum-sealed retail pack, pink-to-brown meat marbling, thin even slices, clear plastic window, Polish cold-cut style, appetizing but clean industrial packaging`,
  Warzywa: (k) =>
    `vibrant frozen ${k} vegetables in a clear retail freezer bag, natural saturated colors, light frost on pieces, no ice clumps, healthy frozen produce look, bright studio color accuracy`,
  Inne: (k) =>
    `wholesale food product featuring ${k} in clean modern retail packaging`,
};

/** Dodatkowe wskazówki e-commerce per trudniejszą kategorię Tag1. */
const TAG1_PHOTO_EXTRAS: Record<string, string> = {
  Mięsne:
    "Cool deli counter lighting, slight specular highlights on meat fat, avoid raw blood look, keep packaging honest and appetizing for wholesale catalog.",
  Warzywa:
    "True-to-life vegetable colors under daylight-balanced softboxes (5600K feel), avoid plastic sheen overpowering produce, emphasize freshness of frozen IQF pieces.",
  Mrożonki:
    "Cold blue-white key light mixed with warm fill, visible frost without snow-storm, emphasize frozen texture and packaging transparency.",
  "Konserwy rybne":
    "Harder rim light on metal tin edges, soft fill inside the can, show food texture clearly, avoid unreadable labels, pure product hero.",
  "Ryba w oleju":
    "Catch light on oil surface, warm golden tones, open tin hero shot.",
  "Ryba w sosie":
    "Rich red sauce color accuracy, open tin three-quarter angle.",
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
 *
 * Struktura (jak kolumny w Excelu: Kategoria | Rodzaj | Scena | Światło | Jakość):
 * subject → material/kind → composition → lighting → quality → negatives.
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
  const photoExtra = TAG1_PHOTO_EXTRAS[tag1] ?? "";

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
    `Ultra-realistic professional e-commerce product photography of ${scene}.`,
    nameHint,
    tagHint,
    photoExtra,
    `Composition: single product hero, centered, slight 3/4 camera angle (about 30–40°), product filling ~70% of frame, generous negative space.`,
    `Backdrop: seamless pure white or very light cool-gray infinity cyclorama, no props table clutter.`,
    `Lighting: dual large softboxes key+fill, soft contact shadow under product, gentle rim light to separate edges, no harsh specular blowouts.`,
    `Lens look: 85mm commercial food photography, f/5.6–f/8 depth of field, tack-sharp product edges, subtle background falloff.`,
    `Quality: high dynamic range, accurate color, 8k detail, appetizing commercial styling suitable for wholesale grocery catalog thumbnail.`,
    `Strictly no text, no brand logos, no nutrition labels, no barcodes, no watermarks, no people, no hands, no clutter, no fake store shelves.`,
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
