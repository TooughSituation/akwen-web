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
  PROFILE_UPDATED_EVENT,
  getDefaultProfile,
  getProfile,
  profileToCustomer,
  saveProfile as persistProfile,
} from "@/lib/b2b/profile";
import { profileStorageKey } from "@/lib/b2b/storage-keys";
import type { B2BCustomer, B2BProfile } from "@/lib/b2b/types";

interface ProfileContextValue {
  profile: B2BProfile;
  customer: B2BCustomer;
  isHydrated: boolean;
  userId: string | null;
  saveProfile: (profile: B2BProfile) => void;
  refreshProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const [profile, setProfile] = useState<B2BProfile>(getDefaultProfile());
  const [isHydrated, setIsHydrated] = useState(false);

  const refreshProfile = useCallback(() => {
    setProfile(getProfile(userId));
  }, [userId]);

  useEffect(() => {
    if (status === "loading") return;
    refreshProfile();
    setIsHydrated(true);

    const onProfileUpdated = () => refreshProfile();
    const onStorage = (event: StorageEvent) => {
      if (!userId) return;
      if (event.key === profileStorageKey(userId)) {
        refreshProfile();
      }
    };

    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, [refreshProfile, status, userId]);

  const saveProfile = useCallback(
    (nextProfile: B2BProfile) => {
      persistProfile(nextProfile, userId);
      setProfile(nextProfile);
    },
    [userId]
  );

  const customer = useMemo(() => profileToCustomer(profile), [profile]);

  const value = useMemo(
    () => ({
      profile,
      customer,
      isHydrated,
      userId,
      saveProfile,
      refreshProfile,
    }),
    [profile, customer, isHydrated, userId, saveProfile, refreshProfile]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile musi być użyty wewnątrz ProfileProvider");
  }
  return context;
}
