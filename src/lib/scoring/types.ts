import type { Control, SafeguardCategory } from "@/lib/catalog";

/** How fully a control is implemented in the organization being assessed. */
export type ImplementationStatus =
  | "implemented"
  | "partial"
  | "not-implemented"
  | "not-applicable"
  | "unassessed";

/** A Low/Medium/High scale, used for both likelihood and impact. */
export type RiskLevel = "low" | "medium" | "high";

/** The derived risk rating for a gap. "none" means there is no open risk. */
export type RiskRating = "none" | "low" | "medium" | "high" | "critical";

/** The non-"none" ratings, in ascending severity. */
export const RATING_ORDER = ["low", "medium", "high", "critical"] as const;

/** A user's response for a single control. */
export interface ControlResponse {
  status: ImplementationStatus;
  /** Likelihood that the gap is exploited/realized. Only meaningful for gaps. */
  likelihood?: RiskLevel;
  /** Impact if the gap is realized. Only meaningful for gaps. */
  impact?: RiskLevel;
  notes?: string;
}

/** A complete assessment document for one organization. */
export interface AssessmentDocument {
  /** Stable id for this assessment (used as the localStorage key suffix). */
  id: string;
  orgName: string;
  assessorName: string;
  /** ISO timestamp of the last edit. */
  updatedAt: string;
  /** Responses keyed by control id. Missing controls are treated as unassessed. */
  responses: Record<string, ControlResponse>;
}

/** Counts of the four real ratings (excludes "none"). */
export type RatingCounts = Record<Exclude<RiskRating, "none">, number>;

/** Counts of every implementation status. */
export type StatusCounts = Record<ImplementationStatus, number>;

/** Roll-up for a single safeguard category. */
export interface CategorySummary {
  category: SafeguardCategory;
  total: number;
  statusCounts: StatusCounts;
  /** Controls that apply (total minus Not Applicable). */
  applicable: number;
  /** implemented / applicable, as a 0–100 integer. */
  compliancePct: number;
  riskCounts: RatingCounts;
  /** Highest rating present in this category, or "none". */
  topRisk: RiskRating;
}

/** Roll-up for the whole assessment. */
export interface AssessmentSummary {
  total: number;
  /** Controls with any status other than unassessed. */
  assessed: number;
  /** assessed / total, as a 0–100 integer. */
  assessedPct: number;
  statusCounts: StatusCounts;
  applicable: number;
  compliancePct: number;
  riskCounts: RatingCounts;
  categories: CategorySummary[];
  /** Number of entries in the risk register (i.e. number of open gaps). */
  registerCount: number;
}

/** One row of the risk register: a gap with its derived rating. */
export interface RiskRegisterEntry {
  control: Control;
  status: ImplementationStatus;
  likelihood: RiskLevel;
  impact: RiskLevel;
  rating: Exclude<RiskRating, "none">;
  notes?: string;
}
