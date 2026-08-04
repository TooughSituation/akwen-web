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
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {label && (
        <p
          className={cn(
            "font-display mb-4 text-xs font-medium tracking-[0.2em] uppercase sm:text-sm",
            light ? "text-turquoise-300/95" : "text-turquoise-600"
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.85rem] lg:leading-[1.14]",
          light ? "text-white" : "text-navy-900 dark:text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-base leading-[1.8] sm:mt-6 sm:text-lg sm:leading-[1.75]",
            light ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
