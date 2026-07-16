"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
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
  { href: "/dotacje", label: "Dotacje" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isTransparent
          ? "border-b border-white/10 bg-navy-900/20 backdrop-blur-sm"
          : "border-b border-navy-800/50 bg-navy-900/95 shadow-lg shadow-navy-950/20 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="relative flex shrink-0 items-center">
          <Image
            src="/images/logo-white.png"
            alt="Akwen"
            width={140}
            height={48}
            className="h-10 w-auto object-contain sm:h-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                isTransparent
                  ? "text-white/85 hover:bg-white/10 hover:text-white"
                  : "text-ocean-100 hover:bg-white/10 hover:text-white",
                pathname === item.href &&
                  (isTransparent
                    ? "bg-white/15 text-white"
                    : "bg-turquoise-500/20 text-white")
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="hidden bg-coral-500 text-white hover:bg-coral-400 md:inline-flex"
            render={<Link href="/b2b" />}
          >
            Portal B2B
          </Button>
          <ThemeToggle
            className={cn(
              isTransparent
                ? "text-white hover:bg-white/10 hover:text-white"
                : "text-ocean-100 hover:bg-white/10 hover:text-white"
            )}
          />
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "lg:hidden",
                    isTransparent
                      ? "text-white hover:bg-white/10"
                      : "text-ocean-100 hover:bg-white/10"
                  )}
                />
              }
            >
              <Menu className="size-5" />
              <span className="sr-only">Otwórz menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-navy-800 bg-navy-900">
              <SheetHeader>
                <SheetTitle>
                  <Image
                    src="/images/logo-white.png"
                    alt="Akwen"
                    width={120}
                    height={40}
                    className="h-9 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-white/10",
                      pathname === item.href
                        ? "bg-turquoise-500/20 text-white"
                        : "text-ocean-100"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/b2b"
                  className="mt-3 rounded-md bg-coral-500 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-coral-400"
                >
                  Portal B2B
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}