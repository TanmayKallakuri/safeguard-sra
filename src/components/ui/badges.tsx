import type { ImplementationStatus, RiskRating } from "@/lib/scoring";
import { statusLabel } from "@/lib/scoring";
import type { SpecRequirement } from "@/lib/catalog";
import { ratingStyle, statusStyle } from "@/components/ui/tokens";

/** A mono tag for a derived risk rating. */
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
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-[1.4] tracking-[0.08em] ${c.bg} ${c.text} ${c.border} ${className}`}
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
 * Required vs Addressable. The HIPAA distinction is real, so keep it visible:
 * Required is a filled accent tag, Addressable an outline.
 */
export function RequirementBadge({ requirement }: { requirement: SpecRequirement }) {
  if (requirement === "required") {
    return (
      <span
        title="Required — must be implemented"
        className="inline-flex items-center rounded border border-[var(--accent)]/35 bg-[var(--accent-dim)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)]"
      >
        REQ
      </span>
    );
  }
  return (
    <span
      title="Addressable — implement, adopt an equivalent, or document why not"
      className="inline-flex items-center rounded border border-[var(--rule-strong)] bg-transparent px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--fg-faint)]"
    >
      ADDR
    </span>
  );
}

/** A small tag describing an implementation status. */
export function StatusBadge({ status }: { status: ImplementationStatus }) {
  const s = statusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${s.bg} ${s.text} ${s.border}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
        aria-hidden="true"
      />
      {statusLabel(status)}
    </span>
  );
}
