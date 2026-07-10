import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lithuanianBrands, aboutText } from "@/lib/content";

export default function ProduktyPage() {
  return (
    <>
      <PageHeader
        label="Produkty litewskie"
        title="Produkty litewskie"
        description="Specjalizujemy się w dostarczaniu na rynek polski wyrobów rybnych wiodących producentów litewskich."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-muted-foreground">
          {aboutText.paragraphs[1]}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {lithuanianBrands.map((brand) => (
            <Card
              key={brand.name}
              className="border-l-4 border-l-turquoise-500 transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-xl">{brand.name}</CardTitle>
                  <Badge className="bg-turquoise-500/10 text-turquoise-700 dark:text-turquoise-300">
                    {brand.role}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {brand.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}