import type {
  ImplementationStatus,
  RiskRating,
  RiskLevel,
} from "@/lib/scoring";

/**
 * Threat-console display tokens for risk ratings and implementation statuses.
 *
 * The locked lib helper `ratingColor()` (in `src/lib/scoring/risk.ts`) returns
 * light-mode Tailwind classes that don't fit this dark console theme. Rather
 * than touch the locked file, the UI maps ratings/statuses to its own dark
 * tokens here. Same rating keys, terminal styling — the risk signal is the only
 * saturated color in the whole interface.
 */

export interface RatingStyle {
  /** Tinted background for badges/cells. */
  bg: string;
  /** Bright readable text. */
  text: string;
  /** Border at low opacity. */
  border: string;
  /** Solid fill (CSS color/var) for bars, cells, dots. */
  fill: string;
  /** Tailwind utility for a solid bar/dot fill. */
  bar: string;
  label: string;
}

const RATING_STYLES: Record<RiskRating, RatingStyle> = {
  critical: {
    bg: "bg-[rgb(245_84_79_/_0.14)]",
    text: "text-[#f87b77]",
    border: "border-[rgb(245_84_79_/_0.4)]",
    fill: "var(--critical)",
    bar: "bg-[var(--critical)]",
    label: "CRIT",
  },
  high: {
    bg: "bg-[rgb(245_147_74_/_0.14)]",
    text: "text-[#f7ab73]",
    border: "border-[rgb(245_147_74_/_0.4)]",
    fill: "var(--high)",
    bar: "bg-[var(--high)]",
    label: "HIGH",
  },
  medium: {
    bg: "bg-[rgb(232_193_74_/_0.13)]",
    text: "text-[#edcf73]",
    border: "border-[rgb(232_193_74_/_0.38)]",
    fill: "var(--medium)",
    bar: "bg-[var(--medium)]",
    label: "MED",
  },
  low: {
    bg: "bg-[rgb(70_194_133_/_0.13)]",
    text: "text-[#6dd1a3]",
    border: "border-[rgb(70_194_133_/_0.36)]",
    fill: "var(--low)",
    bar: "bg-[var(--low)]",
    label: "LOW",
  },
  none: {
    bg: "bg-transparent",
    text: "text-[var(--fg-faint)]",
    border: "border-[var(--rule)]",
    fill: "var(--fg-faint)",
    bar: "bg-[var(--rule-strong)]",
    label: "—",
  },
};

/** Threat-console display tokens for a derived risk rating. */
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
    bg: "bg-[rgb(70_194_133_/_0.1)]",
    text: "text-[#6dd1a3]",
    border: "border-[rgb(70_194_133_/_0.34)]",
    active: "bg-[var(--low)] text-[#04120b]",
    bar: "bg-[var(--low)]",
    dot: "bg-[var(--low)]",
  },
  partial: {
    bg: "bg-[rgb(232_193_74_/_0.1)]",
    text: "text-[#edcf73]",
    border: "border-[rgb(232_193_74_/_0.34)]",
    active: "bg-[var(--medium)] text-[#161100]",
    bar: "bg-[var(--medium)]",
    dot: "bg-[var(--medium)]",
  },
  "not-implemented": {
    bg: "bg-[rgb(245_84_79_/_0.1)]",
    text: "text-[#f87b77]",
    border: "border-[rgb(245_84_79_/_0.34)]",
    active: "bg-[var(--critical)] text-[#160404]",
    bar: "bg-[var(--critical)]",
    dot: "bg-[var(--critical)]",
  },
  "not-applicable": {
    bg: "bg-white/[0.04]",
    text: "text-[var(--fg-muted)]",
    border: "border-[var(--rule)]",
    active: "bg-[#3a4654] text-[var(--fg)]",
    bar: "bg-[#3a4654]",
    dot: "bg-[#3a4654]",
  },
  unassessed: {
    bg: "bg-white/[0.02]",
    text: "text-[var(--fg-faint)]",
    border: "border-[var(--rule)]",
    active: "bg-white/15 text-[var(--fg)]",
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
