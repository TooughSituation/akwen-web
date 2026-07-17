import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aboutText, awards, assets } from "@/lib/content";
import { MapPin } from "lucide-react";

export default function ONasPage() {
  return (
    <>
      <PageHeader
        label="Akwen"
        title="O nas"
        description={aboutText.since}
      />
      <section
        className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${assets.bgMap})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-background/90" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-navy-900 dark:text-foreground">
            {aboutText.headline}
          </h2>

          <div className="mt-8 space-y-4 text-muted-foreground">
            {aboutText.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <Card className="mt-10 border-turquoise-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-turquoise-600" />
                Zasięg działalności
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{aboutText.coverage}</p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Projekt PO RYBY 2007–2013</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{aboutText.poRyby}</p>
            </CardContent>
          </Card>

          <div className="mt-10">
            <h3 className="text-lg font-semibold">Wyróżnienia i certyfikaty</h3>
            <div className="mt-6 flex flex-wrap items-start justify-start gap-8 sm:gap-10">
              {awards.map((award) => {
                const isOrzel = award.image.includes("orzeldystrybucji");
                const isPoRyby = award.image.includes("po-ryby");
                // Intrinsic sizes for Next/Image aspect ratio (orzel ~900×767)
                const width = isOrzel ? 180 : isPoRyby ? 220 : 160;
                const height = isOrzel ? 153 : 90;

                return (
                  <div
                    key={award.label}
                    className="flex w-[160px] flex-col items-center gap-3 sm:w-[180px]"
                  >
                    <div className="flex h-20 w-full items-center justify-center">
                      <Image
                        src={award.image}
                        alt={award.alt}
                        width={width}
                        height={height}
                        quality={90}
                        className="max-h-20 w-auto max-w-full object-contain"
                      />
                    </div>
                    <span className="max-w-[180px] text-center text-sm text-muted-foreground">
                      {award.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}