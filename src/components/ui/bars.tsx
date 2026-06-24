import type { StatusCounts } from "@/lib/scoring";

/** A single compliance percentage bar (implemented / applicable). */
export function ComplianceBar({
  pct,
  label,
}: {
  pct: number;
  label?: string;
}) {
  const tone =
    pct >= 80
      ? "bg-emerald-500"
      : pct >= 50
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="space-y-1">
      {label ? (
        <div className="flex items-baseline justify-between text-xs text-[var(--muted)]">
          <span>{label}</span>
          <span className="font-semibold tabular-nums text-[var(--foreground)]">
            {pct}%
          </span>
        </div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label} compliance` : "compliance"}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const SEGMENTS: {
  key: keyof StatusCounts;
  color: string;
  label: string;
}[] = [
  { key: "implemented", color: "bg-emerald-500", label: "Implemented" },
  { key: "partial", color: "bg-amber-500", label: "Partial" },
  { key: "not-implemented", color: "bg-red-500", label: "Not implemented" },
  { key: "not-applicable", color: "bg-slate-400", label: "Not applicable" },
  { key: "unassessed", color: "bg-slate-200 dark:bg-slate-700", label: "Unassessed" },
];

/**
 * A thin stacked bar showing the distribution of implementation statuses for a
 * group of controls. Width of each segment is proportional to its count.
 */
export function StatusBreakdownBar({ counts }: { counts: StatusCounts }) {
  const total = SEGMENTS.reduce((sum, s) => sum + counts[s.key], 0);
  return (
    <div
      className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
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
                className={s.color}
                style={{ width: `${(n / total) * 100}%` }}
                title={`${s.label}: ${n}`}
              />
            );
          })}
    </div>
  );
}
