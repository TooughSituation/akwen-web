"use client";

import { useMemo, useState } from "react";
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
        Brak na stanie
      </Badge>
    );
  }
  if (stock < 20) {
    return (
      <Badge className="bg-coral-500/15 text-coral-600">
        Niski stan: {stock} szt.
      </Badge>
    );
  }
  return (
    <Badge className="bg-turquoise-500/15 text-turquoise-600">
      Dostępne: {stock} szt.
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
  // Domyślnie: Twoja cena (katalogowa + rabat + oszczędność). Toggle „Katalogowa” = sam cennik.
  const showDiscounted = hasDiscount && showYourPrice;

  // Suma koszyka netto (po rabacie) → „brakuje do promocji” na żywo
  const cartNet = useMemo(
    () => sumCartNet(items, discountPercent),
    [items, discountPercent]
  );
  const nextPromo = useMemo(
    () => getNextPromotionProgress(cartNet),
    [cartNet]
  );
  // Badge: najniższy próg (pierwsza promocja w tabeli) + ewentualnie gratis
  const primaryPromoBadge = CART_PROMOTIONS[0];
  const secondaryPromoBadge = CART_PROMOTIONS[1];

  function handleAddToCart() {
    addItem(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  function handleToggleFavorite(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(product.id);
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/60 p-0 transition-shadow hover:shadow-lg",
        compact && "flex-row"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          compact ? "aspect-square w-28 shrink-0" : "aspect-[4/3] w-full"
        )}
      >
        <ProductImage
          imageUrl={product.imageUrl}
          name={product.name}
          tag1={product.tag1}
          tag2={product.tag2}
          compact={compact}
        />
        {/* Serce — jak checkbox „Ulubione” w Access */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={cn(
            "absolute top-2 right-2 z-10 flex size-8 items-center justify-center rounded-full",
            "bg-white/90 shadow-sm backdrop-blur-sm transition-colors",
            "hover:bg-white focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:outline-none",
            favorite && "bg-coral-500/15"
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
                : "text-navy-900/70"
            )}
          />
        </button>
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {categoryLabel && (
            <Badge
              variant="secondary"
              className="bg-navy-900/80 text-[10px] text-white backdrop-blur-sm"
            >
              {categoryLabel}
            </Badge>
          )}
          {kindLabel && (
            <Badge
              variant="secondary"
              className="bg-turquoise-600/80 text-[10px] text-white backdrop-blur-sm"
            >
              {kindLabel}
            </Badge>
          )}
          {product.isRecommended && (
            <Badge className="bg-coral-500/90 text-[10px] text-white backdrop-blur-sm">
              <Sparkles className="mr-0.5 size-2.5" />
              Polecane
            </Badge>
          )}
          {product.recommendReason && (
            <Badge
              variant="secondary"
              className="bg-white/90 text-[10px] text-navy-900 shadow-sm backdrop-blur-sm"
              title={product.recommendReasonDetail ?? product.recommendReason}
            >
              {product.recommendReason}
            </Badge>
          )}
          {primaryPromoBadge && (
            <Badge
              className="bg-coral-500/90 text-[10px] text-white backdrop-blur-sm"
              title={primaryPromoBadge.title}
            >
              <Tag className="mr-0.5 size-2.5" />
              {primaryPromoBadge.badgeLabel}
            </Badge>
          )}
          {secondaryPromoBadge && !compact && (
            <Badge
              className="bg-navy-900/75 text-[10px] text-white backdrop-blur-sm"
              title={secondaryPromoBadge.title}
            >
              {secondaryPromoBadge.badgeLabel}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <CardHeader className={cn("pb-2", compact && "py-3")}>
          <CardTitle
            className={cn(
              "line-clamp-2 leading-snug",
              compact ? "text-sm" : "text-base"
            )}
          >
            {product.name}
          </CardTitle>
          <CardDescription className="text-xs">
            Symbol: {product.symbol}
            {product.producer ? ` · ${product.producer}` : ""}
          </CardDescription>
          {product.isRecommended &&
            product.recommendReasonDetail &&
            !compact && (
              <p className="mt-1.5 text-xs leading-snug text-turquoise-700 dark:text-turquoise-400">
                {product.recommendReasonDetail}
              </p>
            )}
          {!compact && nextPromo && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium leading-snug",
                nextPromo.unlocked
                  ? "text-turquoise-700 dark:text-turquoise-400"
                  : "text-coral-600 dark:text-coral-400"
              )}
            >
              {nextPromo.unlocked
                ? `✓ ${nextPromo.promotion.badgeLabel}`
                : `Brakuje Ci ${formatPrice(nextPromo.remaining)} do ${
                    nextPromo.promotion.rewardType === "cart_discount_percent"
                      ? `rabatu −${nextPromo.promotion.discountPercent}%`
                      : "gratisu"
                  }`}
            </p>
          )}
        </CardHeader>

        <CardContent className="mt-auto space-y-3 pb-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              {showDiscounted ? (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">
                    Cena katalogowa netto
                  </p>
                  {/* Jak w Excelu: stara cena przekreślona, nowa pogrubiona, oszczędność w nawiasie */}
                  <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/70">
                    {formatPrice(product.priceNet)}
                    <span className="text-xs"> /{product.unit}</span>
                  </p>
                  <p className="text-lg font-bold text-turquoise-700 dark:text-turquoise-400">
                    {formatPrice(yourPrice)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{product.unit}
                    </span>
                  </p>
                  {savingsLabel && (
                    <p className="text-xs font-medium text-coral-600 dark:text-coral-400">
                      {savingsLabel}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Cena katalogowa netto
                  </p>
                  <p className="text-lg font-semibold text-navy-900 dark:text-white">
                    {formatPrice(product.priceNet)}
                    <span className="text-xs font-normal text-muted-foreground">
                      /{product.unit}
                    </span>
                  </p>
                  {hasDiscount && savingsLabel && (
                    <p className="text-[10px] text-muted-foreground">
                      Z rabatem:{" "}
                      <span className="font-semibold text-turquoise-700 dark:text-turquoise-400">
                        {formatPrice(yourPrice)}
                      </span>{" "}
                      <span className="text-coral-600">({savingsLabel})</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            <StockBadge stock={product.stock} />
          </div>

          {!compact && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className={cn(
                  "min-w-0 flex-1",
                  justAdded
                    ? "bg-green-600 hover:bg-green-600"
                    : "bg-turquoise-500 hover:bg-turquoise-600"
                )}
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                {justAdded ? (
                  <>
                    <Check className="size-4" />
                    Dodano!
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
                  "shrink-0",
                  favorite &&
                    "border-coral-500/40 bg-coral-500/10 text-coral-600 hover:bg-coral-500/15"
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
                <span className="sr-only sm:not-sr-only sm:inline">
                  {favorite ? "W ulubionych" : "Ulubione"}
                </span>
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
