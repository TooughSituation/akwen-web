"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useTour } from "@/contexts/tour-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PADDING = 8;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Overlay przewodnika — przyciemnia stronę i „wycina” dziurę wokół elementu.
 * Analogia Access: kreator z podświetleniem kontrolek formularza.
 */
export function TourOverlay() {
  const { isActive, step, stepIndex, totalSteps, next, prev, endTour } =
    useTour();
  const [rect, setRect] = useState<Rect | null>(null);
  const [missing, setMissing] = useState(false);

  useLayoutEffect(() => {
    if (!isActive || !step) {
      setRect(null);
      return;
    }

    let attempts = 0;
    let raf = 0;
    let timer = 0;

    const measure = () => {
      const el = document.querySelector(step.target) as HTMLElement | null;
      if (!el) {
        attempts += 1;
        setMissing(true);
        if (attempts < 20) {
          timer = window.setTimeout(measure, 100);
        }
        return;
      }
      setMissing(false);
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - PADDING,
        left: r.left - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      });
      // Scroll do elementu jeśli poza viewportem
      const fullyVisible =
        r.top >= 0 &&
        r.bottom <= window.innerHeight &&
        r.left >= 0 &&
        r.right <= window.innerWidth;
      if (!fullyVisible) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        // Ponowny pomiar po scrollu
        timer = window.setTimeout(() => {
          const r2 = el.getBoundingClientRect();
          setRect({
            top: r2.top - PADDING,
            left: r2.left - PADDING,
            width: r2.width + PADDING * 2,
            height: r2.height + PADDING * 2,
          });
        }, 280);
      }
    };

    measure();
    const onResize = () => {
      raf = window.requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [isActive, step, stepIndex]);

  // Blokada scroll body podczas tour
  useEffect(() => {
    if (!isActive) return;
    const prev = document.body.style.overflow;
    // Nie blokujemy całkowicie — scrollIntoView musi działać
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isActive]);

  if (!isActive || !step) return null;

  const tooltipStyle = getTooltipStyle(rect);

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      aria-describedby="tour-desc"
    >
      {/* Przyciemnienie z „dziurą” */}
      <div className="absolute inset-0" aria-hidden>
        {rect ? (
          <div
            className="absolute rounded-lg transition-all duration-200"
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              boxShadow: "0 0 0 9999px rgba(0, 15, 30, 0.72)",
              outline: "2px solid #0077B6",
              outlineOffset: 2,
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-navy-900/70" />
        )}
      </div>

      {/* Box opisu */}
      <div
        className={cn(
          "absolute z-[101] w-[min(100%-2rem,22rem)] rounded-xl border border-border bg-card p-4 shadow-2xl",
          !rect && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        )}
        style={rect ? tooltipStyle : undefined}
      >
        <p className="text-[11px] font-medium tracking-wide text-turquoise-600 uppercase">
          Przewodnik · {stepIndex + 1} / {totalSteps}
        </p>
        <h2 id="tour-title" className="mt-1 font-heading text-lg font-semibold">
          {step.title}
        </h2>
        <p id="tour-desc" className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>
        {missing && (
          <p className="mt-2 text-xs text-coral-600">
            Ładowanie elementu… Jeśli nie widać podświetlenia, kliknij Następny.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={endTour}>
            Zakończ
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={prev}
              disabled={stepIndex === 0}
            >
              Poprzedni
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-turquoise-500 hover:bg-turquoise-600"
              onClick={next}
            >
              {stepIndex >= totalSteps - 1 ? "Gotowe" : "Następny"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTooltipStyle(rect: Rect | null): React.CSSProperties | undefined {
  if (!rect) return undefined;

  const gap = 12;
  const tooltipWidth = Math.min(window.innerWidth - 32, 352);
  const tooltipApproxHeight = 220;

  let top = rect.top + rect.height + gap;
  let left = rect.left;

  // Preferuj poniżej; jeśli brak miejsca — powyżej
  if (top + tooltipApproxHeight > window.innerHeight - 16) {
    top = rect.top - tooltipApproxHeight - gap;
  }
  if (top < 16) top = 16;

  // Trzymaj w poziomie w oknie
  if (left + tooltipWidth > window.innerWidth - 16) {
    left = window.innerWidth - tooltipWidth - 16;
  }
  if (left < 16) left = 16;

  return {
    top,
    left,
    maxWidth: tooltipWidth,
  };
}
