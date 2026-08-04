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
 * Ciemna, półprzezroczysta belka (glass) spójna z granatem marki;
 * delikatna jasna podkładka tylko pod logami — czytelność bez „białego paska”.
 */
export function FundingLogos() {
  return (
    <div
      className="relative z-40 w-full border-b border-white/10"
      style={{
        background:
          "linear-gradient(180deg, rgba(0, 31, 63, 0.82) 0%, rgba(0, 20, 40, 0.68) 100%)",
      }}
      role="region"
      aria-label="Logotypy dofinansowania"
    >
      {/* Lekki blur / glass — nie „ściana” koloru */}
      <div
        className="pointer-events-none absolute inset-0 backdrop-blur-md"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl justify-center px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        {/* Podkładka tylko pod rzędem log — nie pełna szerokość strony */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 rounded-xl px-5 py-3 sm:gap-x-10 sm:px-8 sm:py-3.5 lg:gap-x-12"
          style={{
            background: "rgba(255, 255, 255, 0.92)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.12) inset, 0 8px 24px rgba(0, 0, 0, 0.18)",
          }}
        >
          {logos.map((logo) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className={`${logo.className} max-w-[40vw] object-contain sm:max-w-none`}
              priority
            />
          ))}
        </div>
      </div>
    </div>
  );
}
