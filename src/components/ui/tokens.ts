import type {
  ImplementationStatus,
  RiskRating,
  RiskLevel,
} from "@/lib/scoring";

/**
 * Light-glass display tokens for risk ratings and implementation statuses.
 *
 * The locked lib helper `ratingColor()` (in `src/lib/scoring/risk.ts`) returns
 * its own light Tailwind classes; the UI maps ratings/statuses to these tokens
 * instead so chips stay clearly distinct and AA-legible on the frosted-white
 * surfaces. Same rating keys — only the styling changes.
 */

export interface RatingStyle {
  /** Soft tinted background for chips. */
  bg: string;
  /** Dark, AA-legible text. */
  text: string;
  /** Border at low opacity. */
  border: string;
  /** Solid fill (CSS var) for bars, cells, dots. */
  fill: string;
  /** Tailwind utility for a solid bar/dot fill. */
  bar: string;
  label: string;
}

const RATING_STYLES: Record<RiskRating, RatingStyle> = {
  critical: {
    bg: "bg-[rgb(220_38_38_/_0.1)]",
    text: "text-[#b91c1c]",
    border: "border-[rgb(220_38_38_/_0.3)]",
    fill: "var(--critical)",
    bar: "bg-[var(--critical)]",
    label: "CRIT",
  },
  high: {
    bg: "bg-[rgb(234_88_12_/_0.1)]",
    text: "text-[#c2410c]",
    border: "border-[rgb(234_88_12_/_0.3)]",
    fill: "var(--high)",
    bar: "bg-[var(--high)]",
    label: "HIGH",
  },
  medium: {
    bg: "bg-[rgb(202_138_4_/_0.12)]",
    text: "text-[#a16207]",
    border: "border-[rgb(202_138_4_/_0.32)]",
    fill: "var(--medium)",
    bar: "bg-[var(--medium)]",
    label: "MED",
  },
  low: {
    bg: "bg-[rgb(5_150_105_/_0.1)]",
    text: "text-[#047857]",
    border: "border-[rgb(5_150_105_/_0.3)]",
    fill: "var(--low)",
    bar: "bg-[var(--low)]",
    label: "LOW",
  },
  none: {
    bg: "bg-[var(--glass-inset)]",
    text: "text-[var(--fg-faint)]",
    border: "border-[var(--rule)]",
    fill: "var(--fg-faint)",
    bar: "bg-[var(--rule-strong)]",
    label: "—",
  },
};

/** Light-glass display tokens for a derived risk rating. */
export function ratingStyle(rating: RiskRating): RatingStyle {
  return RATING_STYLES[rating];
}

export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
  /** Solid active fill used by the segmented control. */
  active: string;
  bar: string;
  dot: string;
}

const STATUS_FILL: Record<ImplementationStatus, string> = {
  implemented: "var(--low)",
  partial: "var(--medium)",
  "not-implemented": "var(--critical)",
  "not-applicable": "var(--fg-faint)",
  unassessed: "var(--rule-strong)",
};

const STATUS_FULL: Record<ImplementationStatus, StatusStyle> = {
  implemented: {
    bg: "bg-[rgb(5_150_105_/_0.1)]",
    text: "text-[#047857]",
    border: "border-[rgb(5_150_105_/_0.3)]",
    active: "bg-[#047857] text-white",
    bar: "bg-[var(--low)]",
    dot: "bg-[var(--low)]",
  },
  partial: {
    bg: "bg-[rgb(202_138_4_/_0.12)]",
    text: "text-[#a16207]",
    border: "border-[rgb(202_138_4_/_0.32)]",
    active: "bg-[#a16207] text-white",
    bar: "bg-[var(--medium)]",
    dot: "bg-[var(--medium)]",
  },
  "not-implemented": {
    bg: "bg-[rgb(220_38_38_/_0.1)]",
    text: "text-[#b91c1c]",
    border: "border-[rgb(220_38_38_/_0.3)]",
    active: "bg-[var(--critical)] text-white",
    bar: "bg-[var(--critical)]",
    dot: "bg-[var(--critical)]",
  },
  "not-applicable": {
    bg: "bg-[rgb(30_41_59_/_0.05)]",
    text: "text-[var(--fg-muted)]",
    border: "border-[var(--rule)]",
    active: "bg-[#64748b] text-white",
    bar: "bg-[#94a3b8]",
    dot: "bg-[#94a3b8]",
  },
  unassessed: {
    bg: "bg-[rgb(30_41_59_/_0.03)]",
    text: "text-[var(--fg-faint)]",
    border: "border-[var(--rule)]",
    active: "bg-[#64748b] text-white",
    bar: "bg-[var(--rule-strong)]",
    dot: "bg-[var(--rule-strong)]",
  },
};

export function statusStyle(status: ImplementationStatus): StatusStyle {
  return STATUS_FULL[status];
}

/** Raw fill color (CSS var) for a status — used by stacked density bars. */
export function statusFill(status: ImplementationStatus): string {
  return STATUS_FILL[status];
}

/** Title-case a low/medium/high level. */
export function levelLabel(level: RiskLevel | string): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}
