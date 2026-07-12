import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const productsDir = path.join(root, "public/images/products");
const manifestPath = path.join(root, "public/data/product-image-manifest.json");

const manifest = {};
if (fs.existsSync(productsDir)) {
  for (const file of fs.readdirSync(productsDir)) {
    if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
    const slug = file.replace(/\.(jpg|jpeg|png|webp)$/i, "");
    manifest[slug] = `/images/products/${file}`;
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Manifest updated: ${Object.keys(manifest).length} images`);