import Image from "next/image";
import { assets } from "@/lib/content";

const logos = [
  {
    src: assets.euLogos.ue,
    alt: "Unia Europejska / Europejski Fundusz Rybacki",
    width: 160,
    height: 60,
    className: "h-10 w-auto sm:h-12",
  },
  {
    src: assets.euLogos.kpo,
    alt: "Krajowy Plan Odbudowy",
    width: 160,
    height: 60,
    className: "h-10 w-auto sm:h-12",
  },
  {
    src: assets.euLogos.poRyby,
    alt: "PO RYBY 2007-2013",
    width: 200,
    height: 80,
    className: "h-12 w-auto sm:h-14",
  },
] as const;

/**
 * Belka logotypów dofinansowania — wymóg prawny: widoczne u góry strony.
 * Umieszczona tuż pod nawigacją, nad hero / treścią.
 */
export function FundingLogos() {
  return (
    <div
      className="relative z-40 w-full border-b border-border/50 bg-white/95 shadow-sm shadow-black/5 backdrop-blur-sm dark:border-white/10 dark:bg-white"
      role="region"
      aria-label="Logotypy dofinansowania"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-3.5 sm:gap-x-10 sm:px-6 sm:py-4 lg:gap-x-14 lg:px-8">
        {logos.map((logo) => (
          <Image
            key={logo.src}
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={`${logo.className} max-w-[42vw] object-contain sm:max-w-none`}
            priority
          />
        ))}
      </div>
    </div>
  );
}
