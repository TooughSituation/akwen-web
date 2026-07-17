"use client";

import { Percent, Tag } from "lucide-react";
import {
  usePriceDisplay,
  type PriceDisplayMode,
} from "@/contexts/price-display-context";
import { useProfile } from "@/contexts/profile-context";
import { cn } from "@/lib/utils";

interface PriceModeToggleProps {
  className?: string;
  /** Kompaktowy wariant w pasku narzędzi katalogu */
  size?: "sm" | "md";
}

export function PriceModeToggle({
  className,
  size = "md",
}: PriceModeToggleProps) {
  const { mode, setMode, isHydrated } = usePriceDisplay();
  const { profile } = useProfile();
  const discountPercent = profile.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;

  if (!isHydrated) {
    return (
      <div
        className={cn(
          "h-9 w-48 animate-pulse rounded-lg bg-muted/60",
          className
        )}
        aria-hidden
      />
    );
  }

  if (!hasDiscount) {
    return (
      <p
        className={cn(
          "text-xs text-muted-foreground",
          size === "sm" && "hidden sm:block",
          className
        )}
      >
        Ceny katalogowe netto
      </p>
    );
  }

  const options: Array<{
    value: PriceDisplayMode;
    label: string;
    shortLabel: string;
    icon: typeof Percent;
  }> = [
    {
      value: "yours",
      label: `Twoja cena (−${discountPercent}%)`,
      shortLabel: "Twoja",
      icon: Percent,
    },
    {
      value: "list",
      label: "Katalogowa",
      shortLabel: "Katalog",
      icon: Tag,
    },
  ];

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-card p-0.5",
        className
      )}
      role="group"
      aria-label="Tryb wyświetlania cen"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              size === "sm" && "px-2 py-1",
              active
                ? "bg-turquoise-500 text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-pressed={active}
          >
            <Icon className="size-3.5 shrink-0" />
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">{option.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
