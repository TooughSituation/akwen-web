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
import { priceModeStorageKey } from "@/lib/b2b/storage-keys";

export type PriceDisplayMode = "yours" | "list";

interface PriceDisplayContextValue {
  mode: PriceDisplayMode;
  setMode: (mode: PriceDisplayMode) => void;
  isHydrated: boolean;
  showYourPrice: boolean;
}

const PriceDisplayContext = createContext<PriceDisplayContextValue | null>(
  null
);

function readStoredMode(userId: string | undefined): PriceDisplayMode {
  if (typeof window === "undefined" || !userId) return "yours";
  try {
    const saved = localStorage.getItem(priceModeStorageKey(userId));
    if (saved === "list" || saved === "yours") return saved;
  } catch {
    // ignore
  }
  return "yours";
}

export function PriceDisplayProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [mode, setModeState] = useState<PriceDisplayMode>("yours");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    setModeState(readStoredMode(userId));
    setIsHydrated(true);
  }, [userId, status]);

  const setMode = useCallback(
    (next: PriceDisplayMode) => {
      setModeState(next);
      if (!userId) return;
      try {
        localStorage.setItem(priceModeStorageKey(userId), next);
      } catch {
        // ignore
      }
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isHydrated,
      showYourPrice: mode === "yours",
    }),
    [mode, setMode, isHydrated]
  );

  return (
    <PriceDisplayContext.Provider value={value}>
      {children}
    </PriceDisplayContext.Provider>
  );
}

export function usePriceDisplay() {
  const context = useContext(PriceDisplayContext);
  if (!context) {
    throw new Error(
      "usePriceDisplay musi być użyty wewnątrz PriceDisplayProvider"
    );
  }
  return context;
}
