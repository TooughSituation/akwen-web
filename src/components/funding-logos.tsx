import Image from "next/image";
import { assets } from "@/lib/content";

/**
 * Belka logotypów dofinansowania — nakładana na hero / page header.
 * Jeden oficjalny biały pasek: KPO | RP | NextGenerationEU.
 */
export function FundingLogos() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-20 w-full"
      role="region"
      aria-label="Logotypy dofinansowania: Krajowy Plan Odbudowy, Rzeczpospolita Polska, Unia Europejska NextGenerationEU"
    >
      {/* Subtelny gradient tonów — hero / page header prześwieca wokół belki */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 20, 40, 0.28) 0%, rgba(0, 20, 40, 0.14) 55%, rgba(0, 20, 40, 0.0) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-center px-3 py-2 sm:px-8 sm:py-2.5">
          {/* Jeden spójny biały pasek z trzema logotypami */}
          <div className="w-full max-w-[min(100%,720px)] rounded-lg bg-white px-3 py-1.5 shadow-sm shadow-black/10 sm:max-w-[780px] sm:rounded-xl sm:px-5 sm:py-2">
            <Image
              src={assets.euLogos.bar}
              alt="Krajowy Plan Odbudowy · Rzeczpospolita Polska · Sfinansowane przez Unię Europejską NextGenerationEU"
              width={1491}
              height={191}
              className="mx-auto h-8 w-auto max-w-full object-contain object-center sm:h-9 md:h-10"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
