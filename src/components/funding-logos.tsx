import Image from "next/image";
import { assets } from "@/lib/content";

/** Oficjalny pasek KPO + NextGenerationEU — mniejsze, dyskretne logotypy */
const logos = [
  {
    src: assets.euLogos.kpo,
    alt: "Krajowy Plan Odbudowy",
    width: 354,
    height: 116,
    className: "h-6 w-auto sm:h-7",
  },
  {
    src: assets.euLogos.rp,
    alt: "Rzeczpospolita Polska",
    width: 430,
    height: 116,
    className: "h-6 w-auto sm:h-7",
  },
  {
    src: assets.euLogos.ngeu,
    alt: "Sfinansowane przez Unię Europejską NextGenerationEU",
    width: 491,
    height: 116,
    className: "h-6 w-auto sm:h-7",
  },
] as const;

/**
 * Belka logotypów dofinansowania — nakładana na hero / page header.
 * Oficjalne znaki: KPO | barwy RP | NextGenerationEU.
 * Półprzezroczysta podkładka — hero / page header prześwieca.
 */
export function FundingLogos() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 w-full"
      role="region"
      aria-label="Logotypy dofinansowania: Krajowy Plan Odbudowy, Rzeczpospolita Polska, Unia Europejska NextGenerationEU"
    >
      {/* Subtelny cień tonów — nie blur, nie solid; hero prześwieca */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 20, 40, 0.32) 0%, rgba(0, 20, 40, 0.18) 55%, rgba(0, 20, 40, 0.0) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-1.5 px-3 py-2 sm:gap-2.5 sm:px-8 sm:py-2.5">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className="flex items-center justify-center rounded-md bg-white/85 px-2 py-1 shadow-sm shadow-black/10 backdrop-blur-[2px] sm:rounded-lg sm:px-2.5 sm:py-1.5"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={`${logo.className} max-w-[min(44vw,200px)] object-contain object-center sm:max-w-[220px]`}
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
