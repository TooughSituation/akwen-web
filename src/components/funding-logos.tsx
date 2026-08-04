import Image from "next/image";
import { assets } from "@/lib/content";

/** ~15% mniejsze niż poprzednia iteracja — belka minimalistyczna */
const logos = [
  {
    src: assets.euLogos.ue,
    alt: "Unia Europejska / Europejski Fundusz Rybacki",
    width: 265,
    height: 50,
    className: "h-7 w-auto sm:h-8",
  },
  {
    src: assets.euLogos.kpo,
    alt: "Krajowy Plan Odbudowy",
    width: 208,
    height: 65,
    className: "h-7 w-auto sm:h-8",
  },
  {
    src: assets.euLogos.poRyby,
    alt: "PO RYBY 2007-2013",
    width: 160,
    height: 100,
    className: "h-8 w-auto sm:h-9",
  },
] as const;

/**
 * Belka logotypów dofinansowania — nakładana na hero / page header.
 * Prawie przezroczysta: zdjęcie w tle w pełni widoczne; loga czytelne
 * dzięki delikatnym, półprzezroczystym podkładkom.
 */
export function FundingLogos() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 w-full"
      role="region"
      aria-label="Logotypy dofinansowania"
    >
      {/* Subtelny cień tonów — nie blur, nie solid; hero prześwieca */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 20, 40, 0.32) 0%, rgba(0, 20, 40, 0.18) 55%, rgba(0, 20, 40, 0.0) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-8 sm:py-3">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className="flex items-center justify-center rounded-md bg-white/80 px-2.5 py-1.5 shadow-sm shadow-black/10 backdrop-blur-[2px] sm:rounded-lg sm:px-3 sm:py-2"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className={`${logo.className} max-w-[min(38vw,190px)] object-contain object-center sm:max-w-[210px]`}
                priority
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
