import fs from "fs";
import XLSX from "xlsx";

function slugify(tag1, tag2) {
  return `${tag1}-${tag2}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const wb = XLSX.readFile("public/data/produkty.xlsx");
const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
const existing = new Set(
  fs.readdirSync("public/images/products").map((f) => f.replace(/\.jpg$/i, ""))
);

let covered = 0;
for (const row of rows) {
  const tag1 = String(row.Tag1 || "").trim();
  const tag2 = String(row.Tag2 || "").trim();
  if (existing.has(slugify(tag1, tag2))) covered++;
}

console.log(`Images: ${existing.size}`);
console.log(`Products covered: ${covered} / ${rows.length} (${Math.round((covered / rows.length) * 100)}%)`);