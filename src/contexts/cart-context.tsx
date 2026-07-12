"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { B2BOrder, B2BProduct, CartItem } from "@/lib/b2b/types";

const STORAGE_KEY = "akwen-b2b-cart";

interface CartContextValue {
  items: CartItem[];
  isHydrated: boolean;
  totalItems: number;
  totalNet: number;
  addItem: (product: B2BProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addCartItem: (item: CartItem) => void;
  reorderFromOrder: (order: B2BOrder) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function productToCartItem(product: B2BProduct, quantity: number): CartItem {
  return {
    productId: product.id,
    symbol: product.symbol,
    name: product.name,
    unit: product.unit,
    priceNet: product.priceNet,
    stock: product.stock,
    quantity,
  };
}

function clampQuantity(quantity: number, stock: number): number {
  if (stock <= 0) return 0;
  return Math.max(1, Math.min(quantity, stock));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed
              .filter((item) => item.productId && item.quantity > 0)
              .map((item) => ({
                ...item,
                quantity: clampQuantity(item.quantity, item.stock),
              }))
          );
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem = useCallback((product: B2BProduct, quantity = 1) => {
    if (product.stock <= 0) return;

    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                priceNet: product.priceNet,
                stock: product.stock,
                quantity: clampQuantity(
                  item.quantity + quantity,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...current,
        productToCartItem(product, clampQuantity(quantity, product.stock)),
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: clampQuantity(quantity, item.stock) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const addCartItem = useCallback((item: CartItem) => {
    if (item.quantity <= 0) return;

    setItems((current) => {
      const existing = current.find((i) => i.productId === item.productId);

      if (existing) {
        return current.map((i) =>
          i.productId === item.productId
            ? {
                ...i,
                priceNet: item.priceNet,
                stock: Math.max(i.stock, item.stock),
                quantity: clampQuantity(
                  i.quantity + item.quantity,
                  Math.max(i.stock, item.stock)
                ),
              }
            : i
        );
      }

      return [
        ...current,
        {
          ...item,
          quantity: clampQuantity(item.quantity, item.stock),
        },
      ];
    });
  }, []);

  const reorderFromOrder = useCallback(
    (order: B2BOrder) => {
      order.items.forEach((item) => {
        addCartItem({
          productId: item.productId,
          symbol: item.symbol,
          name: item.name,
          unit: item.unit,
          priceNet: item.priceNet,
          stock: Math.max(item.quantity, 9999),
          quantity: item.quantity,
        });
      });
    },
    [addCartItem]
  );

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalNet = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.priceNet * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isHydrated,
      totalItems,
      totalNet,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      addCartItem,
      reorderFromOrder,
    }),
    [
      items,
      isHydrated,
      totalItems,
      totalNet,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      addCartItem,
      reorderFromOrder,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart musi być użyty wewnątrz CartProvider");
  }
  return context;
}