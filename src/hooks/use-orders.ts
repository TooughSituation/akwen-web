"use client";

import { useCallback, useEffect, useState } from "react";
import { countOpenOrders, getOrders } from "@/lib/b2b/orders";
import type { B2BOrder } from "@/lib/b2b/types";

export function useOrders() {
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setOrders(getOrders());
  }, []);

  useEffect(() => {
    refresh();
    setIsHydrated(true);

    const onStorage = (event: StorageEvent) => {
      if (event.key === "akwen-b2b-orders") {
        refresh();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const openOrdersCount = countOpenOrders(orders);

  return {
    orders,
    isHydrated,
    openOrdersCount,
    refresh,
  };
}