"use client";

import Link from "next/link";
import { Heart, LogOut, Star } from "lucide-react";
import { signOut } from "next-auth/react";
import { useFavorites } from "@/contexts/favorites-context";
import { useLoyalty } from "@/contexts/loyalty-context";
import { useProfile } from "@/contexts/profile-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CartHeaderLink } from "@/components/b2b/cart-header-link";
import { GlobalSearch } from "@/components/b2b/global-search";
import { LiveChatHeaderButton } from "@/components/b2b/live-chat";
import { cn } from "@/lib/utils";

interface B2BHeaderProps {
  title: string;
  description?: string;
}

export function B2BHeader({ title, description }: B2BHeaderProps) {
  const { customer } = useProfile();
  const { balance, isHydrated: loyaltyHydrated } = useLoyalty();
  const { count: favoritesCount, isHydrated: favoritesHydrated } =
    useFavorites();

  return (
    <header className="border-b border-border/70 bg-card/80 px-5 py-6 backdrop-blur-sm sm:px-8 sm:py-8 lg:px-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <GlobalSearch className="hidden min-w-[220px] flex-1 md:block lg:min-w-[300px]" />

            <CartHeaderLink />

            <Link
              href="/b2b/katalog?widok=ulubione"
              data-tour="header-favorites"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2 py-2 text-xs font-medium text-coral-600 transition-colors hover:bg-coral-500/10 sm:px-2.5"
              title="Ulubione produkty"
            >
              <Heart
                className={cn(
                  "size-3.5",
                  favoritesHydrated &&
                    favoritesCount > 0 &&
                    "fill-coral-500 text-coral-500"
                )}
              />
              {favoritesHydrated ? favoritesCount : "…"}
            </Link>

            <Link
              href="/b2b/moje-dane"
              data-tour="header-loyalty"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2 py-2 text-xs font-medium text-turquoise-700 transition-colors hover:bg-turquoise-500/10 sm:px-2.5 dark:text-turquoise-400"
              title="Program lojalnościowy"
            >
              <Star className="size-3.5" />
              {loyaltyHydrated ? `${balance} pkt` : "…"}
            </Link>

            <LiveChatHeaderButton />

            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-2 py-1.5 sm:gap-3 sm:px-3 sm:py-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-turquoise-500 text-sm font-semibold text-white">
                {customer.companyName.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="max-w-[140px] truncate text-sm font-medium text-foreground lg:max-w-[180px]">
                  {customer.companyName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {customer.contactPerson}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="hidden bg-turquoise-500/10 text-turquoise-600 md:inline-flex"
              >
                -{customer.discountPercent}%
              </Badge>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() =>
                signOut({ callbackUrl: "/b2b/login" })
              }
              title="Wyloguj"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Wyloguj</span>
            </Button>
          </div>
        </div>

        <GlobalSearch fullWidth className="block w-full md:hidden" />
      </div>
    </header>
  );
}
