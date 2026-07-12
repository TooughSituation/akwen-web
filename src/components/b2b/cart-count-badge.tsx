"use client";

import { useCart } from "@/contexts/cart-context";

interface CartCountBadgeProps {
  fallback?: string;
}

export function CartCountBadge({ fallback = "0" }: CartCountBadgeProps) {
  const { totalItems, isHydrated } = useCart();
  return <>{isHydrated ? totalItems : fallback}</>;
}