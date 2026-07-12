"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Package } from "lucide-react";
import type { B2BProduct } from "@/lib/b2b/types";
import { formatPrice } from "@/lib/b2b/format";
import { useCart } from "@/contexts/cart-context";
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
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const isExternalImage = product.imageUrl.startsWith("http");

  function handleAddToCart() {
    addItem(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/60 p-0 transition-shadow hover:shadow-lg",
        compact && "flex-row"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          compact ? "aspect-square w-28 shrink-0" : "aspect-[4/3] w-full"
        )}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes={compact ? "112px" : "(max-width: 768px) 50vw, 25vw"}
          unoptimized={isExternalImage}
        />
        <div className="absolute top-2 left-2">
          <Badge
            variant="secondary"
            className="bg-navy-900/80 text-[10px] text-white backdrop-blur-sm"
          >
            {product.category.label}
          </Badge>
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
        </CardHeader>

        <CardContent className="mt-auto space-y-3 pb-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Cena hurtowa netto</p>
              <p className="text-lg font-semibold text-navy-900 dark:text-white">
                {formatPrice(product.priceNet)}
                <span className="text-xs font-normal text-muted-foreground">
                  /{product.unit}
                </span>
              </p>
            </div>
            <StockBadge stock={product.stock} />
          </div>

          {!compact && (
            <Button
              size="sm"
              className={cn(
                "w-full",
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
                  Dodaj do koszyka
                </>
              )}
            </Button>
          )}
        </CardContent>
      </div>
    </Card>
  );
}