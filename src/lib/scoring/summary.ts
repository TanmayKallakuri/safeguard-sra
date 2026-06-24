import type { Control, SafeguardCategory } from "@/lib/catalog";
import { CATEGORIES, CONTROLS } from "@/lib/catalog";
import type {
  AssessmentDocument,
  AssessmentSummary,
  CategorySummary,
  RatingCounts,
  RiskRegisterEntry,
  StatusCounts,
} from "./types";
import {
  controlRating,
  DEFAULT_RISK_LEVEL,
  isGap,
  maxRating,
  severityIndex,
  statusOf,
} from "./risk";

function emptyStatusCounts(): StatusCounts {
  return {
    implemented: 0,
    partial: 0,
    "not-implemented": 0,
    "not-applicable": 0,
    unassessed: 0,
  };
}

function emptyRatingCounts(): RatingCounts {
  return { low: 0, medium: 0, high: 0, critical: 0 };
}

function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 100;
  return Math.round((numerator / denominator) * 100);
}

/** Summarise a single category's controls under the given assessment. */
function summarizeCategory(
  category: SafeguardCategory,
  controls: Control[],
  doc: AssessmentDocument,
): CategorySummary {
  const statusCounts = emptyStatusCounts();
  const riskCounts = emptyRatingCounts();
  let topRisk = maxRating("none", "none"); // "none"

  for (const control of controls) {
    const response = doc.responses[control.id];
    const status = statusOf(response);
    statusCounts[status] += 1;

    const rating = controlRating(response);
    if (rating !== "none") {
      riskCounts[rating] += 1;
      topRisk = maxRating(topRisk, rating);
    }
  }

  const applicable = controls.length - statusCounts["not-applicable"];
  return {
    category,
    total: controls.length,
    statusCounts,
    applicable,
    compliancePct: pct(statusCounts.implemented, applicable),
    riskCounts,
    topRisk,
  };
}

/**
 * Produce the full roll-up for an assessment: per-category and overall status
 * counts, compliance percentages, and risk distribution.
 */
export function summarize(doc: AssessmentDocument): AssessmentSummary {
  const categories: CategorySummary[] = CATEGORIES.map((meta) => {
    const controls = CONTROLS.filter((c) => c.category === meta.id);
    return summarizeCategory(meta.id, controls, doc);
  });

  const statusCounts = emptyStatusCounts();
  const riskCounts = emptyRatingCounts();
  for (const cat of categories) {
    (Object.keys(statusCounts) as (keyof StatusCounts)[]).forEach((k) => {
      statusCounts[k] += cat.statusCounts[k];
    });
    (Object.keys(riskCounts) as (keyof RatingCounts)[]).forEach((k) => {
      riskCounts[k] += cat.riskCounts[k];
    });
  }

  const total = CONTROLS.length;
  const assessed = total - statusCounts.unassessed;
  const applicable = total - statusCounts["not-applicable"];
  const registerCount =
    riskCounts.low + riskCounts.medium + riskCounts.high + riskCounts.critical;

  return {
    total,
    assessed,
    assessedPct: pct(assessed, total),
    statusCounts,
    applicable,
    compliancePct: pct(statusCounts.implemented, applicable),
    riskCounts,
    categories,
    registerCount,
  };
}

/**
 * Build the risk register: one entry per open gap, sorted by descending
 * severity (Critical → Low) and then by control id for stable ordering.
 */
export function buildRegister(doc: AssessmentDocument): RiskRegisterEntry[] {
  const entries: RiskRegisterEntry[] = [];

  for (const control of CONTROLS) {
    const response = doc.responses[control.id];
    const status = statusOf(response);
    if (!isGap(status)) continue;

    const likelihood = response?.likelihood ?? DEFAULT_RISK_LEVEL;
    const impact = response?.impact ?? DEFAULT_RISK_LEVEL;
    const rating = controlRating(response);
    // isGap guarantees a real rating, but narrow the type for TypeScript.
    if (rating === "none") continue;

    entries.push({
      control,
      status,
      likelihood,
      impact,
      rating,
      notes: response?.notes,
    });
  }

  entries.sort((a, b) => {
    const bySeverity = severityIndex(b.rating) - severityIndex(a.rating);
    if (bySeverity !== 0) return bySeverity;
    return a.control.id.localeCompare(b.control.id);
  });

  return entries;
}
