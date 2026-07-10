import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { offerCategories, aboutText } from "@/lib/content";
import { Snowflake, Flame, Package, Fish } from "lucide-react";

const offerIcons = {
  snowflake: Snowflake,
  flame: Flame,
  package: Package,
  fish: Fish,
} as const;

export default function OfertaPage() {
  return (
    <>
      <PageHeader
        label="Oferta"
        title="Nasza oferta"
        description="Dystrybucja ryb i przetworów rybnych na terenie północno-wschodniej Polski oraz części województwa mazowieckiego."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-muted-foreground">
          {aboutText.paragraphs[0]}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {offerCategories.map((item) => {
            const Icon = offerIcons[item.icon];
            return (
              <Card key={item.title} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-navy-900 text-white dark:bg-turquoise-600">
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-10 bg-muted/30">
          <CardHeader>
            <CardTitle>Marka BMC – Polska Grupa Rybna</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {aboutText.paragraphs[2]}
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}