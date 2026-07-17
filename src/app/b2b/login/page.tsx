import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/b2b/login-form";
import { DEMO_B2B_USERS } from "@/lib/b2b/seed-users";

export const metadata = {
  title: "Logowanie B2B – Akwen",
  description: "Zaloguj się do portalu hurtowego Akwen",
};

export default async function B2BLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/b2b");
  }

  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/b2b";

  const demoAccounts = DEMO_B2B_USERS.map((u) => ({
    email: u.email,
    password: u.password,
    companyName: u.profile.companyName,
    contactPerson: u.profile.contactPerson,
    discountPercent: u.profile.discountPercent,
    label: u.label,
  }));

  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      {/* Panel brandowy */}
      <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-navy-900 px-8 py-10 text-white lg:max-w-md lg:px-10 xl:max-w-lg">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(0,119,182,0.45) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(255,107,53,0.2) 0%, transparent 50%)",
          }}
        />
        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-white.png"
            alt="Akwen"
            className="h-10 w-auto"
          />
          <p className="mt-3 text-xs font-medium tracking-widest text-turquoise-300 uppercase">
            Portal hurtowy B2B
          </p>
        </div>

        <div className="relative z-10 mt-12 space-y-4 lg:mt-0">
          <h1 className="font-heading text-3xl font-semibold leading-tight xl:text-4xl">
            Zamówienia hurtowe
            <br />
            <span className="text-turquoise-300">w prostym panelu</span>
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-white/75">
            Katalog z cenami Twojej firmy, koszyk, historia zamówień i adresy
            dostawy — wszystko pod jednym loginem, jak osobny skoroszyt na
            partnera.
          </p>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex gap-2">
              <span className="text-turquoise-400">✓</span>
              Indywidualny rabat handlowy
            </li>
            <li className="flex gap-2">
              <span className="text-turquoise-400">✓</span>
              Osobny koszyk i zamówienia na konto
            </li>
            <li className="flex gap-2">
              <span className="text-turquoise-400">✓</span>
              Dostęp 24/7 do oferty Akwen
            </li>
          </ul>
        </div>

        <p className="relative z-10 mt-10 text-xs text-white/40">
          © {new Date().getFullYear()} AKWEN Sp. z o.o. · Białystok
        </p>
      </div>

      {/* Formularz */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-8">
        <LoginForm callbackUrl={callbackUrl} demoAccounts={demoAccounts} />
      </div>
    </div>
  );
}
