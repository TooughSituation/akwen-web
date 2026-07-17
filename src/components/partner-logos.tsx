import Image from "next/image";
import { assets } from "@/lib/content";

export function PartnerLogos() {
  return (
    <section className="border-y border-border/60 bg-white/80 py-12 sm:py-14">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 px-5 sm:grid-cols-3 sm:gap-8 sm:px-8">
        {assets.partnerLogos.map((src) => (
          <div key={src} className="flex justify-center">
            <Image
              src={src}
              alt="Logo partnera"
              width={400}
              height={38}
              className="h-7 w-auto max-w-[200px] object-contain opacity-50 grayscale transition-all duration-500 hover:opacity-90 hover:grayscale-0 sm:h-8"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
