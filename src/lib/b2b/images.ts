import fs from "fs";
import path from "path";
import type { ProductCategoryId } from "./types";
import {
  buildImaginePrompt,
  getGeneratedImagePublicPath,
  getTagComboKey,
  getTagComboSlug,
} from "./image-prompts";

export { buildImaginePrompt, getTagComboKey, getTagComboSlug };

const PRODUCTS_DIR = path.join(process.cwd(), "public/images/products");
const MANIFEST_PATH = path.join(
  process.cwd(),
  "public/data/product-image-manifest.json"
);

type ImageManifest = Record<string, string>;

let manifestCache: ImageManifest | null = null;

function loadManifest(): ImageManifest {
  if (manifestCache) return manifestCache;
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      manifestCache = JSON.parse(
        fs.readFileSync(MANIFEST_PATH, "utf-8")
      ) as ImageManifest;
      return manifestCache;
    }
  } catch {
    // ignore corrupt manifest
  }
  manifestCache = {};
  return manifestCache;
}

function fileExistsPublic(publicPath: string): boolean {
  const full = path.join(
    process.cwd(),
    "public",
    publicPath.replace(/^\//, "")
  );
  return fs.existsSync(full);
}

export function getGeneratedImageUrl(tag1: string, tag2: string): string | null {
  if (!tag1) return null;

  const slug = getTagComboSlug(tag1, tag2);
  const key = getTagComboKey(tag1, tag2);
  const manifest = loadManifest();

  if (manifest[slug] && fileExistsPublic(manifest[slug])) {
    return manifest[slug];
  }
  if (manifest[key] && fileExistsPublic(manifest[key])) {
    return manifest[key];
  }

  const defaultPath = getGeneratedImagePublicPath(tag1, tag2);
  if (fileExistsPublic(defaultPath)) {
    return defaultPath;
  }

  return null;
}

export { isGeneratedProductPhoto, isLocalProductPhoto } from "./image-prompts";

/**
 * Lokalne, wysokiej jakości zdjęcia kategorii oferty
 * (preferowane względem zewnętrznych URL).
 */
const CATEGORY_IMAGES: Record<ProductCategoryId, string> = {
  mrozone: "/images/oferta_mrozone.jpg",
  wedzone: "/images/oferta_wedzone.jpg",
  konserwy: "/images/oferta_konserwy.jpg",
  przetwory: "/images/oferta_przetwory.jpg",
  litewskie: "/images/oferta-litewskie.png",
  "owoce-morza": "/images/oferta_mrozone.jpg",
  swieze: "/images/oferta_przetwory.jpg",
  inne: "/images/oferta_przetwory.jpg",
};

/**
 * Wysokiej jakości fallbacki zewnętrzne (Unsplash, duże rozdzielczości)
 * — używane gdy brak lokalnego pliku oferty.
 */
const CATEGORY_HQ_REMOTE: Partial<Record<ProductCategoryId, string>> = {
  "owoce-morza":
    "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200&h=900&fit=crop&q=85&auto=format",
  swieze:
    "https://images.unsplash.com/photo-1544943910-04c54e739fe7?w=1200&h=900&fit=crop&q=85&auto=format",
  inne: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b779?w=1200&h=900&fit=crop&q=85&auto=format",
  mrozone:
    "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=1200&h=900&fit=crop&q=85&auto=format",
  wedzone:
    "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=1200&h=900&fit=crop&q=85&auto=format",
  konserwy:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&h=900&fit=crop&q=85&auto=format",
  przetwory:
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200&h=900&fit=crop&q=85&auto=format",
};

const TAG1_FALLBACK: Record<string, string> = {
  Pasty: CATEGORY_IMAGES.przetwory,
  "Ryba Wędzona": CATEGORY_IMAGES.wedzone,
  Mrożonki: CATEGORY_IMAGES.mrozone,
  "Garmażeria mrożona": CATEGORY_IMAGES.mrozone,
  "Filety rybne": CATEGORY_IMAGES.mrozone,
  Panierowane: CATEGORY_IMAGES.mrozone,
  "Konserwy rybne": CATEGORY_IMAGES.konserwy,
  "Ryba w oleju": CATEGORY_IMAGES.konserwy,
  "Ryba w sosie": CATEGORY_IMAGES.konserwy,
  "Owoce morza": CATEGORY_IMAGES["owoce-morza"],
  "Paluszki krabowe": CATEGORY_IMAGES["owoce-morza"],
  Kawiory: CATEGORY_IMAGES.przetwory,
  Sałatki: CATEGORY_IMAGES.przetwory,
  "Dania rybne": CATEGORY_IMAGES.przetwory,
  Śledzie: CATEGORY_IMAGES.konserwy,
  "Ryby pieczone": CATEGORY_IMAGES.wedzone,
  "Ryba faszerowana": CATEGORY_IMAGES.konserwy,
  "Farsz rybny": CATEGORY_IMAGES.przetwory,
  "Wątrobka rybna": CATEGORY_IMAGES.przetwory,
  Mięsne: CATEGORY_IMAGES.inne,
  Warzywa: CATEGORY_IMAGES.inne,
  Inne: CATEGORY_IMAGES.inne,
};

/**
 * Zwraca łańcuch fallbacków od najlepszego do najgorszego:
 * 1) wygenerowane zdjęcie Tag1+Tag2
 * 2) lokalne zdjęcie oferty wg Tag1 / kategorii
 * 3) HQ remote (Unsplash)
 */
export function getProductImageFallbacks(
  categoryId: ProductCategoryId,
  tag1?: string,
  tag2?: string
): string[] {
  const urls: string[] = [];
  const push = (url: string | null | undefined) => {
    if (url && !urls.includes(url)) urls.push(url);
  };

  if (tag1) {
    push(getGeneratedImageUrl(tag1, tag2 || ""));
  }

  if (tag1 && TAG1_FALLBACK[tag1]) {
    const local = TAG1_FALLBACK[tag1];
    if (fileExistsPublic(local)) push(local);
  }

  const categoryLocal = CATEGORY_IMAGES[categoryId];
  if (categoryLocal && fileExistsPublic(categoryLocal)) {
    push(categoryLocal);
  }

  push(CATEGORY_HQ_REMOTE[categoryId]);
  push(CATEGORY_IMAGES.przetwory);

  return urls;
}

export function getProductImage(
  productId: string,
  categoryId: ProductCategoryId,
  tag1?: string,
  tag2?: string
): string {
  void productId;
  const fallbacks = getProductImageFallbacks(categoryId, tag1, tag2);
  return fallbacks[0] ?? CATEGORY_IMAGES.inne;
}

export function getCategoryImage(categoryId: ProductCategoryId): string {
  const local = CATEGORY_IMAGES[categoryId];
  if (local && fileExistsPublic(local)) return local;
  return CATEGORY_HQ_REMOTE[categoryId] ?? CATEGORY_IMAGES.inne;
}

export function listMissingImageCombos(
  combos: Array<{ tag1: string; tag2: string }>
): Array<{ tag1: string; tag2: string; slug: string; prompt: string }> {
  return combos
    .filter(({ tag1, tag2 }) => !getGeneratedImageUrl(tag1, tag2))
    .map(({ tag1, tag2 }) => ({
      tag1,
      tag2,
      slug: getTagComboSlug(tag1, tag2),
      prompt: buildImaginePrompt(tag1, tag2),
    }));
}

export function ensureProductsImageDir(): void {
  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  }
}
