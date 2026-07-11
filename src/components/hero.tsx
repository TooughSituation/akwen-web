import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { company } from "@/lib/content";
import { WaveDivider } from "@/components/wave-divider";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <Image
        src="/images/bg-hero.jpg"
        alt="Świeże ryby i owoce morza — produkty Akwen"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-900/80 to-navy-900/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-navy-950/20" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-28 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-left">
          <p className="font-display mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-turquoise-300">
            Dystrybutor ryb od 1991 roku
          </p>

          <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {company.heroTitle}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ocean-100 sm:text-xl">
            {company.heroSubtitle}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="bg-coral-500 px-8 text-white shadow-lg shadow-coral-500/25 hover:bg-coral-400"
              render={<Link href="/oferta" />}
            >
              Nasza oferta
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/50 bg-white/5 px-8 text-white backdrop-blur-sm hover:border-turquoise-300 hover:bg-turquoise-500/20 hover:text-white"
              render={<Link href="/b2b" />}
            >
              Przejdź do portalu B2B
              <ExternalLink />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WaveDivider variant="light" />
      </div>
    </section>
  );
}