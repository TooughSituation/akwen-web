/**
 * Pomocniczy skrypt do generowania promptów dla brakujących zdjęć produktów.
 * Użyj wygenerowanych promptów z Grok Imagine, zapisz pliki jako:
 *   public/images/products/{slug}.jpg
 * Następnie uruchom: node scripts/sync-image-manifest.mjs
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
  Łosoś: "salmon", Dorsz: "cod", Makrela: "mackerel", Śledź: "herring",
  Tuńczyk: "tuna", Krewetki: "shrimp", Paprykarz: "fish spread",
  Miruna: "blue whiting", Mintaj: "pollock", Szprot: "sprat",
};

const TAG1_SCENES = {
  Pasty: (k) => `appetizing fish paste with ${k} in a glass jar`,
  Mrożonki: (k) => `frozen ${k} product in professional retail packaging`,
  "Filety rybne": (k) => `frozen ${k} fish fillets in vacuum-sealed packaging`,
  "Konserwy rybne": (k) => `canned ${k} fish in a metal tin can`,
  "Ryba w oleju": (k) => `canned ${k} fish in oil in a tin can`,
  "Ryba w sosie": (k) => `canned ${k} fish in sauce in a tin can`,
  Śledzie: (k) => `marinated herring ${k} in a jar`,
  "Ryba Wędzona": (k) => `premium smoked ${k} fish, sliced appetizingly`,
  Sałatki: (k) => `ready-to-eat ${k} fish salad in a plastic tub`,
  "Owoce morza": (k) => `frozen ${k} seafood in retail packaging`,
  Panierowane: (k) => `breaded frozen ${k} fish in a box`,
  Warzywa: (k) => `frozen vegetable product in retail bag`,
};

function buildPrompt(tag1, tag2) {
  const kind = KIND_EN[tag2] ?? tag2.toLowerCase();
  const scene = (TAG1_SCENES[tag1] ?? ((k) => `Polish ${tag1} product with ${k}`))(kind);
  return (
    `Professional e-commerce product photography of ${scene}. ` +
    `Centered on clean bright white studio background, soft lighting, sharp focus, ` +
    `appetizing commercial styling, no text, no watermark, no people.`
  );
}

const wb = XLSX.readFile(path.join(root, "public/data/produkty.xlsx"));
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
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
    ? fs.readdirSync(productsDir).map((f) => f.replace(/\.(jpg|png|webp)$/i, ""))
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
fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), batch }, null, 2));
console.log(`Saved ${batch.length} prompts to ${outPath}`);
batch.forEach((item, i) => {
  console.log(`\n[${i + 1}] ${item.slug} (${item.count} produktów)`);
  console.log(item.prompt);
});