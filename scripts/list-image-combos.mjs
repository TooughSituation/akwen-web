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
    ? fs.readdirSync(productsDir).map((f) => f.replace(/\.(jpg|png|webp)$/, ""))
    : []
);

const sorted = [...combos.entries()].sort((a, b) => b[1] - a[1]);
const missing = sorted.filter(([key]) => {
  const [tag1, tag2] = key.split("|");
  return !existing.has(slugify(tag1, tag2));
});

console.log(JSON.stringify({
  totalCombos: combos.size,
  existingImages: existing.size,
  missing: missing.length,
  topMissing: missing.slice(0, 30).map(([key, count]) => {
    const [tag1, tag2] = key.split("|");
    return { tag1, tag2, count, slug: slugify(tag1, tag2) };
  }),
}, null, 2));