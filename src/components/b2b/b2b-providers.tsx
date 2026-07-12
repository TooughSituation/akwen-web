"use client";

import { CartProvider } from "@/contexts/cart-context";

export function B2BProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}