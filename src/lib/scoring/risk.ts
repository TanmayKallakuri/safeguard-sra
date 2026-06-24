import type { Control } from "@/lib/catalog";
import type {
  ControlResponse,
  ImplementationStatus,
  RiskLevel,
  RiskRating,
} from "./types";
import { RATING_ORDER } from "./types";

/**
 * The 3×3 risk matrix (NIST SP 800-30 style), mapping Likelihood × Impact to a
 * qualitative risk rating. Rows are likelihood, columns are impact.
 *
 *                 Impact:  low      medium    high
 *   Likelihood low         low      low       medium
 *   Likelihood medium      low      medium    high
 *   Likelihood high        medium   high      critical
 */
const RISK_MATRIX: Record<RiskLevel, Record<RiskLevel, Exclude<RiskRating, "none">>> = {
  low: { low: "low", medium: "low", high: "medium" },
  medium: { low: "low", medium: "medium", high: "high" },
  high: { low: "medium", medium: "high", high: "critical" },
};

/** Default rating dimension used for a gap whose likelihood/impact is unset. */
export const DEFAULT_RISK_LEVEL: RiskLevel = "medium";

/** Derive the risk rating for a Likelihood × Impact pair. */
export function riskRating(
  likelihood: RiskLevel,
  impact: RiskLevel,
): Exclude<RiskRating, "none"> {
  return RISK_MATRIX[likelihood][impact];
}

/** A control is an open "gap" when it is partially or not implemented. */
export function isGap(status: ImplementationStatus): boolean {
  return status === "partial" || status === "not-implemented";
}

/**
 * Resolve a response to a status, treating a missing response as unassessed.
 */
export function statusOf(response: ControlResponse | undefined): ImplementationStatus {
  return response?.status ?? "unassessed";
}

/**
 * Compute the risk rating for a single control given its response.
 * - Implemented, Not Applicable, and Unassessed carry no open risk → "none".
 * - Gaps use the response's likelihood/impact, each defaulting to "medium"
 *   when the assessor has not set it yet.
 */
export function controlRating(response: ControlResponse | undefined): RiskRating {
  const status = statusOf(response);
  if (!isGap(status)) return "none";
  const likelihood = response?.likelihood ?? DEFAULT_RISK_LEVEL;
  const impact = response?.impact ?? DEFAULT_RISK_LEVEL;
  return riskRating(likelihood, impact);
}

/** Return whichever rating is more severe. "none" is the least severe. */
export function maxRating(a: RiskRating, b: RiskRating): RiskRating {
  return severityIndex(a) >= severityIndex(b) ? a : b;
}

/** Numeric severity for ordering ratings ("none" = 0 … "critical" = 4). */
export function severityIndex(rating: RiskRating): number {
  if (rating === "none") return 0;
  return RATING_ORDER.indexOf(rating) + 1;
}

/** Tailwind-friendly colour tokens for a rating, used across the UI. */
export function ratingColor(rating: RiskRating): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (rating) {
    case "critical":
      return { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", label: "Critical" };
    case "high":
      return { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300", label: "High" };
    case "medium":
      return { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300", label: "Medium" };
    case "low":
      return { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300", label: "Low" };
    default:
      return { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", label: "None" };
  }
}

/** Human label for an implementation status. */
export function statusLabel(status: ImplementationStatus): string {
  switch (status) {
    case "implemented":
      return "Implemented";
    case "partial":
      return "Partial";
    case "not-implemented":
      return "Not Implemented";
    case "not-applicable":
      return "Not Applicable";
    default:
      return "Unassessed";
  }
}

/** Convenience: does this control object represent a gap under the response? */
export function controlIsGap(
  _control: Control,
  response: ControlResponse | undefined,
): boolean {
  return isGap(statusOf(response));
}
