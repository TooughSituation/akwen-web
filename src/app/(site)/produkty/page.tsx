import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { lithuanianBrands, aboutText, assets, lithuanianIntro } from "@/lib/content";

export default function ProduktyPage() {
  return (
    <>
      <PageHeader
        label="Produkty litewskie"
        title="Produkty litewskie"
        description="Specjalizujemy się w dostarczaniu na rynek polski wyrobów rybnych wiodących producentów litewskich."
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-muted-foreground">{aboutText.paragraphs[1]}</p>
            <p className="mt-4 text-muted-foreground">{lithuanianIntro}</p>

            <div className="mt-10 grid gap-6">
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
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="flex justify-center">
              <Image
                src={assets.ornaments.up}
                alt=""
                width={383}
                height={27}
                className="mb-4 h-auto w-48 opacity-60"
                aria-hidden
              />
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-lg overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={assets.lithuanianProducts}
                alt="Produkty litewskie Akwen"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex justify-center">
              <Image
                src={assets.ornaments.down}
                alt=""
                width={382}
                height={27}
                className="mt-4 h-auto w-48 opacity-60"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}