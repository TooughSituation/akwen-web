"use client";

/**
 * Panel szczegółów produktu — Sheet z prawej (~1/3 ekranu).
 * Otwierany kliknięciem w kafelek katalogu (poza przyciskami).
 */

import { useState } from "react";
import { Check, Heart, Package, Sparkles } from "lucide-react";
import type { B2BProduct } from "@/lib/b2b/types";
import { formatCategoryLabel, formatKindLabel } from "@/lib/b2b/labels";
import {
  applyDiscount,
  formatDiscountSavingsLabel,
  formatPrice,
} from "@/lib/b2b/format";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { usePriceDisplay } from "@/contexts/price-display-context";
import { useProfile } from "@/contexts/profile-context";
import { ProductImage } from "@/components/b2b/product-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface ProductDetailSheetProps {
  product: B2BProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function StockLine({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <span className="font-medium text-muted-foreground">Brak na magazynie</span>
    );
  }
  if (stock < 20) {
    return (
      <span className="font-medium text-coral-600">
        Niski stan · {stock} {stock === 1 ? "szt." : "szt."}
      </span>
    );
  }
  return (
    <span className="font-medium text-turquoise-700 dark:text-turquoise-400">
      {stock} szt. dostępne
    </span>
  );
}

export function ProductDetailSheet({
  product,
  open,
  onOpenChange,
}: ProductDetailSheetProps) {
  const { addItem } = useCart();
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

  function handleAddToCart() {
    if (product.stock <= 0) return;
    addItem(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  function handleToggleFavorite() {
    toggleFavorite(product.id);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          // ~1/3 szerokości na desktopie; pełna szerokość na mobile
          "w-full gap-0 overflow-y-auto p-0 sm:max-w-none sm:w-1/2 lg:w-1/3",
          "data-[side=right]:sm:max-w-none"
        )}
      >
        {/* Duże zdjęcie */}
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted/30">
          <ProductImage
            imageUrl={product.imageUrl}
            name={product.name}
            tag1={product.tag1}
            tag2={product.tag2}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {categoryLabel && (
              <Badge
                variant="secondary"
                className="bg-navy-900/75 text-xs text-white backdrop-blur-md"
              >
                {categoryLabel}
              </Badge>
            )}
            {product.isRecommended && (
              <Badge className="bg-coral-500/90 text-xs text-white backdrop-blur-md">
                <Sparkles className="mr-0.5 size-3" />
                Polecane
              </Badge>
            )}
          </div>
        </div>

        <SheetHeader className="space-y-2 border-b border-border/60 px-5 py-4 text-left">
          <SheetTitle className="text-lg leading-snug font-semibold tracking-tight text-navy-900 dark:text-foreground sm:text-xl">
            {product.name}
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Symbol: <span className="font-medium text-foreground">{product.symbol}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-5 py-4">
          {/* Meta: producent, tagi */}
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Producent
              </dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {product.producer || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Stan magazynowy
              </dt>
              <dd className="mt-0.5">
                <StockLine stock={product.stock} />
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Tag 1
              </dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {categoryLabel || product.tag1 || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Tag 2
              </dt>
              <dd className="mt-0.5 font-medium text-foreground">
                {kindLabel || product.tag2 || "—"}
              </dd>
            </div>
          </dl>

          {/* Cena */}
          <div className="rounded-xl border border-border/60 bg-muted/25 p-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Cena netto
            </p>
            {showDiscounted ? (
              <div className="mt-1 space-y-0.5">
                <p className="text-sm text-muted-foreground line-through">
                  Katalogowa: {formatPrice(product.priceNet)} /{product.unit}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-turquoise-600 dark:text-turquoise-400">
                  Twoja: {formatPrice(yourPrice)}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    /{product.unit}
                  </span>
                </p>
                {savingsLabel && (
                  <p className="text-xs font-medium text-coral-600">
                    {savingsLabel} · rabat −{discountPercent}%
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-1 space-y-0.5">
                <p className="text-2xl font-semibold tracking-tight text-navy-900 dark:text-white">
                  {formatPrice(product.priceNet)}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">
                    /{product.unit}
                  </span>
                </p>
                {hasDiscount && (
                  <p className="text-sm text-muted-foreground">
                    Z rabatem (−{discountPercent}%):{" "}
                    <span className="font-medium text-turquoise-600">
                      {formatPrice(yourPrice)}
                    </span>
                    {savingsLabel ? ` · ${savingsLabel}` : ""}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Opis */}
          {product.description && (
            <div>
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Opis
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {product.recommendReason && (
            <div className="rounded-lg border border-coral-500/20 bg-coral-500/5 px-3 py-2 text-sm">
              <span className="font-medium text-coral-700 dark:text-coral-400">
                Polecane:
              </span>{" "}
              <span className="text-muted-foreground">
                {product.recommendReason}
                {product.recommendReasonDetail
                  ? ` — ${product.recommendReasonDetail}`
                  : ""}
              </span>
            </div>
          )}
        </div>

        <SheetFooter className="sticky bottom-0 border-t border-border/60 bg-popover/95 px-5 py-4 backdrop-blur-md sm:flex-row sm:gap-2">
          <Button
            className={cn(
              "h-11 min-w-0 flex-1 rounded-full font-medium",
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
                Dodano do koszyka
              </>
            ) : (
              <>
                <Package className="size-4" />
                Dodaj do koszyka
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-11 shrink-0 rounded-full px-4",
              favorite &&
                "border-coral-500/30 bg-coral-500/8 text-coral-600 hover:bg-coral-500/12"
            )}
            onClick={handleToggleFavorite}
            aria-pressed={favorite}
          >
            <Heart
              className={cn(
                "size-4",
                favorite && "fill-coral-500 text-coral-500"
              )}
            />
            {favorite ? "W ulubionych" : "Dodaj do ulubionych"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
