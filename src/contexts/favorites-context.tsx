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
  FAVORITES_UPDATED_EVENT,
  getFavoriteIds,
  toggleFavorite as toggleFavoriteInStorage,
} from "@/lib/b2b/favorites";
import { favoritesStorageKey } from "@/lib/b2b/storage-keys";

interface FavoritesContextValue {
  /** Lista ID ulubionych produktów. */
  favoriteIds: string[];
  count: number;
  isHydrated: boolean;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  refresh: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

/**
 * Kontekst ulubionych — jak otwarty arkusz „Ulubione” w tle całej aplikacji B2B.
 */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(() => {
    setFavoriteIds(getFavoriteIds(userId));
  }, [userId]);

  useEffect(() => {
    if (status === "loading") return;
    refresh();
    setIsHydrated(true);

    const onUpdate = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (!userId) return;
      if (event.key === favoritesStorageKey(userId)) refresh();
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh, status, userId]);

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    (productId: string) => {
      if (!userId) return;
      const { ids } = toggleFavoriteInStorage(productId, userId);
      setFavoriteIds(ids);
    },
    [userId]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      count: favoriteIds.length,
      isHydrated,
      isFavorite,
      toggleFavorite,
      refresh,
    }),
    [favoriteIds, isHydrated, isFavorite, toggleFavorite, refresh]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites musi być użyty wewnątrz FavoritesProvider");
  }
  return context;
}
