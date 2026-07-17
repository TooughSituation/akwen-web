"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type MotionFadeProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

/**
 * Subtelne fade-in + lekkie uniesienie — quiet luxury 2026.
 */
export function MotionFade({
  children,
  className,
  delay = 0,
  y = 16,
  ...props
}: MotionFadeProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
