import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { company } from "@/lib/content";
import { Clock, Mail, Phone, ShoppingCart, Truck, BarChart3 } from "lucide-react";

const plannedFeatures = [
  {
    icon: ShoppingCart,
    title: "Zamówienia online",
    description: "Składaj zamówienia hurtowe bezpośrednio przez platformę, 24/7.",
  },
  {
    icon: Truck,
    title: "Śledzenie dostaw",
    description: "Monitoruj status realizacji i transportu chłodniczego w czasie rzeczywistym.",
  },
  {
    icon: BarChart3,
    title: "Historia i raporty",
    description: "Przeglądaj historię zamówień i generuj raporty dla swojej firmy.",
  },
];

export default function B2BPage() {
  return (
    <>
      <PageHeader
        label="Platforma B2B"
        title="Platforma B2B Akwen"
        description="Wkrótce dostępna dla naszych partnerów handlowych."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Card className="border-turquoise-500/30 bg-turquoise-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clock className="size-6 text-turquoise-600" />
              <div>
                <CardTitle className="text-xl">Strona w przygotowaniu</CardTitle>
                <CardDescription className="mt-1 text-base">
                  Pracujemy nad platformą B2B, która ułatwi współpracę handlową.
                  Docelowo będzie dostępna pod adresem{" "}
                  <span className="font-medium text-foreground">
                    b2b.akwen.bialystok.pl
                  </span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <h2 className="mt-12 text-2xl font-bold">Planowane funkcje</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {plannedFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="size-8 text-turquoise-600" />
                <CardTitle className="mt-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Chcesz zostać partnerem?</CardTitle>
            <CardDescription>
              Skontaktuj się z działem handlowym – chętnie omówimy warunki współpracy.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4 text-turquoise-600" />
              {company.contact.mobile}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="size-4 text-turquoise-600" />
              {company.contact.email}
            </div>
            <Button className="sm:ml-auto" render={<Link href="/kontakt" />}>
              Przejdź do kontaktu
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}