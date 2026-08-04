import { WaveDivider } from "@/components/wave-divider";

export function PageHeader({
  title,
  description,
  label,
}: {
  title: string;
  description?: string;
  label?: string;
}) {
  return (
    <div className="relative maritime-gradient text-white">
      {/* pt większe — miejsce na belkę logotypów (absolute) */}
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-14 sm:px-6 sm:pt-24 sm:pb-16 lg:px-8">
        {label && (
          <p className="font-display mb-3 text-xs font-medium tracking-[0.2em] text-turquoise-300 uppercase sm:text-sm">
            {label}
          </p>
        )}
        <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-5xl lg:leading-[1.12]">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-[1.8] text-ocean-100/95 sm:text-lg sm:leading-[1.75]">
            {description}
          </p>
        )}
      </div>
      <WaveDivider variant="light" />
    </div>
  );
}