"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Heart, Package, Sparkles, Tag } from "lucide-react";
import type { B2BProduct } from "@/lib/b2b/types";
import { formatCategoryLabel, formatKindLabel } from "@/lib/b2b/labels";
import {
  applyDiscount,
  formatDiscountSavingsLabel,
  formatPrice,
  sumCartNet,
} from "@/lib/b2b/format";
import {
  CART_PROMOTIONS,
  getNextPromotionProgress,
} from "@/lib/b2b/promotions";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { usePriceDisplay } from "@/contexts/price-display-context";
import { useProfile } from "@/contexts/profile-context";
import { ProductDetailSheet } from "@/components/b2b/product-detail-sheet";
import { ProductImage } from "@/components/b2b/product-image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: B2BProduct;
  compact?: boolean;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <Badge variant="secondary" className="bg-muted text-muted-foreground">
        Brak
      </Badge>
    );
  }
  if (stock < 20) {
    return (
      <Badge className="bg-coral-500/12 text-coral-600">Niski stan</Badge>
    );
  }
  return (
    <Badge className="bg-turquoise-500/12 text-turquoise-600">
      {stock} szt.
    </Badge>
  );
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem, items } = useCart();
  const { profile } = useProfile();
  const { showYourPrice } = usePriceDisplay();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [justAdded, setJustAdded] = useState(false);

  const categoryLabel = formatCategoryLabel(product.tag1);
  const kindLabel = formatKindLabel(product.tag2);
  const favorite = isFavorite(product.id);

  const discountPercent = profile.discountPercent ?? 0;
  const hasDiscount = discountPercent > 0;
  const yourPrice = applyDiscount(product.priceNet, discountPercent);
  const savingsLabel = formatDiscountSavingsLabel(
    product.priceNet,
    discountPercent
  );
  const showDiscounted = hasDiscount && showYourPrice;

  const cartNet = useMemo(
    () => sumCartNet(items, discountPercent),
    [items, discountPercent]
  );
  const nextPromo = useMemo(
    () => getNextPromotionProgress(cartNet),
    [cartNet]
  );
  const primaryPromoBadge = CART_PROMOTIONS[0];

  const [detailsOpen, setDetailsOpen] = useState(false);

  function handleAddToCart(event?: React.MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  function handleToggleFavorite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(product.id);
  }

  /** Klik w kafelek (nie w przyciski) → panel szczegółów z prawej. */
  function handleCardClick() {
    if (compact) return;
    setDetailsOpen(true);
  }

  function handleCardKeyDown(event: React.KeyboardEvent) {
    if (compact) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setDetailsOpen(true);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={compact ? undefined : { y: -4 }}
      className="h-full"
    >
      <Card
        role={compact ? undefined : "button"}
        tabIndex={compact ? undefined : 0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        className={cn(
          "group flex h-full flex-col overflow-hidden border-border/55 bg-card p-0 shadow-none",
          "transition-[box-shadow,border-color] duration-400",
          "hover:border-border hover:shadow-[0_12px_40px_-12px_rgba(0,31,63,0.12)]",
          !compact && "cursor-pointer focus-visible:ring-2 focus-visible:ring-turquoise-500/40 focus-visible:outline-none",
          compact && "flex-row"
        )}
      >
        {/* Zdjęcie: wysokość ~½ poprzedniej (4/5 → 8/5), proporcje object-cover bez rozciągania */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted/25",
            compact
              ? "aspect-square w-14 shrink-0 sm:w-16"
              : "aspect-[8/5] w-full"
          )}
        >
          <ProductImage
            imageUrl={product.imageUrl}
            name={product.name}
            tag1={product.tag1}
            tag2={product.tag2}
            compact={compact}
          />
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={cn(
              "absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full",
              "bg-white/90 shadow-sm backdrop-blur-md transition-all duration-300",
              "hover:scale-105 hover:bg-white focus-visible:ring-2 focus-visible:ring-coral-500/40 focus-visible:outline-none",
              favorite && "bg-coral-500/12"
            )}
            aria-label={
              favorite
                ? `Usuń z ulubionych: ${product.name}`
                : `Dodaj do ulubionych: ${product.name}`
            }
            aria-pressed={favorite}
            title={favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                favorite
                  ? "fill-coral-500 text-coral-500"
                  : "text-navy-900/55"
              )}
            />
          </button>
          {/* Mniej badge'y — quiet luxury: max 2 na raz */}
          <div className="absolute top-3 left-3 flex max-w-[70%] flex-col items-start gap-1.5">
            {categoryLabel && (
              <Badge
                variant="secondary"
                className="bg-navy-900/70 text-[10px] font-medium text-white backdrop-blur-md"
              >
                {categoryLabel}
              </Badge>
            )}
            {product.isRecommended ? (
              <Badge className="bg-coral-500/85 text-[10px] text-white backdrop-blur-md">
                <Sparkles className="mr-0.5 size-2.5" />
                Polecane
              </Badge>
            ) : (
              primaryPromoBadge &&
              !compact && (
                <Badge
                  className="bg-white/90 text-[10px] font-medium text-navy-900 shadow-sm backdrop-blur-md"
                  title={primaryPromoBadge.title}
                >
                  <Tag className="mr-0.5 size-2.5 text-coral-500" />
                  {primaryPromoBadge.badgeLabel}
                </Badge>
              )
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <CardHeader
            className={cn(
              "min-h-[4.5rem] space-y-1.5 px-5 pt-5 pb-2",
              compact && "min-h-0 px-3 py-3"
            )}
          >
            <CardTitle
              className={cn(
                "line-clamp-2 font-semibold tracking-tight text-navy-900 dark:text-foreground",
                compact
                  ? "text-sm leading-snug"
                  : "text-[0.95rem] leading-[1.35] sm:text-base"
              )}
            >
              {product.name}
            </CardTitle>
            {!compact && (
              <CardDescription className="line-clamp-1 text-[11px] leading-relaxed tracking-wide text-muted-foreground">
                {product.symbol}
                {kindLabel ? ` · ${kindLabel}` : ""}
              </CardDescription>
            )}
            {!compact && nextPromo && !nextPromo.unlocked && (
              <p className="text-[11px] font-medium leading-snug text-coral-600/90 dark:text-coral-400">
                Brakuje {formatPrice(nextPromo.remaining)} do promocji
              </p>
            )}
          </CardHeader>

          <CardContent
            className={cn(
              "mt-auto space-y-4 px-5 pt-1 pb-5",
              compact && "space-y-2 px-3 pb-3"
            )}
          >
            <div className="flex min-h-[3.25rem] items-end justify-between gap-2">
              <div>
                {showDiscounted ? (
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground line-through decoration-muted-foreground/45">
                      {formatPrice(product.priceNet)}
                    </p>
                    <p className="text-xl font-semibold tracking-tight text-turquoise-600 dark:text-turquoise-400">
                      {formatPrice(yourPrice)}
                      <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                        /{product.unit}
                      </span>
                    </p>
                    {savingsLabel && (
                      <p className="text-[11px] font-medium text-coral-600/90">
                        {savingsLabel}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-semibold tracking-tight text-navy-900 dark:text-white">
                      {formatPrice(product.priceNet)}
                      <span className="ml-0.5 text-xs font-normal text-muted-foreground">
                        /{product.unit}
                      </span>
                    </p>
                    {hasDiscount && savingsLabel && (
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        Z rabatem:{" "}
                        <span className="font-medium text-turquoise-600">
                          {formatPrice(yourPrice)}
                        </span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <StockBadge stock={product.stock} />
            </div>

            {!compact && (
              <div className="flex gap-2.5">
                <Button
                  size="sm"
                  className={cn(
                    "h-10 min-w-0 flex-1 rounded-full font-medium",
                    justAdded
                      ? "bg-green-600/90 hover:bg-green-600"
                      : "bg-[#0077B6] hover:bg-turquoise-600"
                  )}
                  disabled={product.stock <= 0}
                  onClick={handleAddToCart}
                >
                  {justAdded ? (
                    <>
                      <Check className="size-4" />
                      Dodano
                    </>
                  ) : (
                    <>
                      <Package className="size-4" />
                      Do koszyka
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={cn(
                    "h-10 shrink-0 rounded-full px-3",
                    favorite &&
                      "border-coral-500/30 bg-coral-500/8 text-coral-600 hover:bg-coral-500/12"
                  )}
                  onClick={handleToggleFavorite}
                  aria-pressed={favorite}
                  title={favorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                >
                  <Heart
                    className={cn(
                      "size-4",
                      favorite && "fill-coral-500 text-coral-500"
                    )}
                  />
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {!compact && (
        <ProductDetailSheet
          product={product}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}
    </motion.div>
  );
}
