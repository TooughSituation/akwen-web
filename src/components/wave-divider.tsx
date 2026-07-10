type WaveVariant = "light" | "dark" | "turquoise";

const fillMap: Record<WaveVariant, string> = {
  light: "fill-background",
  dark: "fill-navy-900",
  turquoise: "fill-turquoise-500/10",
};

export function WaveDivider({
  variant = "light",
  flip = false,
}: {
  variant?: WaveVariant;
  flip?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${flip ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-12 w-full sm:h-16"
      >
        <path
          className={fillMap[variant]}
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}