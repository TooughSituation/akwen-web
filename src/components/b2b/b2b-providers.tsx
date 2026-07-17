"use client";

import { LiveChatSheet } from "@/components/b2b/live-chat";
import { TourOverlay } from "@/components/b2b/tour-overlay";
import { CartProvider } from "@/contexts/cart-context";
import { ChatProvider } from "@/contexts/chat-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { LoyaltyProvider } from "@/contexts/loyalty-context";
import { PriceDisplayProvider } from "@/contexts/price-display-context";
import { ProfileProvider } from "@/contexts/profile-context";
import { TourProvider } from "@/contexts/tour-context";

export function B2BProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <PriceDisplayProvider>
        <LoyaltyProvider>
          <FavoritesProvider>
            <ChatProvider>
              <CartProvider>
                <TourProvider>
                  {children}
                  <LiveChatSheet />
                  <TourOverlay />
                </TourProvider>
              </CartProvider>
            </ChatProvider>
          </FavoritesProvider>
        </LoyaltyProvider>
      </PriceDisplayProvider>
    </ProfileProvider>
  );
}