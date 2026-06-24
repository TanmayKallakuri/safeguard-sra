"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import type { StatusCounts } from "@/lib/scoring";
import { statusFill } from "@/components/ui/tokens";

const TICKS = 10;

function fillColor(pct: number): string {
  return pct >= 80
    ? "var(--low)"
    : pct >= 50
      ? "var(--medium)"
      : "var(--critical)";
}

/**
 * A discrete ticked bar: `▓▓░░░░░░`. Ten cells; the first round(pct/10) read as
 * filled. Ticks "boot up" left-to-right in a fast stagger (in-view), which is
 * far more terminal/instrument than a smooth progress bar. Reduced motion shows
 * the final state immediately.
 */
export function TickBar({
  pct,
  ariaLabel,
}: {
  pct: number;
  ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * TICKS);
  const color = fillColor(pct);

  return (
    <div
      ref={ref}
      className="flex h-2.5 items-stretch gap-px"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel ?? "compliance"}
    >
      {Array.from({ length: TICKS }).map((_, i) => {
        const isFilled = i < filled;
        // First-paint markup is identical (all ticks start "off"); the fill
        // opacity is driven post-mount, so SSR/hydration stay deterministic.
        return (
          <m.span
            key={i}
            className="flex-1 rounded-[1px]"
            style={{ backgroundColor: isFilled ? color : "var(--rule)" }}
            initial={{ opacity: isFilled ? 0.25 : 1, scaleY: isFilled ? 0.6 : 1 }}
            animate={{
              opacity: (inView || reduce) && isFilled ? 1 : isFilled ? 0.25 : 1,
              scaleY: (inView || reduce) && isFilled ? 1 : isFilled ? 0.6 : 1,
            }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.12, delay: i * 0.025 }
            }
          />
        );
      })}
    </div>
  );
}

/** A labelled compliance line: `COMPLIANCE  17% ▓▓░░░░░░`. */
export function ComplianceBar({
  pct,
  label,
}: {
  pct: number;
  label?: string;
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-baseline justify-between text-[10px]">
          <span className="label">{label}</span>
          <span className="font-semibold tabular-nums text-[var(--fg)]">
            {pct}%
          </span>
        </div>
      ) : null}
      <TickBar pct={pct} ariaLabel={label ? `${label} compliance` : undefined} />
    </div>
  );
}

const SEGMENTS: {
  key: keyof StatusCounts;
  label: string;
}[] = [
  { key: "implemented", label: "Implemented" },
  { key: "partial", label: "Partial" },
  { key: "not-implemented", label: "Not implemented" },
  { key: "not-applicable", label: "Not applicable" },
  { key: "unassessed", label: "Unassessed" },
];

/**
 * A sharp stacked density bar showing implementation-status composition for a
 * group of controls. Segment widths are proportional to counts (composition,
 * not a single animated value).
 */
export function StatusBreakdownBar({ counts }: { counts: StatusCounts }) {
  const total = SEGMENTS.reduce((sum, s) => sum + counts[s.key], 0);
  return (
    <div
      className="inset flex h-1.5 w-full overflow-hidden"
      role="img"
      aria-label="Status breakdown"
    >
      {total === 0
        ? null
        : SEGMENTS.map((s) => {
            const n = counts[s.key];
            if (n === 0) return null;
            return (
              <div
                key={s.key}
                style={{
                  width: `${(n / total) * 100}%`,
                  backgroundColor: statusFill(s.key),
                }}
                title={`${s.label}: ${n}`}
              />
            );
          })}
    </div>
  );
}
