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
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  hasSeenTour,
  markTourSeen,
  TOUR_STEPS,
  type TourStep,
} from "@/lib/b2b/tour";

interface TourContextValue {
  isActive: boolean;
  stepIndex: number;
  step: TourStep | null;
  totalSteps: number;
  isHydrated: boolean;
  startTour: () => void;
  next: () => void;
  prev: () => void;
  endTour: () => void;
}

const TourContext = createContext<TourContextValue | null>(null);

export function TourProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const [autoStarted, setAutoStarted] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    setIsHydrated(true);
  }, [status]);

  // Auto-start raz dla użytkownika, który nie widział przewodnika
  useEffect(() => {
    if (!isHydrated || !userId || autoStarted) return;
    if (pathname?.startsWith("/b2b/login")) return;
    if (!hasSeenTour(userId)) {
      // Małe opóźnienie — layout i data-tour muszą być w DOM
      const t = window.setTimeout(() => {
        setStepIndex(0);
        setIsActive(true);
        setAutoStarted(true);
      }, 600);
      return () => window.clearTimeout(t);
    }
    setAutoStarted(true);
  }, [isHydrated, userId, autoStarted, pathname]);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setIsActive(true);
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setStepIndex(0);
    markTourSeen(userId);
  }, [userId]);

  const goToStep = useCallback(
    (index: number) => {
      const step = TOUR_STEPS[index];
      if (!step) {
        endTour();
        return;
      }
      setStepIndex(index);
      if (step.href && pathname !== step.href && !pathname?.startsWith(step.href + "?")) {
        // Katalog z query: href /b2b/katalog — pathname /b2b/katalog jest OK
        const targetPath = step.href.split("?")[0];
        if (pathname !== targetPath) {
          router.push(step.href);
        }
      }
    },
    [endTour, pathname, router]
  );

  const next = useCallback(() => {
    if (stepIndex >= TOUR_STEPS.length - 1) {
      endTour();
      return;
    }
    goToStep(stepIndex + 1);
  }, [stepIndex, endTour, goToStep]);

  const prev = useCallback(() => {
    if (stepIndex <= 0) return;
    goToStep(stepIndex - 1);
  }, [stepIndex, goToStep]);

  // Przy starcie / zmianie kroku — nawiguj jeśli trzeba
  useEffect(() => {
    if (!isActive) return;
    const step = TOUR_STEPS[stepIndex];
    if (!step?.href) return;
    const targetPath = step.href.split("?")[0];
    if (pathname !== targetPath) {
      router.push(step.href);
    }
  }, [isActive, stepIndex, pathname, router]);

  const step = isActive ? (TOUR_STEPS[stepIndex] ?? null) : null;

  const value = useMemo(
    () => ({
      isActive,
      stepIndex,
      step,
      totalSteps: TOUR_STEPS.length,
      isHydrated,
      startTour,
      next,
      prev,
      endTour,
    }),
    [isActive, stepIndex, step, isHydrated, startTour, next, prev, endTour]
  );

  return (
    <TourContext.Provider value={value}>{children}</TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour musi być użyty wewnątrz TourProvider");
  }
  return context;
}
