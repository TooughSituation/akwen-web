"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

const easeLuxury: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
  y = 14,
  ...props
}: MotionFadeProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: easeLuxury,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Hover na kartach — delikatny lift + cień. */
export function MotionCard({
  children,
  className,
  delay = 0,
  ...props
}: MotionFadeProps) {
  return (
    <motion.div
      className={cn("h-full", className)}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      whileHover={{ y: -4 }}
      transition={{
        duration: 0.45,
        delay,
        ease: easeLuxury,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
