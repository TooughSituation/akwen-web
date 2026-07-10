import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { company } from "@/lib/content";
import { WaveDivider } from "@/components/wave-divider";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1920&q=80"
        alt="Fale morskie"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-900/75 to-turquoise-600/30" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-20 top-20 size-96 rounded-full bg-turquoise-500 blur-3xl" />
        <div className="absolute -right-20 bottom-20 size-80 rounded-full bg-turquoise-400 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-turquoise-300">
          {company.heroSubtitle}
        </p>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {company.slogan}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ocean-100 sm:text-xl">
          Dystrybucja ryb i przetworów rybnych od 1991 roku.
          Północno-wschodnia Polska i województwo mazowieckie.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-turquoise-500 text-white hover:bg-turquoise-400"
            render={<Link href="/oferta" />}
          >
            Poznaj naszą ofertę
            <ArrowRight />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            render={<Link href="/b2b" />}
          >
            Przejdź do platformy B2B
            <ExternalLink />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WaveDivider variant="light" />
      </div>
    </section>
  );
}