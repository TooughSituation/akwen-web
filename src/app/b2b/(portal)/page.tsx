import Link from "next/link";
import {
  Package,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  Truck,
} from "lucide-react";
import { DashboardHeader } from "@/components/b2b/dashboard-header";
import { CartCountBadge } from "@/components/b2b/cart-count-badge";
import { OpenOrdersCountBadge } from "@/components/b2b/open-orders-count-badge";
import { ProductCard } from "@/components/b2b/product-card";
import { PriceModeToggle } from "@/components/b2b/price-mode-toggle";
import { MotionCard, MotionFade } from "@/components/motion-fade";
import { getProductCatalog, getRecommendedProducts } from "@/lib/b2b/products";
import { RECOMMENDED_SECTION_HINT } from "@/lib/b2b/recommend";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function B2BDashboardPage() {
  const catalog = getProductCatalog();
  const recommended = getRecommendedProducts(6);
  const inStockCount = catalog.products.filter((p) => p.stock > 0).length;

  const stats = [
    {
      label: "Produkty w katalogu",
      value: catalog.totalCount.toString(),
      icon: Package,
      hint: `${catalog.tags.tag1List.length} kategorii`,
    },
    {
      label: "Dostępne na magazynie",
      value: inStockCount.toString(),
      icon: TrendingUp,
      hint: `${Math.round((inStockCount / catalog.totalCount) * 100)}% asortymentu`,
    },
    {
      label: "Otwarte zamówienia",
      value: "orders",
      icon: ClipboardList,
      hint: "Nowe i w realizacji",
    },
    {
      label: "Pozycje w koszyku",
      value: "cart",
      icon: ShoppingCart,
      hint: "Gotowe do wysłania",
    },
  ];

  const quickActions = [
    {
      title: "Przeglądaj katalog",
      description: `${catalog.totalCount} produktów z aktualnymi cenami hurtowymi`,
      href: "/b2b/katalog",
      icon: Package,
    },
    {
      title: "Powtórz zamówienie",
      description: "Szybko zamów ostatni asortyment",
      href: "/b2b/zamowienia",
      icon: ClipboardList,
    },
    {
      title: "Śledź dostawę",
      description: "Sprawdź status transportu chłodniczego",
      href: "/b2b/zamowienia",
      icon: Truck,
    },
  ];

  return (
    <>
      <DashboardHeader />

      <div className="b2b-page">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <MotionFade key={stat.label} delay={0.04 * i}>
                <Card className="b2b-card h-full border-border/55 hover:shadow-md hover:shadow-navy-900/[0.04]">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardDescription className="text-xs font-medium tracking-wide uppercase">
                      {stat.label}
                    </CardDescription>
                    <Icon className="size-4 text-turquoise-600/80" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-semibold tracking-tight text-navy-900 dark:text-white">
                      {stat.value === "cart" ? (
                        <CartCountBadge />
                      ) : stat.value === "orders" ? (
                        <OpenOrdersCountBadge />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {stat.hint}
                    </p>
                  </CardContent>
                </Card>
              </MotionFade>
            );
          })}
        </div>

        <section className="space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                Polecane dla Ciebie
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {catalog.recommendedCount} pozycji w cenniku ·{" "}
                {RECOMMENDED_SECTION_HINT}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PriceModeToggle size="sm" />
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                render={<Link href="/b2b/katalog?widok=proponowane" />}
              >
                Wszystkie proponowane
                <ArrowRight />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                render={<Link href="/b2b/katalog" />}
              >
                Cały katalog
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {recommended.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            Szybkie akcje
          </h2>
          <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <MotionCard key={action.title} delay={0.05 * i}>
                  <Link href={action.href} className="block h-full">
                    <Card className="b2b-card h-full border-border/55 hover:border-turquoise-500/20 hover:shadow-md hover:shadow-navy-900/[0.05]">
                      <CardHeader className="space-y-3 p-6 sm:p-7">
                        <div className="flex size-11 items-center justify-center rounded-full bg-turquoise-500/10">
                          <Icon className="size-5 text-turquoise-600" />
                        </div>
                        <CardTitle className="text-base font-semibold tracking-tight">
                          {action.title}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {action.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </MotionCard>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
