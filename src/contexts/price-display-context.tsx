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

export type PriceDisplayMode = "yours" | "list";

const STORAGE_KEY = "akwen-b2b-price-mode";

interface PriceDisplayContextValue {
  mode: PriceDisplayMode;
  setMode: (mode: PriceDisplayMode) => void;
  isHydrated: boolean;
  /** true = pokazuj ceny po rabacie klienta */
  showYourPrice: boolean;
}

const PriceDisplayContext = createContext<PriceDisplayContextValue | null>(
  null
);

function readStoredMode(): PriceDisplayMode {
  if (typeof window === "undefined") return "yours";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "list" || saved === "yours") return saved;
  } catch {
    // ignore
  }
  return "yours";
}

export function PriceDisplayProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<PriceDisplayMode>("yours");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setModeState(readStoredMode());
    setIsHydrated(true);
  }, []);

  const setMode = useCallback((next: PriceDisplayMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

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
