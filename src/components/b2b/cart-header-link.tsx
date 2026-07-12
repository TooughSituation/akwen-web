"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

export function CartHeaderLink() {
  const { totalItems, isHydrated } = useCart();

  return (
    <Link
      href="/b2b/koszyk"
      className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={`Koszyk, ${isHydrated ? totalItems : 0} produktów`}
    >
      <ShoppingCart className="size-5" />
      {isHydrated && totalItems > 0 && (
        <span
          className={cn(
            "absolute -top-1 -right-1 flex size-5 items-center justify-center",
            "rounded-full bg-coral-500 text-[10px] font-bold text-white"
          )}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}