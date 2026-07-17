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

/**
 * Header publiczny — zawsze ciemny granat (czytelny tekst/logo).
 * Przy scrollu: nieco gęstsze tło + cień.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        /* Zawsze brand granat #001F3F — czytelny kontrast na / */
        scrolled
          ? "border-black/20 bg-[#001428] shadow-lg shadow-black/30 backdrop-blur-md"
          : "border-white/10 bg-[#001F3F] shadow-md shadow-black/20"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-[4.75rem] sm:px-8 lg:px-10">
        <Link
          href="/"
          className="relative flex h-10 shrink-0 items-center sm:h-11"
        >
          {/*
            Źródło 3× (logo-white-2x.png) + unoptimized — bez downscale Next,
            żeby logo nie było rozmyte na retina. Wyświetlane ~40–44px wysokości.
          */}
          <Image
            src="/images/logo-white-2x.png"
            alt="Akwen"
            width={220}
            height={40}
            priority
            unoptimized
            quality={100}
            sizes="(max-width: 640px) 160px, 200px"
            className="h-full w-auto max-w-[min(52vw,200px)] object-contain object-left [image-rendering:-webkit-optimize-contrast] [filter:contrast(1.08)_brightness(1.04)]"
          />
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3.5 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white",
                pathname === item.href && "bg-white/15 text-white"
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
          <ThemeToggle className="text-white/85 hover:bg-white/10 hover:text-white" />
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/90 hover:bg-white/10 lg:hidden"
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
                    src="/images/logo-white-2x.png"
                    alt="Akwen"
                    width={180}
                    height={36}
                    unoptimized
                    quality={100}
                    className="h-9 w-auto object-contain [image-rendering:-webkit-optimize-contrast] [filter:contrast(1.08)_brightness(1.04)]"
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
