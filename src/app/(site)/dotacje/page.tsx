import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { getDotacjeHtml } from "@/lib/dotacje";

export const metadata: Metadata = {
  title: "Dotacje | AKWEN",
  description:
    "AKWEN Sp. z o.o. – beneficjent projektu KPO: Rozbudowa i wyposażenie powierzchni magazynowej w oparciu o rozwiązania związane z ochroną środowiska.",
};

export default async function DotacjePage() {
  const html = await getDotacjeHtml();

  return (
    <>
      <PageHeader
        label="Finansowanie UE"
        title="Dotacje"
        description="Informacja o projekcie zrealizowanym w ramach Krajowego Planu Odbudowy i Zwiększania Odporności."
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-turquoise-500/15 bg-card shadow-sm">
          <div className="border-b border-border bg-gradient-to-r from-navy-900/5 via-turquoise-500/5 to-transparent px-6 py-4 sm:px-8">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-turquoise-600">
              Krajowy Plan Odbudowy
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Inwestycja A.1.4.1 · wsparcie z funduszy UE
            </p>
          </div>

          <article
            className="dotacje-content px-6 py-8 sm:px-8 sm:py-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </>
  );
}
