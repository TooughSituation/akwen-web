export type ProductCategoryId =
  | "mrozone"
  | "wedzone"
  | "konserwy"
  | "przetwory"
  | "litewskie"
  | "owoce-morza"
  | "swieze"
  | "inne";

export interface ProductCategory {
  id: ProductCategoryId;
  label: string;
}

export interface B2BProduct {
  id: string;
  symbol: string;
  name: string;
  unit: string;
  stock: number;
  priceNet: number;
  producer: string;
  category: ProductCategory;
  imageUrl: string;
}

export interface B2BCustomer {
  id: string;
  companyName: string;
  nip: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  discountPercent: number;
}

export interface ProductCatalog {
  products: B2BProduct[];
  categories: ProductCategory[];
  totalCount: number;
  lastUpdated: string;
}

export interface CartItem {
  productId: string;
  symbol: string;
  name: string;
  unit: string;
  priceNet: number;
  stock: number;
  quantity: number;
}