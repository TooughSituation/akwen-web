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
            "font-display mb-4 text-xs font-medium tracking-[0.22em] uppercase sm:text-sm",
            light ? "text-turquoise-300/90" : "text-turquoise-600"
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]",
          light ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-base leading-[1.75] sm:mt-6 sm:text-lg",
            light ? "text-white/75" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
