import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aboutText, awards } from "@/lib/content";
import { Award, MapPin } from "lucide-react";

export default function ONasPage() {
  return (
    <>
      <PageHeader
        label="Akwen"
        title="O nas"
        description={aboutText.since}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
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
          <div className="mt-4 flex flex-wrap gap-2">
            {awards.map((award) => (
              <Badge
                key={award}
                variant="secondary"
                className="gap-1.5 bg-turquoise-500/10 px-3 py-1.5 text-turquoise-700 dark:text-turquoise-300"
              >
                <Award className="size-3.5" />
                {award}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}