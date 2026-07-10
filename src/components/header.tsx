"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Strona główna" },
  { href: "/o-nas", label: "O nas" },
  { href: "/oferta", label: "Oferta" },
  { href: "/produkty", label: "Produkty litewskie" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="flex size-9 items-center justify-center rounded-lg bg-navy-900 text-white dark:bg-turquoise-600">
            <Fish className="size-5" />
          </div>
          <span className="text-lg text-navy-900 dark:text-foreground">Akwen</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                pathname === item.href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="hidden border-turquoise-500/40 text-turquoise-600 hover:bg-turquoise-500/10 md:inline-flex"
            render={<Link href="/b2b" />}
          >
            Platforma B2B
          </Button>
          <ThemeToggle />

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" />}
            >
              <Menu className="size-5" />
              <span className="sr-only">Otwórz menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Fish className="size-5 text-turquoise-600" />
                  Akwen
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                      pathname === item.href
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/b2b"
                  className="mt-2 rounded-md border border-turquoise-500/40 px-3 py-2.5 text-center text-sm font-medium text-turquoise-600 hover:bg-turquoise-500/10"
                >
                  Platforma B2B
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}