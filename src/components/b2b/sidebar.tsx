"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  UserCircle,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";

export const navItems = [
  { href: "/b2b", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/b2b/katalog", label: "Katalog", icon: Package },
  { href: "/b2b/koszyk", label: "Koszyk", icon: ShoppingCart },
  { href: "/b2b/zamowienia", label: "Moje zamówienia", icon: ClipboardList },
  { href: "/b2b/moje-dane", label: "Moje dane", icon: UserCircle },
];

interface B2BSidebarContentProps {
  onNavigate?: () => void;
}

export function B2BSidebarContent({ onNavigate }: B2BSidebarContentProps) {
  const pathname = usePathname();
  const { totalItems, isHydrated } = useCart();

  return (
    <>
      <div className="border-b border-navy-800/50 px-5 py-5">
        <Link href="/b2b" className="flex items-center gap-3" onClick={onNavigate}>
          <Image
            src="/images/logo-white.png"
            alt="Akwen B2B"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <p className="mt-2 text-xs font-medium tracking-wide text-turquoise-300 uppercase">
          Portal hurtowy
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-turquoise-500/20 text-white"
                  : "text-ocean-100 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/b2b/koszyk" && isHydrated && totalItems > 0 && (
                <span className="rounded-full bg-coral-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-navy-800/50 p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ocean-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-4" />
          Strona publiczna
        </Link>
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void signOut({ callbackUrl: "/b2b/login" });
          }}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ocean-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" />
          Wyloguj
        </button>
      </div>
    </>
  );
}

export function B2BSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-800/50 bg-navy-900 text-white lg:flex">
      <B2BSidebarContent />
    </aside>
  );
}