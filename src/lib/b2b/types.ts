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
  /**
   * Krótki powód proponowania (np. „Wysoka marża”).
   * null dla produktów spoza oferty polecanej.
   */
  recommendReason: string | null;
  /** Rozszerzone wyjaśnienie powodu (tooltip / karta). */
  recommendReasonDetail: string | null;
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
  /** Cena katalogowa (przed rabatem). */
  listPriceNet: number;
  /** Cena jednostkowa netto po rabacie klienta. */
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
  /** Suma netto po rabacie. */
  totalNet: number;
  /** Rabat procentowy zastosowany przy składaniu zamówienia. */
  discountPercent: number;
  /** Punkty lojalnościowe naliczone za to zamówienie (1 pkt / 10 zł netto). */
  loyaltyPointsEarned?: number;
  /** Data dostawy w formacie YYYY-MM-DD (jak data w komórce Excela). */
  deliveryDate: string;
  deliveryAddress: string;
  notes: string;
  createdAt: string;
  /** Opcjonalnie: kiedy ostatnio zmieniono datę/adres/uwagi lub anulowano. */
  updatedAt?: string;
}

/**
 * Pola, które klient może zmienić w zamówieniu (status „new”, min. 24h do dostawy).
 * Pozycje koszyka nie są edytowalne w MVP — tylko logistyka.
 */
export interface UpdateOrderInput {
  deliveryDate: string;
  deliveryAddress: string;
  notes: string;
}

/** Typ nagrody w katalogu lojalnościowym. */
export type LoyaltyRewardCategory = "discount" | "product" | "gadget";

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: LoyaltyRewardCategory;
}

export type LoyaltyLedgerType = "earn" | "redeem";

/** Wiersz arkusza „Punkty” — przyrost lub wymiana. */
export interface LoyaltyLedgerEntry {
  id: string;
  type: LoyaltyLedgerType;
  /** Wartość ruchu: +przy naliczeniu, −przy wymianie. */
  points: number;
  balanceAfter: number;
  description: string;
  orderId?: string;
  orderNumber?: string;
  rewardId?: string;
  rewardName?: string;
  createdAt: string;
}

export interface LoyaltyRedemption {
  id: string;
  rewardId: string;
  rewardName: string;
  pointsSpent: number;
  createdAt: string;
  status: "requested" | "fulfilled" | "cancelled";
}

/** Konto lojalnościowe partnera (per userId). */
export interface LoyaltyAccount {
  userId: string;
  balance: number;
  ledger: LoyaltyLedgerEntry[];
  redemptions: LoyaltyRedemption[];
  updatedAt: string;
}

export interface CreateOrderInput {
  items: CartItem[];
  customerId: string;
  companyName: string;
  /** Rabat % z profilu klienta — stosowany do cen przy tworzeniu zamówienia. */
  discountPercent: number;
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

/**
 * Mock zaległości płatniczych (jak flaga w arkuszu „Rozrachunki”).
 * hasArrears = true → blokada „Złóż zamówienie” w koszyku.
 */
export interface PaymentArrears {
  hasArrears: boolean;
  /** Kwota zaległości netto (PLN) — tylko do komunikatu. */
  amountNet: number;
  /** Np. numer faktury / opis (mock). */
  note?: string;
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
  /** Opcjonalny mock zaległości — brak pola = brak blokady. */
  paymentArrears?: PaymentArrears;
}