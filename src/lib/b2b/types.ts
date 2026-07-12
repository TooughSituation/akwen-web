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
  tag1: string;
  tag2: string;
  isRecommended: boolean;
  category: ProductCategory;
  imageUrl: string;
}

export interface TagFilterData {
  tag1List: string[];
  tag2ByTag1: Record<string, string[]>;
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
  tags: TagFilterData;
  totalCount: number;
  recommendedCount: number;
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

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  symbol: string;
  name: string;
  unit: string;
  priceNet: number;
  quantity: number;
  lineTotal: number;
}

export interface B2BOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  companyName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalNet: number;
  deliveryDate: string;
  deliveryAddress: string;
  notes: string;
  createdAt: string;
}

export interface CreateOrderInput {
  items: CartItem[];
  customerId: string;
  companyName: string;
  deliveryDate: string;
  deliveryAddress: string;
  notes: string;
}

export interface DeliveryAddress {
  id: string;
  label: string;
  address: string;
  isDefault?: boolean;
}

export interface B2BProfile {
  id: string;
  companyName: string;
  nip: string;
  regon: string;
  contactPerson: string;
  email: string;
  phone: string;
  discountPercent: number;
  deliveryAddresses: DeliveryAddress[];
}