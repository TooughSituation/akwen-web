"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { countOpenOrders, getOrders } from "@/lib/b2b/orders";
import { ordersStorageKey } from "@/lib/b2b/storage-keys";
import type { B2BOrder } from "@/lib/b2b/types";

export function useOrders() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setOrders(getOrders(userId));
  }, [userId]);

  useEffect(() => {
    if (status === "loading") return;
    refresh();
    setIsHydrated(true);

    const onOrdersUpdated = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (!userId) return;
      if (event.key === ordersStorageKey(userId)) {
        refresh();
      }
    };

    window.addEventListener("akwen-orders-updated", onOrdersUpdated);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("akwen-orders-updated", onOrdersUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh, status, userId]);

  const openOrdersCount = countOpenOrders(orders);

  return {
    orders,
    isHydrated,
    openOrdersCount,
    refresh,
    userId: userId ?? null,
  };
}
