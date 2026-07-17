import "server-only";

import { cache } from "react";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import { categorizeProduct, getCategoryList } from "./categories";
import { getProductImage } from "./images";
import { resolveRecommendReason } from "./recommend";
import type { B2BProduct, ProductCatalog, TagFilterData } from "./types";

interface ExcelRow {
  Symbol: string | number;
  Nazwa: string;
  Tag1: string;
  Tag2: string;
  Proponowany: string;
  /** Powód proponowania z arkusza (np. „Wysoka marża”, „Bestseller”). */
  PowodProponowania?: string;
  /** Opcjonalny opis handlowy z arkusza. */
  Opis?: string;
  Jm: string;
  "Ilość OGÓŁEM": number;
  "Ilość W magazynie Dostępna": number;
  "Wartość ogółem": number;
  "Data dostawy Różnica dni": number;
  "Cena z cennika Cennik bazowy 100 Netto": number;
  Producent: string;
}

/**
 * Opis do panelu szczegółów: kolumna Excel „Opis” albo sensowny mock.
 * (Jak formuła IF w Excelu: jeśli pusto → zbuduj tekst z innych kolumn.)
 * Powód proponowania zostaje w polu recommendReason* — nie dublujemy tu.
 */
function resolveProductDescription(input: {
  excelDescription: string | null;
  name: string;
  producer: string;
  tag1: string;
  tag2: string;
}): string {
  if (input.excelDescription) return input.excelDescription;

  const parts: string[] = [];
  parts.push(
    `${input.name} — pozycja z oferty hurtowej AKWEN, dostępna dla partnerów B2B.`
  );
  if (input.producer) {
    parts.push(`Producent: ${input.producer}.`);
  }
  if (input.tag1 || input.tag2) {
    const tags = [input.tag1, input.tag2].filter(Boolean).join(" · ");
    parts.push(`Kategoria: ${tags}.`);
  }
  parts.push("Ceny netto, bez VAT. Stan magazynowy aktualizowany z cennika.");
  return parts.join(" ");
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
  const stock = Number(row["Ilość W magazynie Dostępna"]) || 0;
  const priceNet =
    Number(row["Cena z cennika Cennik bazowy 100 Netto"]) || 0;
  const recommended = isRecommended(row.Proponowany);
  // Jak VLOOKUP/odczyt komórki: najpierw wartość z kolumny Excel, potem heurystyka
  const excelReason = String(row.PowodProponowania ?? "").trim();
  const reason = resolveRecommendReason({
    priceNet,
    stock,
    stockValueTotal: Number(row["Wartość ogółem"]) || 0,
    stockQtyTotal: Number(row["Ilość OGÓŁEM"]) || 0,
    deliveryDaysSpan: Number(row["Data dostawy Różnica dni"]) || 0,
    isRecommended: recommended,
    excelReason: excelReason || null,
  });

  const producer = String(row.Producent || "").trim();
  const recommendReasonDetail = reason?.description ?? null;
  const excelDescription = String(row.Opis ?? "").trim() || null;

  return {
    id: symbol,
    symbol,
    name,
    unit: String(row.Jm || "szt"),
    stock,
    priceNet,
    producer,
    tag1,
    tag2,
    isRecommended: recommended || Boolean(reason),
    recommendReason: reason?.label ?? null,
    recommendReasonDetail,
    description: resolveProductDescription({
      excelDescription,
      name,
      producer,
      tag1,
      tag2,
    }),
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