import Link from "next/link";
import {
  Snowflake,
  Flame,
  Package,
  Fish,
  ArrowRight,
  Award,
  ExternalLink,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { WaveDivider } from "@/components/wave-divider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  aboutText,
  offerCategories,
  lithuanianBrands,
  awards,
  company,
} from "@/lib/content";

const offerIcons = {
  snowflake: Snowflake,
  flame: Flame,
  package: Package,
  fish: Fish,
} as const;

export default function Home() {
  return (
    <>
      <Hero />

      {/* O nas – skrót */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          label="O nas"
          title={aboutText.headline}
          description={aboutText.since}
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4 text-muted-foreground">
            <p>{aboutText.paragraphs[0]}</p>
            <p>{aboutText.paragraphs[1]}</p>
            <p>
              Należymy do{" "}
              <strong className="text-foreground">Polskiej Grupy Rybnej (PGR)</strong>.
              Promujemy markę{" "}
              <strong className="text-foreground">BMC</strong> – konserwy rybne,
              łososia w plasterkach i słoiki ze szprotkami.
            </p>
          </div>
          <div className="space-y-3">
            {awards.map((award) => (
              <div
                key={award}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                <Award className="size-5 shrink-0 text-turquoise-600" />
                <span className="text-sm font-medium">{award}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" render={<Link href="/o-nas" />}>
            Czytaj więcej o Akwen
            <ArrowRight />
          </Button>
        </div>
      </section>

      <WaveDivider variant="turquoise" />

      {/* Oferta */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            label="Oferta"
            title="Kompleksowa dystrybucja produktów rybnych"
            description="Bezpośrednia współpraca z producentami, importerami i lokalnymi dostawcami."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offerCategories.map((item) => {
              const Icon = offerIcons[item.icon];
              return (
                <Card
                  key={item.title}
                  className="border-border/60 transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-navy-900 text-white dark:bg-turquoise-600">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Button render={<Link href="/oferta" />}>
              Pełna oferta
              <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      {/* Produkty litewskie */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          label="Produkty litewskie"
          title="Wiodący producenci z Litwy"
          description="Jesteśmy wyłącznym dystrybutorem Dauparų žuvis i Norvelita. Dystrybuujemy również Vičiūnai Group oraz ICECO žuvis."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {lithuanianBrands.map((brand) => (
            <Card
              key={brand.name}
              className="overflow-hidden border-turquoise-500/20 transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl">{brand.name}</CardTitle>
                  <Badge
                    variant="secondary"
                    className="shrink-0 bg-turquoise-500/10 text-turquoise-600"
                  >
                    {brand.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {brand.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button variant="outline" render={<Link href="/produkty" />}>
            Wszystkie produkty litewskie
            <ArrowRight />
          </Button>
        </div>
      </section>

      {/* CTA B2B */}
      <section className="maritime-gradient px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            label="Dla partnerów handlowych"
            title="Platforma B2B Akwen"
            description="Wkrótce dostępna dla naszych partnerów handlowych. Zamawiaj online, śledź dostawy i zarządzaj zamówieniami."
            light
          />
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-turquoise-500 text-white hover:bg-turquoise-400"
              render={<Link href="/b2b" />}
            >
              Przejdź do platformy B2B
              <ExternalLink />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              render={<Link href="/kontakt" />}
            >
              Skontaktuj się z działem handlowym
            </Button>
          </div>
          <p className="mt-6 text-sm text-ocean-200">
            {company.contact.email} · {company.contact.mobile}
          </p>
        </div>
      </section>
    </>
  );
}