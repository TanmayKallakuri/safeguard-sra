"use client";

import type { StatusCounts } from "@/lib/scoring";
import { GrowBar } from "@/components/ui/motion";
import { statusStyle } from "@/components/ui/tokens";

/** A single compliance percentage bar (implemented / applicable). */
export function ComplianceBar({
  pct,
  label,
}: {
  pct: number;
  label?: string;
}) {
  const fill =
    pct >= 80
      ? "bg-[var(--low)]"
      : pct >= 50
        ? "bg-[var(--medium)]"
        : "bg-[var(--critical)]";
  return (
    <div className="space-y-1.5">
      {label ? (
        <div className="flex items-baseline justify-between text-[11px]">
          <span className="font-mono uppercase tracking-wider text-[var(--fg-faint)]">
            {label}
          </span>
          <span className="font-mono font-semibold tabular-nums text-[var(--fg)]">
            {pct}%
          </span>
        </div>
      ) : null}
      <div
        className="panel-inset h-1.5 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label} compliance` : "compliance"}
      >
        <GrowBar pct={pct} className={`rounded-full ${fill}`} />
      </div>
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
 * A thin stacked bar showing the distribution of implementation statuses for a
 * group of controls. Each segment's width is proportional to its count. (Static
 * proportional widths — this conveys composition, not a single animated value.)
 */
export function StatusBreakdownBar({ counts }: { counts: StatusCounts }) {
  const total = SEGMENTS.reduce((sum, s) => sum + counts[s.key], 0);
  return (
    <div
      className="panel-inset flex h-1.5 w-full overflow-hidden rounded-full"
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
                className={statusStyle(s.key).bar}
                style={{ width: `${(n / total) * 100}%` }}
                title={`${s.label}: ${n}`}
              />
            );
          })}
    </div>
  );
}
