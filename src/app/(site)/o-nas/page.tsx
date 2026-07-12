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
            <div className="mt-6 flex flex-wrap items-center gap-8">
              {awards.map((award) => (
                <div key={award.label} className="flex flex-col items-center gap-3">
                  <Image
                    src={award.image}
                    alt={award.alt}
                    width={award.image.includes("po-ryby") ? 220 : 140}
                    height={90}
                    className="h-auto max-h-20 w-auto object-contain"
                  />
                  <span className="max-w-[200px] text-center text-sm text-muted-foreground">
                    {award.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}