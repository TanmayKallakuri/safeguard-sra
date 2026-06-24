import type {
  ImplementationStatus,
  RiskRating,
  RiskLevel,
} from "@/lib/scoring";

/**
 * Dark-theme display tokens for risk ratings and implementation statuses.
 *
 * The locked lib helper `ratingColor()` in `src/lib/scoring/risk.ts` returns
 * light-mode Tailwind classes (bg-red-100 etc.) that don't fit this dark
 * "command console" theme. Rather than touch the locked file, the UI maps
 * ratings/statuses to its own dark tokens here. Same rating keys, dark styling.
 */

export interface RatingStyle {
  /** Tinted background. */
  bg: string;
  /** Bright readable text. */
  text: string;
  /** Border at ~/30 opacity. */
  border: string;
  /** Solid fill color (for bars / dots), as a CSS var or literal. */
  fill: string;
  /** Tailwind utility for the solid bar fill. */
  bar: string;
  label: string;
}

const RATING_STYLES: Record<RiskRating, RatingStyle> = {
  critical: {
    bg: "bg-[rgb(248_113_113_/_0.13)]",
    text: "text-[#fca5a5]",
    border: "border-[rgb(248_113_113_/_0.32)]",
    fill: "var(--critical)",
    bar: "bg-[var(--critical)]",
    label: "Critical",
  },
  high: {
    bg: "bg-[rgb(251_146_60_/_0.13)]",
    text: "text-[#fdba74]",
    border: "border-[rgb(251_146_60_/_0.32)]",
    fill: "var(--high)",
    bar: "bg-[var(--high)]",
    label: "High",
  },
  medium: {
    bg: "bg-[rgb(251_191_36_/_0.13)]",
    text: "text-[#fcd34d]",
    border: "border-[rgb(251_191_36_/_0.30)]",
    fill: "var(--medium)",
    bar: "bg-[var(--medium)]",
    label: "Medium",
  },
  low: {
    bg: "bg-[rgb(52_211_153_/_0.13)]",
    text: "text-[#6ee7b7]",
    border: "border-[rgb(52_211_153_/_0.30)]",
    fill: "var(--low)",
    bar: "bg-[var(--low)]",
    label: "Low",
  },
  none: {
    bg: "bg-white/[0.04]",
    text: "text-[var(--fg-faint)]",
    border: "border-[var(--border)]",
    fill: "var(--fg-faint)",
    bar: "bg-white/10",
    label: "None",
  },
};

/** Dark display tokens for a derived risk rating. */
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

const STATUS_STYLES: Record<ImplementationStatus, StatusStyle> = {
  implemented: {
    bg: "bg-[rgb(52_211_153_/_0.10)]",
    text: "text-[#6ee7b7]",
    border: "border-[rgb(52_211_153_/_0.28)]",
    active: "bg-[var(--low)] text-[#04130d]",
    bar: "bg-[var(--low)]",
    dot: "bg-[var(--low)]",
  },
  partial: {
    bg: "bg-[rgb(251_191_36_/_0.10)]",
    text: "text-[#fcd34d]",
    border: "border-[rgb(251_191_36_/_0.28)]",
    active: "bg-[var(--medium)] text-[#1a1300]",
    bar: "bg-[var(--medium)]",
    dot: "bg-[var(--medium)]",
  },
  "not-implemented": {
    bg: "bg-[rgb(248_113_113_/_0.10)]",
    text: "text-[#fca5a5]",
    border: "border-[rgb(248_113_113_/_0.28)]",
    active: "bg-[var(--critical)] text-[#1a0606]",
    bar: "bg-[var(--critical)]",
    dot: "bg-[var(--critical)]",
  },
  "not-applicable": {
    bg: "bg-white/[0.05]",
    text: "text-[var(--fg-muted)]",
    border: "border-[var(--border)]",
    active: "bg-[#3a4757] text-[var(--fg)]",
    bar: "bg-[#3a4757]",
    dot: "bg-[#3a4757]",
  },
  unassessed: {
    bg: "bg-white/[0.03]",
    text: "text-[var(--fg-faint)]",
    border: "border-[var(--border)]",
    active: "bg-white/15 text-[var(--fg)]",
    bar: "bg-white/12",
    dot: "bg-white/15",
  },
};

export function statusStyle(status: ImplementationStatus): StatusStyle {
  return STATUS_STYLES[status];
}

/** Title-case a low/medium/high level. */
export function levelLabel(level: RiskLevel | string): string {
  return level.charAt(0).toUpperCase() + level.slice(1);
}
