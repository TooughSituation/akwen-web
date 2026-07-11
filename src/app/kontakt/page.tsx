import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { company, aboutText, assets } from "@/lib/content";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function KontaktPage() {
  return (
    <>
      <PageHeader
        label="Kontakt"
        title="Skontaktuj się z nami"
        description={aboutText.coverage}
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-turquoise-600" />
                Adres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{company.name}</p>
              <p>{company.address.street}</p>
              <p>{company.address.city}</p>
              <p className="pt-2 text-sm">
                NIP: {company.nip}<br />
                KRS: {company.krs}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="size-5 text-turquoise-600" />
                Dział Handlowy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Mobile: </span>
                <a href={`tel:${company.contact.mobile.replace(/\s/g, "")}`} className="hover:text-turquoise-600">
                  {company.contact.mobile}
                </a>
              </p>
              <p>
                <span className="font-medium text-foreground">Tel.: </span>
                {company.contact.tel1}
              </p>
              <p>
                <span className="font-medium text-foreground">Tel.: </span>
                {company.contact.tel2}
              </p>
              <p>
                <span className="font-medium text-foreground">Biuro: </span>
                {company.contact.office}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5 text-turquoise-600" />
                E-mail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`mailto:${company.contact.email}`}
                className="text-lg font-medium text-turquoise-600 hover:underline"
              >
                {company.contact.email}
              </a>
            </CardContent>
          </Card>

          <Card className="border-turquoise-500/30 bg-turquoise-500/5">
            <CardHeader>
              <CardTitle>Platforma B2B</CardTitle>
              <CardDescription>
                Wkrótce dostępna dla naszych partnerów handlowych.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button render={<Link href="/b2b" />}>
                Przejdź do platformy B2B
                <ExternalLink />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-border bg-muted/30 p-8">
          <Image
            src={assets.map}
            alt="Mapa zasięgu działania Akwen — północno-wschodnia Polska"
            width={480}
            height={430}
            className="h-auto w-full max-w-md"
          />
          <p className="max-w-xl text-center text-muted-foreground">
            {aboutText.coverage}
          </p>
        </div>
      </section>
    </>
  );
}