import type { ImplementationStatus, RiskRating } from "@/lib/scoring";
import { statusLabel } from "@/lib/scoring";
import type { SpecRequirement } from "@/lib/catalog";
import { ratingStyle, statusStyle } from "@/components/ui/tokens";

/** A colored pill for a derived risk rating, using the dark display tokens. */
export function RatingBadge({
  rating,
  className = "",
}: {
  rating: RiskRating;
  className?: string;
}) {
  const c = ratingStyle(rating);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: c.fill }}
        aria-hidden="true"
      />
      {c.label}
    </span>
  );
}

/**
 * Required vs Addressable. The distinction is real in HIPAA, so make it
 * visually distinct: Required is a solid teal emphasis, Addressable an outline.
 */
export function RequirementBadge({ requirement }: { requirement: SpecRequirement }) {
  if (requirement === "required") {
    return (
      <span
        title="Required — must be implemented"
        className="inline-flex items-center rounded border border-[rgb(45_212_191_/_0.4)] bg-[var(--accent-dim)] px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-bright)]"
      >
        Required
      </span>
    );
  }
  return (
    <span
      title="Addressable — implement, adopt an equivalent, or document why not"
      className="inline-flex items-center rounded border border-[var(--border-strong)] bg-transparent px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]"
    >
      Addressable
    </span>
  );
}

/** A small pill describing an implementation status. */
export function StatusBadge({ status }: { status: ImplementationStatus }) {
  const s = statusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text} ${s.border}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
        aria-hidden="true"
      />
      {statusLabel(status)}
    </span>
  );
}
