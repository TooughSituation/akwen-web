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
  categoryId: ProductCategoryId
): string {
  const categoryImage = CATEGORY_IMAGES[categoryId];
  const useVariation = hashString(productId) % 3 === 0;
  if (!useVariation) return categoryImage;
  const poolIndex = hashString(productId) % PRODUCT_IMAGE_POOL.length;
  return PRODUCT_IMAGE_POOL[poolIndex];
}

export function getCategoryImage(categoryId: ProductCategoryId): string {
  return CATEGORY_IMAGES[categoryId];
}