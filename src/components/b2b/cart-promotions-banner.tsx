"use client";

import { Gift, Percent, Sparkles, Trophy } from "lucide-react";
import {
  evaluateAllPromotions,
  type PromotionProgress,
} from "@/lib/b2b/promotions";
import { formatPrice } from "@/lib/b2b/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CartPromotionsBannerProps {
  /** Suma koszyka netto po rabacie klienta. */
  cartNet: number;
  className?: string;
}

/**
 * Licznik promocji w koszyku — aktualizowany przy każdej zmianie ilości.
 * Jak pasek postępu do progu w Excelu (Conditional Formatting + MAX).
 */
export function CartPromotionsBanner({
  cartNet,
  className,
}: CartPromotionsBannerProps) {
  const progressList = evaluateAllPromotions(cartNet);

  if (progressList.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-coral-500" />
        <h3 className="text-sm font-semibold text-foreground">
          Promocje koszykowe
        </h3>
        <span className="text-xs text-muted-foreground">
          · suma {formatPrice(cartNet)} netto
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {progressList.map((item) => (
          <PromotionProgressCard key={item.promotion.id} progress={item} />
        ))}
      </div>
    </div>
  );
}

function PromotionProgressCard({
  progress,
}: {
  progress: PromotionProgress;
}) {
  const { promotion, remaining, unlocked, progressPercent, message } =
    progress;
  const isDiscount = promotion.rewardType === "cart_discount_percent";
  const Icon = unlocked ? Trophy : isDiscount ? Percent : Gift;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        unlocked
          ? "border-turquoise-500/40 bg-turquoise-500/10"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-full",
              unlocked
                ? "bg-turquoise-500/20 text-turquoise-700"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium leading-snug">
              {promotion.title}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Próg: {formatPrice(promotion.thresholdNet)} netto
            </p>
          </div>
        </div>
        <Badge
          className={cn(
            "shrink-0 text-[10px]",
            unlocked
              ? "bg-turquoise-500/20 text-turquoise-800"
              : "bg-coral-500/15 text-coral-600"
          )}
        >
          {unlocked ? "Odblokowane" : "W toku"}
        </Badge>
      </div>

      <p
        className={cn(
          "mt-3 text-sm font-medium",
          unlocked
            ? "text-turquoise-700 dark:text-turquoise-400"
            : "text-coral-600 dark:text-coral-400"
        )}
      >
        {unlocked
          ? `✓ ${message}`
          : `Brakuje Ci ${formatPrice(remaining)} do ${
              isDiscount
                ? `rabatu −${promotion.discountPercent}%`
                : `gratisu`
            }`}
      </p>

      {!unlocked && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          {promotion.rewardDescription}
        </p>
      )}

      {/* Pasek postępu — jak % do celu w Excelu */}
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            unlocked ? "bg-turquoise-500" : "bg-coral-500"
          )}
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
      <p className="mt-1 text-right text-[10px] text-muted-foreground">
        {Math.min(100, progressPercent)}% progu
      </p>
    </div>
  );
}
