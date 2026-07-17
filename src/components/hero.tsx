"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { company } from "@/lib/content";
import { WaveDivider } from "@/components/wave-divider";

export function Hero() {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden sm:min-h-[92vh]">
      <Image
        src="/images/bg-hero.jpg"
        alt="Świeże ryby i owoce morza — produkty Akwen"
        fill
        priority
        className="object-cover object-center scale-[1.02]"
        sizes="100vw"
      />

      {/* Delikatniejszy overlay — więcej zdjęcia, mniej „ściany” koloru */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/88 via-navy-900/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-navy-950/15" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-28 sm:px-8 sm:py-32 lg:px-10">
        <motion.div
          className="max-w-2xl text-left"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display mb-6 text-xs font-medium uppercase tracking-[0.28em] text-turquoise-300/90 sm:text-sm">
            Dystrybutor ryb od 1991 roku
          </p>

          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {company.heroTitle}
          </h1>

          <p className="mt-8 max-w-lg text-base leading-[1.75] text-white/80 sm:text-lg md:text-xl">
            {company.heroSubtitle}
          </p>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-full bg-coral-500/95 px-8 text-white shadow-lg shadow-coral-500/15 hover:bg-coral-400"
              render={<Link href="/oferta" />}
            >
              Nasza oferta
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/40 bg-white/5 px-8 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/10 hover:text-white"
              render={<Link href="/b2b" />}
            >
              Portal B2B
              <ExternalLink />
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-10">
        <WaveDivider variant="light" />
      </div>
    </section>
  );
}
