import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { company, aboutText, assets } from "@/lib/content";
import { WaveDivider } from "@/components/wave-divider";

export function Footer() {
  return (
    <footer className="relative bg-navy-900 text-ocean-100">
      <WaveDivider variant="dark" flip />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr_1.2fr]">
          <div>
            <Image
              src={assets.logoWhite}
              alt="Akwen"
              width={196}
              height={36}
              className="h-9 w-auto"
            />
            <p className="mt-4 text-sm text-ocean-200">{company.slogan}</p>
            <p className="mt-3 text-sm text-ocean-200">{aboutText.coverage}</p>
            <p className="mt-3 text-xs text-ocean-200/70">
              NIP: {company.nip} · KRS: {company.krs}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Nawigacja</h3>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-ocean-200">
              <Link href="/o-nas" className="hover:text-turquoise-300">
                O nas
              </Link>
              <Link href="/oferta" className="hover:text-turquoise-300">
                Oferta
              </Link>
              <Link href="/produkty" className="hover:text-turquoise-300">
                Produkty litewskie
              </Link>
              <Link href="/kontakt" className="hover:text-turquoise-300">
                Kontakt
              </Link>
              <Link href="/b2b" className="hover:text-turquoise-300">
                Portal B2B
              </Link>
            </nav>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Dział Handlowy</h3>
              <ul className="mt-3 space-y-2 text-sm text-ocean-200">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-turquoise-400" />
                  <span>
                    {company.name}
                    <br />
                    {company.address.street}
                    <br />
                    {company.address.city}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-turquoise-400" />
                  <span>
                    {company.contact.mobile}
                    <br />
                    {company.contact.tel1}
                    <br />
                    {company.contact.tel2}
                    <br />
                    Biuro: {company.contact.office}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0 text-turquoise-400" />
                  <a
                    href={`mailto:${company.contact.email}`}
                    className="hover:text-turquoise-300"
                  >
                    {company.contact.email}
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex justify-center sm:justify-end">
              <Image
                src={assets.map}
                alt="Mapa zasięgu działania Akwen"
                width={312}
                height={280}
                className="h-auto w-full max-w-[220px] opacity-90"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8">
          <Image
            src={assets.euLogos.ue}
            alt="Unia Europejska"
            width={160}
            height={60}
            className="h-12 w-auto object-contain opacity-90"
          />
          <Image
            src={assets.euLogos.kpo}
            alt="Krajowy Plan Odbudowy"
            width={160}
            height={60}
            className="h-12 w-auto object-contain opacity-90"
          />
          <Image
            src={assets.euLogos.poRyby}
            alt="PO RYBY 2007-2013"
            width={200}
            height={80}
            className="h-14 w-auto object-contain opacity-90"
          />
        </div>

        <div className="mt-6 text-center text-sm text-ocean-200/70">
          © {new Date().getFullYear()} {company.name} Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}