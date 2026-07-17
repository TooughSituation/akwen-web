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
import { MotionFade } from "@/components/motion-fade";
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
        className="relative overflow-hidden section-pad"
        style={{
          backgroundImage: `url(${assets.bgMap})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-background/90" />
        <div className="content-width relative">
          <MotionFade>
            <SectionHeading
              label="O nas"
              title={aboutText.headline}
              description={aboutText.since}
            />
          </MotionFade>
          <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
            <MotionFade delay={0.08} className="space-y-5 text-muted-foreground">
              <p>{aboutText.paragraphs[0]}</p>
              <p>{aboutText.paragraphs[1]}</p>
              <p className="hidden sm:block">{aboutText.paragraphs[2]}</p>
              <p className="hidden md:block">{aboutText.paragraphs[3]}</p>
            </MotionFade>
            <MotionFade delay={0.15} className="space-y-8">
              <div className="flex flex-wrap items-center justify-center gap-8 sm:justify-start">
                {awards.map((award) => (
                  <div
                    key={award.label}
                    className="flex flex-col items-center gap-3"
                  >
                    <Image
                      src={award.image}
                      alt={award.alt}
                      width={award.image.includes("po-ryby") ? 200 : 120}
                      height={80}
                      className="h-auto max-h-14 w-auto object-contain opacity-90"
                    />
                    <span className="max-w-[140px] text-center text-[11px] leading-snug text-muted-foreground">
                      {award.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm">
                <p className="text-sm leading-[1.75] text-muted-foreground">
                  {aboutText.poRyby}
                </p>
              </div>
            </MotionFade>
          </div>
          <MotionFade delay={0.2} className="mt-14 text-center">
            <Button
              variant="outline"
              className="h-11 rounded-full px-6"
              render={<Link href="/o-nas" />}
            >
              Czytaj więcej o Akwen
              <ArrowRight />
            </Button>
          </MotionFade>
        </div>
      </section>

      <WaveDivider variant="turquoise" />

      {/* Oferta — duże zdjęcia, mniej tekstu */}
      <section className="bg-muted/40 section-pad">
        <div className="content-width">
          <MotionFade>
            <SectionHeading
              label="Oferta"
              title="Kompleksowa dystrybucja produktów rybnych"
              description="Bezpośrednia współpraca z producentami, importerami i lokalnymi dostawcami."
            />
          </MotionFade>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {offerCategories.map((item, index) => {
              const Icon = offerIcons[item.icon];
              return (
                <MotionFade key={item.title} delay={0.05 * index}>
                  <Card className="group h-full overflow-hidden border-border/50 bg-card p-0 shadow-none transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/5">
                    <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-navy-900/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md">
                        <Icon className="size-5" />
                      </div>
                    </div>
                    <CardHeader className="space-y-2 px-5 pt-5 pb-2">
                      <CardTitle className="text-lg font-semibold tracking-tight">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-6">
                      <CardDescription className="line-clamp-3 text-sm leading-[1.7]">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </MotionFade>
              );
            })}
          </div>
          <MotionFade delay={0.2} className="mt-14 text-center">
            <Button className="h-11 rounded-full px-8" render={<Link href="/oferta" />}>
              Pełna oferta
              <ArrowRight />
            </Button>
          </MotionFade>
        </div>
      </section>

      {/* Produkty litewskie */}
      <section className="content-width section-pad">
        <MotionFade className="flex justify-center">
          <Image
            src={assets.ornaments.up}
            alt=""
            width={383}
            height={27}
            className="mb-8 h-auto w-40 opacity-40 sm:w-52"
            aria-hidden
          />
        </MotionFade>
        <MotionFade>
          <SectionHeading
            label="Produkty litewskie"
            title="Wiodący producenci z Litwy"
            description={lithuanianIntro}
          />
        </MotionFade>
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionFade>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-navy-900/10">
              <Image
                src={assets.lithuanianProducts}
                alt="Produkty litewskie Akwen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </MotionFade>
          <div className="grid gap-5 sm:grid-cols-2">
            {lithuanianBrands.map((brand, index) => (
              <MotionFade key={brand.name} delay={0.06 * index}>
                <Card className="h-full border-border/50 bg-card/80 shadow-none transition-all duration-300 hover:border-turquoise-500/25 hover:shadow-lg hover:shadow-navy-900/5">
                  <CardHeader className="space-y-3 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold tracking-tight">
                        {brand.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="shrink-0 bg-turquoise-500/10 text-[10px] font-medium text-turquoise-600"
                      >
                        {brand.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-4 text-sm leading-[1.7]">
                      {brand.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </MotionFade>
            ))}
          </div>
        </div>
        <MotionFade className="mt-14 flex flex-col items-center gap-8">
          <Image
            src={assets.ornaments.down}
            alt=""
            width={382}
            height={27}
            className="h-auto w-40 opacity-40 sm:w-52"
            aria-hidden
          />
          <Button
            variant="outline"
            className="h-11 rounded-full px-6"
            render={<Link href="/produkty" />}
          >
            Wszystkie produkty litewskie
            <ArrowRight />
          </Button>
        </MotionFade>
      </section>

      {/* CTA B2B */}
      <section className="maritime-gradient section-pad text-white">
        <MotionFade className="mx-auto max-w-2xl text-center">
          <SectionHeading
            label="Dla partnerów handlowych"
            title="Platforma B2B Akwen"
            description="Zamawiaj online, śledź promocje i zarządzaj zamówieniami w spokojnym, nowoczesnym portalu."
            light
          />
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full bg-coral-500/95 px-8 text-white hover:bg-coral-400"
              render={<Link href="/b2b" />}
            >
              Przejdź do portalu B2B
              <ExternalLink />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/30 bg-white/5 px-8 text-white hover:bg-white/12 hover:text-white"
              render={<Link href="/kontakt" />}
            >
              Kontakt handlowy
            </Button>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-white/55">
            {company.b2bNote}
          </p>
          <p className="mt-2 text-sm text-white/55">
            {company.contact.email} · {company.contact.mobile}
          </p>
        </MotionFade>
      </section>
    </>
  );
}
