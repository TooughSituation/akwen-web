"use client";

import { CartProvider } from "@/contexts/cart-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { LoyaltyProvider } from "@/contexts/loyalty-context";
import { PriceDisplayProvider } from "@/contexts/price-display-context";
import { ProfileProvider } from "@/contexts/profile-context";

export function B2BProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <PriceDisplayProvider>
        <LoyaltyProvider>
          <FavoritesProvider>
            <CartProvider>{children}</CartProvider>
          </FavoritesProvider>
        </LoyaltyProvider>
      </PriceDisplayProvider>
    </ProfileProvider>
  );
}