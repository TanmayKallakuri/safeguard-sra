import { ratingColor, statusLabel } from "@/lib/scoring";
import type { ImplementationStatus, RiskRating } from "@/lib/scoring";
import type { SpecRequirement } from "@/lib/catalog";

/** A colored pill for a derived risk rating, using the locked color tokens. */
export function RatingBadge({
  rating,
  className = "",
}: {
  rating: RiskRating;
  className?: string;
}) {
  const c = ratingColor(rating);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text} ${c.border} ${className}`}
    >
      {c.label}
    </span>
  );
}

/**
 * Required vs Addressable. The distinction is real in HIPAA, so make it visually
 * distinct: Required is a solid emphasis, Addressable is an outline.
 */
export function RequirementBadge({ requirement }: { requirement: SpecRequirement }) {
  if (requirement === "required") {
    return (
      <span
        title="Required — must be implemented"
        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white dark:bg-blue-500"
      >
        Required
      </span>
    );
  }
  return (
    <span
      title="Addressable — implement, adopt an equivalent, or document why not"
      className="inline-flex items-center gap-1 rounded-md border border-blue-400 bg-transparent px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:border-blue-400/60 dark:text-blue-300"
    >
      Addressable
    </span>
  );
}

const STATUS_STYLES: Record<ImplementationStatus, string> = {
  implemented:
    "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  partial:
    "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  "not-implemented":
    "bg-red-100 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  "not-applicable":
    "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  unassessed:
    "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700",
};

/** A small pill describing an implementation status. */
export function StatusBadge({ status }: { status: ImplementationStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {statusLabel(status)}
    </span>
  );
}
