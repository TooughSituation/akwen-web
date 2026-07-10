import Link from "next/link";
import { Fish, MapPin, Phone, Mail } from "lucide-react";
import { company } from "@/lib/content";
import { WaveDivider } from "@/components/wave-divider";

export function Footer() {
  return (
    <footer className="relative bg-navy-900 text-ocean-100">
      <WaveDivider variant="dark" flip />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-semibold text-white">
              <Fish className="size-5 text-turquoise-400" />
              Akwen
            </div>
            <p className="mt-3 text-sm text-ocean-200">
              {company.slogan}
            </p>
            <p className="mt-2 text-xs text-ocean-200/70">
              NIP: {company.nip} · KRS: {company.krs}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Nawigacja</h3>
            <nav className="mt-3 flex flex-col gap-2 text-sm text-ocean-200">
              <Link href="/o-nas" className="hover:text-turquoise-300">O nas</Link>
              <Link href="/oferta" className="hover:text-turquoise-300">Oferta</Link>
              <Link href="/produkty" className="hover:text-turquoise-300">Produkty litewskie</Link>
              <Link href="/kontakt" className="hover:text-turquoise-300">Kontakt</Link>
              <Link href="/b2b" className="hover:text-turquoise-300">Platforma B2B</Link>
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Dział Handlowy</h3>
            <ul className="mt-3 space-y-2 text-sm text-ocean-200">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-turquoise-400" />
                <span>
                  {company.name}<br />
                  {company.address.street}<br />
                  {company.address.city}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-turquoise-400" />
                <span>
                  {company.contact.mobile}<br />
                  {company.contact.tel1}
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
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-ocean-200/70">
          © {new Date().getFullYear()} {company.name} Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}