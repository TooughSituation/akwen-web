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
import { useSession } from "next-auth/react";
import {
  getLoyaltyAccount,
  LOYALTY_UPDATED_EVENT,
  redeemReward,
  type RedeemResult,
} from "@/lib/b2b/loyalty";
import { loyaltyStorageKey } from "@/lib/b2b/storage-keys";
import type { LoyaltyAccount } from "@/lib/b2b/types";

interface LoyaltyContextValue {
  account: LoyaltyAccount;
  balance: number;
  isHydrated: boolean;
  refresh: () => void;
  redeem: (rewardId: string) => RedeemResult;
}

const LoyaltyContext = createContext<LoyaltyContextValue | null>(null);

export function LoyaltyProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [account, setAccount] = useState<LoyaltyAccount>(() =>
    getLoyaltyAccount(undefined)
  );
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setAccount(getLoyaltyAccount(userId));
  }, [userId]);

  useEffect(() => {
    if (status === "loading") return;
    refresh();
    setIsHydrated(true);

    const onUpdate = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (!userId) return;
      if (event.key === loyaltyStorageKey(userId)) refresh();
    };

    window.addEventListener(LOYALTY_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LOYALTY_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh, status, userId]);

  const redeem = useCallback(
    (rewardId: string): RedeemResult => {
      const result = redeemReward(rewardId, userId);
      if (result.ok) {
        setAccount(result.account);
      }
      return result;
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      account,
      balance: account.balance,
      isHydrated,
      refresh,
      redeem,
    }),
    [account, isHydrated, refresh, redeem]
  );

  return (
    <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
  );
}

export function useLoyalty() {
  const context = useContext(LoyaltyContext);
  if (!context) {
    throw new Error("useLoyalty musi być użyty wewnątrz LoyaltyProvider");
  }
  return context;
}
