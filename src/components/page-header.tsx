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
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {label && (
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-turquoise-300">
            {label}
          </p>
        )}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-2xl text-ocean-100">{description}</p>
        )}
      </div>
      <WaveDivider variant="light" />
    </div>
  );
}