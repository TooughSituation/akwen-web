"use client";

import { CartProvider } from "@/contexts/cart-context";
import { ProfileProvider } from "@/contexts/profile-context";

export function B2BProviders({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <CartProvider>{children}</CartProvider>
    </ProfileProvider>
  );
}