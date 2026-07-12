import Link from "next/link";
import {
  Package,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  Truck,
} from "lucide-react";
import { B2BHeader } from "@/components/b2b/b2b-header";
import { CartCountBadge } from "@/components/b2b/cart-count-badge";
import { ProductCard } from "@/components/b2b/product-card";
import { getMockCustomer } from "@/lib/b2b/auth";
import { getFeaturedProducts, getProductCatalog } from "@/lib/b2b/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function B2BDashboardPage() {
  const customer = getMockCustomer();
  const catalog = getProductCatalog();
  const featured = getFeaturedProducts(6);

  const inStockCount = catalog.products.filter((p) => p.stock > 0).length;
  const categoryCount = catalog.categories.filter((c) =>
    catalog.products.some((p) => p.category.id === c.id)
  ).length;

  const stats = [
    {
      label: "Produkty w katalogu",
      value: catalog.totalCount.toString(),
      icon: Package,
      hint: `${categoryCount} kategorii`,
    },
    {
      label: "Dostępne na magazynie",
      value: inStockCount.toString(),
      icon: TrendingUp,
      hint: `${Math.round((inStockCount / catalog.totalCount) * 100)}% asortymentu`,
    },
    {
      label: "Otwarte zamówienia",
      value: "2",
      icon: ClipboardList,
      hint: "W realizacji",
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
      <B2BHeader
        customer={customer}
        title={`Witaj, ${customer.contactPerson.split(" ")[0]}!`}
        description={`${customer.companyName} · Panel partnera handlowego Akwen`}
      />

      <div className="space-y-8 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                  <Icon className="size-4 text-turquoise-600" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-navy-900 dark:text-white">
                    {stat.value === "cart" ? <CartCountBadge /> : stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold">
                Polecane produkty
              </h2>
              <p className="text-sm text-muted-foreground">
                Największy stan magazynowy – gotowe do natychmiastowej wysyłki
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/b2b/katalog" />}
            >
              Cały katalog
              <ArrowRight />
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-xl font-semibold">
            Szybkie akcje
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} href={action.href}>
                  <Card className="h-full border-border/60 transition-shadow hover:shadow-md">
                    <CardHeader>
                      <Icon className="size-6 text-turquoise-600" />
                      <CardTitle className="mt-2 text-base">
                        {action.title}
                      </CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}