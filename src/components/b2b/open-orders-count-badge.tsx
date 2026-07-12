"use client";

import { useOrders } from "@/hooks/use-orders";

interface OpenOrdersCountBadgeProps {
  fallback?: string;
}

export function OpenOrdersCountBadge({
  fallback = "0",
}: OpenOrdersCountBadgeProps) {
  const { openOrdersCount, isHydrated } = useOrders();
  return <>{isHydrated ? openOrdersCount : fallback}</>;
}