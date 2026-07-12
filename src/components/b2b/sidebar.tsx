"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardList,
  UserCircle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/b2b", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/b2b/katalog", label: "Katalog", icon: Package },
  { href: "/b2b/koszyk", label: "Koszyk", icon: ShoppingCart },
  { href: "/b2b/zamowienia", label: "Moje zamówienia", icon: ClipboardList },
  { href: "/b2b/moje-dane", label: "Moje dane", icon: UserCircle },
];

export function B2BSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-navy-800/50 bg-navy-900 text-white">
      <div className="border-b border-navy-800/50 px-5 py-5">
        <Link href="/b2b" className="flex items-center gap-3">
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
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-turquoise-500/20 text-white"
                  : "text-ocean-100 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-navy-800/50 p-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ocean-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-4" />
          Strona publiczna
        </Link>
      </div>
    </aside>
  );
}