"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Fish,
  Snowflake,
  Shell,
  Package,
  UtensilsCrossed,
  Wheat,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { formatCategoryLabel, formatKindLabel } from "@/lib/b2b/labels";
import {
  isGeneratedProductPhoto,
  isLocalProductPhoto,
} from "@/lib/b2b/image-prompts";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Pasty: UtensilsCrossed,
  Mrożonki: Snowflake,
  "Garmażeria mrożona": Snowflake,
  "Filety rybne": Fish,
  Panierowane: Fish,
  "Ryba Wędzona": Fish,
  "Ryby pieczone": Fish,
  "Konserwy rybne": Package,
  "Ryba w oleju": Package,
  "Ryba w sosie": Package,
  Śledzie: Package,
  "Ryba faszerowana": Package,
  "Owoce morza": Shell,
  "Paluszki krabowe": Shell,
  Kawiory: Shell,
  Sałatki: UtensilsCrossed,
  "Dania rybne": UtensilsCrossed,
  "Farsz rybny": Fish,
  "Wątrobka rybna": Fish,
  Mięsne: Wheat,
  Warzywa: Leaf,
  Inne: Package,
};

/** Statyczne HQ fallbacki per Tag1 — client-side, bez FS. */
const TAG1_CLIENT_FALLBACK: Record<string, string> = {
  Pasty: "/images/oferta_przetwory.jpg",
  "Ryba Wędzona": "/images/oferta_wedzone.jpg",
  Mrożonki: "/images/oferta_mrozone.jpg",
  "Garmażeria mrożona": "/images/oferta_mrozone.jpg",
  "Filety rybne": "/images/oferta_mrozone.jpg",
  Panierowane: "/images/oferta_mrozone.jpg",
  "Konserwy rybne": "/images/oferta_konserwy.jpg",
  "Ryba w oleju": "/images/oferta_konserwy.jpg",
  "Ryba w sosie": "/images/oferta_konserwy.jpg",
  "Owoce morza": "/images/oferta_mrozone.jpg",
  "Paluszki krabowe": "/images/oferta_mrozone.jpg",
  Kawiory: "/images/oferta_przetwory.jpg",
  Sałatki: "/images/oferta_przetwory.jpg",
  "Dania rybne": "/images/oferta_przetwory.jpg",
  Śledzie: "/images/oferta_konserwy.jpg",
  "Ryby pieczone": "/images/oferta_wedzone.jpg",
  "Ryba faszerowana": "/images/oferta_konserwy.jpg",
  "Farsz rybny": "/images/oferta_przetwory.jpg",
  "Wątrobka rybna": "/images/oferta_przetwory.jpg",
  Mięsne: "/images/oferta_przetwory.jpg",
  Warzywa: "/images/oferta_przetwory.jpg",
  Inne: "/images/oferta_przetwory.jpg",
};

const HQ_REMOTE_FALLBACK =
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b779?w=1200&h=900&fit=crop&q=85&auto=format";

interface ProductImageProps {
  imageUrl: string;
  name: string;
  tag1: string;
  tag2: string;
  compact?: boolean;
}

function buildFallbackChain(
  imageUrl: string,
  tag1: string
): string[] {
  const chain: string[] = [];
  const push = (url: string | undefined | null) => {
    if (url && !chain.includes(url)) chain.push(url);
  };

  push(imageUrl);
  push(TAG1_CLIENT_FALLBACK[tag1]);
  push("/images/oferta_przetwory.jpg");
  push(HQ_REMOTE_FALLBACK);

  return chain;
}

export function ProductImage({
  imageUrl,
  name,
  tag1,
  tag2,
  compact = false,
}: ProductImageProps) {
  const fallbacks = useMemo(
    () => buildFallbackChain(imageUrl, tag1),
    [imageUrl, tag1]
  );
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const currentUrl = fallbacks[Math.min(fallbackIndex, fallbacks.length - 1)];
  const isGenerated = Boolean(isGeneratedProductPhoto(currentUrl));
  const isExternal = currentUrl.startsWith("http");
  const exhausted = fallbackIndex >= fallbacks.length;

  function handleError() {
    setFallbackIndex((i) => i + 1);
  }

  if (exhausted || !currentUrl) {
    return (
      <ProductImagePlaceholder
        name={name}
        tag1={tag1}
        tag2={tag2}
        compact={compact}
      />
    );
  }

  // Wygenerowane zdjęcia Tag1+Tag2 — pełne pokrycie, wysoka jakość
  if (isGenerated) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-white">
        <Image
          src={currentUrl}
          alt={name}
          fill
          quality={90}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={compact ? "112px" : "(max-width: 768px) 50vw, 25vw"}
          onError={handleError}
        />
      </div>
    );
  }

  // Fallback oferty / remote HQ — delikatny overlay z ikoną kategorii
  return (
    <ProductImageFallbackPhoto
      imageUrl={currentUrl}
      name={name}
      tag1={tag1}
      tag2={tag2}
      compact={compact}
      isExternal={isExternal}
      isLocal={isLocalProductPhoto(currentUrl)}
      onError={handleError}
    />
  );
}

function ProductImageFallbackPhoto({
  imageUrl,
  name,
  tag1,
  tag2,
  compact,
  isExternal,
  isLocal,
  onError,
}: {
  imageUrl: string;
  name: string;
  tag1: string;
  tag2: string;
  compact?: boolean;
  isExternal: boolean;
  isLocal: boolean;
  onError: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const categoryLabel = formatCategoryLabel(tag1);
  const kindLabel = formatKindLabel(tag2);
  const Icon = CATEGORY_ICONS[tag1] ?? Fish;

  return (
    <div className="relative h-full w-full overflow-hidden bg-navy-900">
      <Image
        src={imageUrl}
        alt={name}
        fill
        quality={isLocal ? 88 : 80}
        unoptimized={isExternal}
        className={cn(
          "object-cover transition-all duration-500",
          loaded ? "scale-100 opacity-100" : "scale-105 opacity-0",
          "group-hover:scale-105"
        )}
        sizes={compact ? "112px" : "(max-width: 768px) 50vw, 25vw"}
        onLoad={() => setLoaded(true)}
        onError={onError}
      />

      {/* Gradient dla czytelności badge'y */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-navy-900/20" />

      {!compact && (
        <div className="absolute right-2 bottom-2 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 text-[10px] text-white/90 backdrop-blur-sm">
          <Icon className="size-3" strokeWidth={1.5} />
          <span className="max-w-[120px] truncate">
            {kindLabel || categoryLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function ProductImagePlaceholder({
  name,
  tag1,
  tag2,
  compact,
}: {
  name: string;
  tag1: string;
  tag2: string;
  compact?: boolean;
}) {
  const categoryLabel = formatCategoryLabel(tag1);
  const kindLabel = formatKindLabel(tag2);
  const Icon = CATEGORY_ICONS[tag1] ?? Fish;

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-navy-900 via-[#004d73] to-turquoise-600">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,119,182,0.25) 0%, transparent 55%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3 text-white">
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-white/15 backdrop-blur-sm",
            compact ? "size-10" : "size-14"
          )}
        >
          <Icon
            className={cn("text-white/90", compact ? "size-5" : "size-7")}
            strokeWidth={1.5}
          />
        </div>
        {!compact && categoryLabel && (
          <p className="max-w-[90%] text-center text-[11px] font-medium tracking-wide text-white/90 uppercase">
            {categoryLabel}
          </p>
        )}
        {!compact && kindLabel && (
          <p className="max-w-[90%] truncate text-center text-[10px] text-white/70">
            {kindLabel}
          </p>
        )}
      </div>

      <span className="sr-only">{name}</span>
    </div>
  );
}
