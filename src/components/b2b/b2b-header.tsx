"use client";

import { Bell } from "lucide-react";
import { useProfile } from "@/contexts/profile-context";
import { Badge } from "@/components/ui/badge";
import { CartHeaderLink } from "@/components/b2b/cart-header-link";
import { GlobalSearch } from "@/components/b2b/global-search";

interface B2BHeaderProps {
  title: string;
  description?: string;
}

export function B2BHeader({ title, description }: B2BHeaderProps) {
  const { customer } = useProfile();

  return (
    <header className="border-b border-border bg-card px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <GlobalSearch className="hidden min-w-[240px] flex-1 md:block lg:min-w-[320px]" />

            <CartHeaderLink />

            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Powiadomienia"
            >
              <Bell className="size-5" />
            </button>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
              <div className="flex size-9 items-center justify-center rounded-full bg-turquoise-500 text-sm font-semibold text-white">
                {customer.companyName.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
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
          </div>
        </div>

        {/* Mobile: pełna szerokość pod tytułem — jak pasek filtrów w arkuszu */}
        <GlobalSearch fullWidth className="block w-full md:hidden" />
      </div>
    </header>
  );
}
