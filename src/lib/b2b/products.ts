import "server-only";

import { cache } from "react";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { categorizeProduct, getCategoryList } from "./categories";
import { getProductImage } from "./images";
import type { B2BProduct, ProductCatalog } from "./types";

interface ExcelRow {
  Symbol: string | number;
  Nazwa: string;
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

function mapRowToProduct(row: ExcelRow, index: number): B2BProduct {
  const symbol = String(row.Symbol || `prod-${index}`);
  const name = String(row.Nazwa || "").trim();
  const category = categorizeProduct(name);

  return {
    id: symbol,
    symbol,
    name,
    unit: String(row.Jm || "szt"),
    stock: Number(row["Ilość W magazynie Dostępna"]) || 0,
    priceNet: Number(row["Cena z cennika Cennik bazowy 100 Netto"]) || 0,
    producer: String(row.Producent || "").trim(),
    category,
    imageUrl: getProductImage(symbol, category.id),
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
    totalCount: products.length,
    lastUpdated: new Date().toISOString(),
  };
});

export function getFeaturedProducts(limit = 6): B2BProduct[] {
  const { products } = getProductCatalog();
  return [...products]
    .filter((p) => p.stock > 0)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, limit);
}

export function getProductsByCategory(categoryId: string): B2BProduct[] {
  const { products } = getProductCatalog();
  if (!categoryId || categoryId === "all") return products;
  return products.filter((p) => p.category.id === categoryId);
}

