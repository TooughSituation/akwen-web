"use client";

import { CartProvider } from "@/contexts/cart-context";
import { PriceDisplayProvider } from "@/contexts/price-display-context";
import { ProfileProvider } from "@/contexts/profile-context";

export function B2BProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <PriceDisplayProvider>
        <CartProvider>{children}</CartProvider>
      </PriceDisplayProvider>
    </ProfileProvider>
  );
}