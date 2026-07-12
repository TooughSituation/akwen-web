"use client";

import { useState } from "react";
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
import { isGeneratedProductPhoto } from "@/lib/b2b/image-prompts";
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

interface ProductImageProps {
  imageUrl: string;
  name: string;
  tag1: string;
  tag2: string;
  compact?: boolean;
}

export function ProductImage({
  imageUrl,
  name,
  tag1,
  tag2,
  compact = false,
}: ProductImageProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const isGenerated = isGeneratedProductPhoto(imageUrl);
  const isExternalImage = imageUrl.startsWith("http");
  const showPhoto = imageUrl && !imgFailed;

  if (isGenerated && showPhoto) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-white">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={compact ? "112px" : "(max-width: 768px) 50vw, 25vw"}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <ProductImagePlaceholder
      imageUrl={showPhoto ? imageUrl : ""}
      name={name}
      tag1={tag1}
      tag2={tag2}
      compact={compact}
      isExternalImage={isExternalImage}
      onImageError={() => setImgFailed(true)}
    />
  );
}

function ProductImagePlaceholder({
  imageUrl,
  name,
  tag1,
  tag2,
  compact,
  isExternalImage,
  onImageError,
}: {
  imageUrl: string;
  name: string;
  tag1: string;
  tag2: string;
  compact?: boolean;
  isExternalImage: boolean;
  onImageError: () => void;
}) {
  const [bgLoaded, setBgLoaded] = useState(false);

  const categoryLabel = formatCategoryLabel(tag1);
  const kindLabel = formatKindLabel(tag2);
  const Icon = CATEGORY_ICONS[tag1] ?? Fish;

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-navy-900 via-[#004d73] to-turquoise-600">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          fill
          aria-hidden
          className={cn(
            "object-cover transition-opacity duration-300",
            bgLoaded ? "opacity-30" : "opacity-0"
          )}
          sizes={compact ? "112px" : "(max-width: 768px) 50vw, 25vw"}
          unoptimized={isExternalImage}
          onLoad={() => setBgLoaded(true)}
          onError={onImageError}
        />
      )}

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