import Image from "next/image";
import { assets } from "@/lib/content";

export function PartnerLogos() {
  return (
    <section className="border-y border-border bg-white py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {assets.partnerLogos.map((src) => (
          <div key={src} className="flex justify-center">
            <Image
              src={src}
              alt="Logo partnera"
              width={400}
              height={38}
              className="h-8 w-auto max-w-full object-contain opacity-80 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </section>
  );
}