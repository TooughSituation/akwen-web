import "server-only";

import { cache } from "react";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { categorizeProduct, getCategoryList } from "./categories";
import { getProductImage } from "./images";
import type { B2BProduct, ProductCatalog, TagFilterData } from "./types";

interface ExcelRow {
  Symbol: string | number;
  Nazwa: string;
  Tag1: string;
  Tag2: string;
  Proponowany: string;
  Jm: string;
  "Ilość W magazynie Dostępna": number;
  "Cena z cennika Cennik bazowy 100 Netto": number;
  Producent: string;
}

function parseExcelRows(): ExcelRow[] {
  const filePath = path.join(process.cwd(), "public/data/produkty.xlsx");
  const buffer = fs.readFileSync(filePath);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: "" });
}

function isRecommended(value: string): boolean {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "tak" || normalized === "yes" || normalized === "1";
}

function buildTagFilterData(products: B2BProduct[]): TagFilterData {
  const tag1Set = new Set<string>();
  const tag2ByTag1: Record<string, Set<string>> = {};

  products.forEach((product) => {
    if (!product.tag1) return;
    tag1Set.add(product.tag1);
    if (!tag2ByTag1[product.tag1]) {
      tag2ByTag1[product.tag1] = new Set();
    }
    if (product.tag2) {
      tag2ByTag1[product.tag1].add(product.tag2);
    }
  });

  const tag1List = [...tag1Set].sort((a, b) => a.localeCompare(b, "pl"));
  const tag2Map: Record<string, string[]> = {};
  tag1List.forEach((tag1) => {
    tag2Map[tag1] = [...(tag2ByTag1[tag1] || [])].sort((a, b) =>
      a.localeCompare(b, "pl")
    );
  });

  return { tag1List, tag2ByTag1: tag2Map };
}

function mapRowToProduct(row: ExcelRow, index: number): B2BProduct {
  const symbol = String(row.Symbol || `prod-${index}`);
  const name = String(row.Nazwa || "").trim();
  const tag1 = String(row.Tag1 || "").trim();
  const tag2 = String(row.Tag2 || "").trim();
  const category = categorizeProduct(name);

  return {
    id: symbol,
    symbol,
    name,
    unit: String(row.Jm || "szt"),
    stock: Number(row["Ilość W magazynie Dostępna"]) || 0,
    priceNet: Number(row["Cena z cennika Cennik bazowy 100 Netto"]) || 0,
    producer: String(row.Producent || "").trim(),
    tag1,
    tag2,
    isRecommended: isRecommended(row.Proponowany),
    category,
    imageUrl: getProductImage(symbol, category.id, tag1, tag2),
  };
}

export const getProductCatalog = cache((): ProductCatalog => {
  const rows = parseExcelRows();
  const products = rows
    .filter((row) => row.Nazwa?.trim())
    .map(mapRowToProduct)
    .sort((a, b) => a.name.localeCompare(b.name, "pl"));

  return {
    products,
    categories: getCategoryList(),
    tags: buildTagFilterData(products),
    totalCount: products.length,
    recommendedCount: products.filter((p) => p.isRecommended).length,
    lastUpdated: new Date().toISOString(),
  };
});

export function getRecommendedProducts(limit?: number): B2BProduct[] {
  const { products } = getProductCatalog();
  const recommended = products
    .filter((p) => p.isRecommended)
    .sort((a, b) => {
      if (b.stock !== a.stock) return b.stock - a.stock;
      return a.name.localeCompare(b.name, "pl");
    });

  return limit ? recommended.slice(0, limit) : recommended;
}

export function getFeaturedProducts(limit = 6): B2BProduct[] {
  const recommended = getRecommendedProducts(limit);
  if (recommended.length >= limit) return recommended;

  const { products } = getProductCatalog();
  const fallback = [...products]
    .filter((p) => p.stock > 0 && !p.isRecommended)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, limit - recommended.length);

  return [...recommended, ...fallback];
}

export function getProductsByCategory(categoryId: string): B2BProduct[] {
  const { products } = getProductCatalog();
  if (!categoryId || categoryId === "all") return products;
  return products.filter((p) => p.category.id === categoryId);
}

export function getProductsByTag1(tag1: string): B2BProduct[] {
  const { products } = getProductCatalog();
  if (!tag1 || tag1 === "all") return products;
  return products.filter((p) => p.tag1 === tag1);
}