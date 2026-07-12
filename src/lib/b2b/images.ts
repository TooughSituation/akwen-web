import type { ProductCategoryId } from "./types";

const CATEGORY_IMAGES: Record<ProductCategoryId, string> = {
  mrozone: "/images/oferta_mrozone.jpg",
  wedzone: "/images/oferta_wedzone.jpg",
  konserwy: "/images/oferta_konserwy.jpg",
  przetwory: "/images/oferta_przetwory.jpg",
  litewskie: "/images/oferta-litewskie.png",
  "owoce-morza":
    "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
  swieze:
    "https://images.unsplash.com/photo-1544943910-04c54e739fe7?w=400&h=300&fit=crop",
  inne:
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b779?w=400&h=300&fit=crop",
};

const TAG1_IMAGES: Record<string, string> = {
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

const TAG2_IMAGES: Record<string, string> = {
  Łosoś: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b779?w=400&h=300&fit=crop",
  Dorsz: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
  Makrela: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&h=300&fit=crop",
  Śledź: "https://images.unsplash.com/photo-1606853818589-9d1946bdcb7d?w=400&h=300&fit=crop",
  Krewetki: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
  Kawior: "https://images.unsplash.com/photo-1544943910-04c54e739fe7?w=400&h=300&fit=crop",
  Tuńczyk: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
};

const PRODUCT_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b779?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1544943910-04c54e739fe7?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1606853818589-9d1946bdcb7d?w=400&h=300&fit=crop",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getProductImage(
  productId: string,
  categoryId: ProductCategoryId,
  tag1?: string,
  tag2?: string
): string {
  if (tag2 && TAG2_IMAGES[tag2]) {
    const useVariation = hashString(productId) % 4 !== 0;
    if (useVariation) return TAG2_IMAGES[tag2];
  }

  if (tag1 && TAG1_IMAGES[tag1]) {
    const useVariation = hashString(productId) % 3 === 0;
    if (!useVariation) return TAG1_IMAGES[tag1];
  }

  const categoryImage = CATEGORY_IMAGES[categoryId];
  const useVariation = hashString(productId) % 3 === 0;
  if (!useVariation) return categoryImage;
  const poolIndex = hashString(productId) % PRODUCT_IMAGE_POOL.length;
  return PRODUCT_IMAGE_POOL[poolIndex];
}

export function getCategoryImage(categoryId: ProductCategoryId): string {
  return CATEGORY_IMAGES[categoryId];
}