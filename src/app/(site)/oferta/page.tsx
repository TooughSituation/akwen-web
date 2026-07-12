import Image from "next/image";
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
              <Card
                key={item.title}
                className="group overflow-hidden p-0 transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-coral-500 text-white">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-xl text-white">{item.title}</CardTitle>
                  </div>
                </div>
                <CardContent className="pt-4">
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
            <p className="text-muted-foreground">{aboutText.paragraphs[2]}</p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}