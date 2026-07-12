import Image from "next/image";
import Link from "next/link";
import {
  Snowflake,
  Flame,
  Package,
  Fish,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { PartnerLogos } from "@/components/partner-logos";
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
  lithuanianIntro,
  awards,
  assets,
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
      <PartnerLogos />

      {/* O nas – skrót */}
      <section
        className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${assets.bgMap})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-background/85" />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            label="O nas"
            title={aboutText.headline}
            description={aboutText.since}
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="space-y-4 text-muted-foreground">
              <p>{aboutText.paragraphs[0]}</p>
              <p>{aboutText.paragraphs[1]}</p>
              <p>{aboutText.paragraphs[2]}</p>
              <p>{aboutText.paragraphs[3]}</p>
              <p>{aboutText.paragraphs[4]}</p>
            </div>
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-6">
                {awards.map((award) => (
                  <div key={award.label} className="flex flex-col items-center gap-2">
                    <Image
                      src={award.image}
                      alt={award.alt}
                      width={award.image.includes("po-ryby") ? 200 : 120}
                      height={80}
                      className="h-auto max-h-16 w-auto object-contain"
                    />
                    <span className="max-w-[160px] text-center text-xs text-muted-foreground">
                      {award.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {aboutText.poRyby}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" render={<Link href="/o-nas" />}>
              Czytaj więcej o Akwen
              <ArrowRight />
            </Button>
          </div>
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
                  className="group overflow-hidden border-border/60 p-0 transition-shadow hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-900/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-lg bg-coral-500 text-white">
                      <Icon className="size-5" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
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
        <div className="flex justify-center">
          <Image
            src={assets.ornaments.up}
            alt=""
            width={383}
            height={27}
            className="mb-6 h-auto w-48 opacity-60 sm:w-64"
            aria-hidden
          />
        </div>
        <SectionHeading
          label="Produkty litewskie"
          title="Wiodący producenci z Litwy"
          description={lithuanianIntro}
        />
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
            <Image
              src={assets.lithuanianProducts}
              alt="Produkty litewskie Akwen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {lithuanianBrands.map((brand) => (
              <Card
                key={brand.name}
                className="border-turquoise-500/20 transition-shadow hover:shadow-lg"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{brand.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      className="shrink-0 bg-turquoise-500/10 text-turquoise-600 text-[10px]"
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
        </div>
        <div className="flex justify-center">
          <Image
            src={assets.ornaments.down}
            alt=""
            width={382}
            height={27}
            className="mt-10 h-auto w-48 opacity-60 sm:w-64"
            aria-hidden
          />
        </div>
        <div className="mt-6 text-center">
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
              className="bg-coral-500 text-white hover:bg-coral-400"
              render={<Link href="/b2b" />}
            >
              Przejdź do portalu B2B
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
          <p className="mt-4 text-sm text-ocean-200">{company.b2bNote}</p>
          <p className="mt-2 text-sm text-ocean-200">
            {company.contact.email} · {company.contact.mobile}
          </p>
        </div>
      </section>
    </>
  );
}