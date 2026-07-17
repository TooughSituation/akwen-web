/**
 * Pomocniczy skrypt do generowania promptów dla brakujących zdjęć produktów.
 * Użyj wygenerowanych promptów z Grok Imagine, zapisz pliki jako:
 *   public/images/products/{slug}.jpg
 * Następnie uruchom: node scripts/sync-image-manifest.mjs
 *
 * Prompty budowane z Tag1 (scena/opakowanie) + Tag2 (składnik) — spójne z src/lib/b2b/image-prompts.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function slugify(tag1, tag2) {
  return `${tag1}-${tag2}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const KIND_EN = {
  Łosoś: "Atlantic salmon",
  Dorsz: "cod",
  Makrela: "mackerel",
  Śledź: "herring",
  Śledz: "herring",
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
};

const TAG1_SCENES = {
  Pasty: (k) =>
    `close-up of creamy ${k} fish paste spread in a clear glass jar with lid slightly open, rich texture visible`,
  Mrożonki: (k) =>
    `premium frozen ${k} seafood in thick transparent vacuum bag, soft frost crystals, IQF pieces visible, commercial freezer product`,
  "Garmażeria mrożona": (k) =>
    `frozen ready-to-cook ${k} dumplings in commercial freezer packaging with frost accents`,
  "Filety rybne": (k) =>
    `premium frozen ${k} fish fillets, vacuum-sealed on white tray with frost edge`,
  Panierowane: (k) =>
    `golden breaded frozen ${k} fish portions in a retail carton`,
  "Ryba Wędzona": (k) =>
    `artisan cold-smoked ${k} fish slices fanned on a slate board, golden smoke color`,
  "Ryby pieczone": (k) =>
    `oven-roasted ${k} fish product in transparent retail packaging`,
  "Konserwy rybne": (k) =>
    `classic silver metal tin can of ${k} fish preserve, lid partially open, rich oil glisten, top-down 45° view`,
  "Ryba w oleju": (k) =>
    `open tin of ${k} fish fillets in golden oil, glistening pieces`,
  "Ryba w sosie": (k) =>
    `open tin of ${k} fish in rich tomato sauce, Polish preserve style`,
  Śledzie: (k) =>
    `traditional Polish marinated ${k} herring pieces in a clear plastic tub`,
  "Ryba faszerowana": (k) =>
    `sliced stuffed ${k} fish terrine on a ceramic plate`,
  "Owoce morza": (k) =>
    `premium frozen ${k} seafood in professional IQF retail bag packaging`,
  "Paluszki krabowe": () =>
    `orange-white crab sticks surimi in transparent retail packaging`,
  Kawiory: (k) =>
    `luxury small glass jar of ${k} fish roe or caviar, pearls glistening`,
  Sałatki: (k) =>
    `fresh ready-to-eat ${k} seafood salad in a clear plastic deli tub`,
  "Dania rybne": (k) =>
    `ready meal with ${k} fish in commercial food tray packaging`,
  "Farsz rybny": (k) =>
    `finely ground ${k} fish mince in vacuum retail packaging`,
  "Wątrobka rybna": (k) =>
    `canned ${k} fish liver pâté in a small tin or glass jar`,
  Mięsne: (k) =>
    `premium sliced ${k} deli cold cuts fanned in vacuum-sealed retail pack, meat marbling, clear plastic window, Polish cold-cut style`,
  Warzywa: (k) =>
    `vibrant frozen ${k} vegetables in a clear retail freezer bag, natural saturated colors, light frost, IQF pieces`,
  Inne: (k) =>
    `wholesale food product featuring ${k} in clean modern retail packaging`,
};

function buildPrompt(tag1, tag2) {
  const kind = KIND_EN[tag2] ?? (tag2 ? tag2.toLowerCase() : "seafood");
  const sceneBuilder = TAG1_SCENES[tag1];
  const scene = sceneBuilder
    ? sceneBuilder(kind)
    : `Polish wholesale ${tag1 || "seafood"} product featuring ${kind}`;

  const tagHint =
    tag1 || tag2
      ? ` Category tags: ${[tag1, tag2].filter(Boolean).join(" / ")}.`
      : "";

  return [
    `Ultra-realistic professional e-commerce product photography of ${scene}.`,
    tagHint,
    `Composition: single product hero, centered, slight 3/4 camera angle (about 30–40°), product filling ~70% of frame.`,
    `Backdrop: seamless pure white or very light cool-gray infinity cyclorama.`,
    `Lighting: dual large softboxes key+fill, soft contact shadow, gentle rim light, no harsh blowouts.`,
    `Lens look: 85mm commercial food photography, f/5.6–f/8, tack-sharp edges, 8k detail.`,
    `Strictly no text, no brand logos, no nutrition labels, no watermarks, no people, no hands, no clutter.`,
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

const wb = XLSX.readFile(path.join(root, "public/data/produkty.xlsx"));
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
  defval: "",
});
const combos = new Map();
for (const row of rows) {
  const tag1 = String(row.Tag1 || "").trim();
  const tag2 = String(row.Tag2 || "").trim();
  if (!tag1) continue;
  const key = `${tag1}|${tag2}`;
  combos.set(key, (combos.get(key) || 0) + 1);
}

const productsDir = path.join(root, "public/images/products");
const existing = new Set(
  fs.existsSync(productsDir)
    ? fs
        .readdirSync(productsDir)
        .map((f) => f.replace(/\.(jpg|png|webp)$/i, ""))
    : []
);

const limit = Number(process.argv[2] || 20);
const missing = [...combos.entries()]
  .sort((a, b) => b[1] - a[1])
  .filter(([key]) => {
    const [t1, t2] = key.split("|");
    return !existing.has(slugify(t1, t2));
  })
  .slice(0, limit);

const batch = missing.map(([key, count]) => {
  const [tag1, tag2] = key.split("|");
  const slug = slugify(tag1, tag2);
  return { tag1, tag2, slug, count, prompt: buildPrompt(tag1, tag2) };
});

const outPath = path.join(root, "public/data/image-generation-batch.json");
fs.writeFileSync(
  outPath,
  JSON.stringify({ generatedAt: new Date().toISOString(), batch }, null, 2)
);
console.log(`Saved ${batch.length} prompts to ${outPath}`);
batch.forEach((item, i) => {
  console.log(`\n[${i + 1}] ${item.slug} (${item.count} produktów)`);
  console.log(item.prompt);
});
