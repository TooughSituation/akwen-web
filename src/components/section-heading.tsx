import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  description,
  className,
  light = false,
}: {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("text-center", className)}>
      {label && (
        <p
          className={cn(
            "font-display mb-3 text-sm font-semibold uppercase tracking-[0.2em]",
            light ? "text-turquoise-300" : "text-turquoise-500"
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-2xl text-base sm:text-lg",
            light ? "text-ocean-100" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}