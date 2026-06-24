import type {
  AssessmentDocument,
  ControlResponse,
  ImplementationStatus,
  RiskLevel,
} from "@/lib/scoring";
import { SAMPLE_ASSESSMENT } from "./seed";

const STORAGE_KEY = "safeguard.assessment.v1";

/** A blank assessment with no responses. */
export function emptyAssessment(): AssessmentDocument {
  return {
    id: "assessment",
    orgName: "",
    assessorName: "",
    updatedAt: "1970-01-01T00:00:00.000Z",
    responses: {},
  };
}

/** A fresh copy of the seeded sample assessment. */
export function sampleAssessment(): AssessmentDocument {
  return structuredClone(SAMPLE_ASSESSMENT);
}

/** True only in a browser context with localStorage available. */
function hasStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/**
 * Load the saved assessment. On first run (nothing saved yet) returns the
 * seeded sample so the app is immediately populated. Falls back to the sample
 * if stored data is missing or corrupt.
 */
export function loadAssessment(): AssessmentDocument {
  if (!hasStorage()) return sampleAssessment();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return sampleAssessment();
  const parsed = safeParse(raw);
  return parsed ?? sampleAssessment();
}

/** Persist the assessment, stamping updatedAt. Caller passes the timestamp. */
export function saveAssessment(doc: AssessmentDocument, now: string): AssessmentDocument {
  const stamped: AssessmentDocument = { ...doc, updatedAt: now };
  if (hasStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stamped));
  }
  return stamped;
}

/** Remove saved data (used by "Start over"). */
export function clearAssessment(): void {
  if (hasStorage()) window.localStorage.removeItem(STORAGE_KEY);
}

/** Serialize the assessment for download. */
export function exportAssessment(doc: AssessmentDocument): string {
  return JSON.stringify(doc, null, 2);
}

/**
 * Parse and validate an imported assessment JSON string. Returns the validated
 * document or null if it is not a recognizable assessment.
 */
export function importAssessment(raw: string): AssessmentDocument | null {
  return safeParse(raw);
}

const VALID_STATUSES: ImplementationStatus[] = [
  "implemented",
  "partial",
  "not-implemented",
  "not-applicable",
  "unassessed",
];
const VALID_LEVELS: RiskLevel[] = ["low", "medium", "high"];

/** Defensive parse: tolerates unknown fields, rejects structurally invalid data. */
function safeParse(raw: string): AssessmentDocument | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;
  if (typeof obj.responses !== "object" || obj.responses === null) return null;

  const cleanResponses: Record<string, ControlResponse> = {};
  for (const [id, value] of Object.entries(obj.responses as Record<string, unknown>)) {
    const resp = sanitizeResponse(value);
    if (resp) cleanResponses[id] = resp;
  }

  return {
    id: typeof obj.id === "string" ? obj.id : "assessment",
    orgName: typeof obj.orgName === "string" ? obj.orgName : "",
    assessorName: typeof obj.assessorName === "string" ? obj.assessorName : "",
    updatedAt:
      typeof obj.updatedAt === "string" ? obj.updatedAt : "1970-01-01T00:00:00.000Z",
    responses: cleanResponses,
  };
}

function sanitizeResponse(value: unknown): ControlResponse | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  const status = v.status;
  if (typeof status !== "string" || !VALID_STATUSES.includes(status as ImplementationStatus)) {
    return null;
  }
  const resp: ControlResponse = { status: status as ImplementationStatus };
  if (typeof v.likelihood === "string" && VALID_LEVELS.includes(v.likelihood as RiskLevel)) {
    resp.likelihood = v.likelihood as RiskLevel;
  }
  if (typeof v.impact === "string" && VALID_LEVELS.includes(v.impact as RiskLevel)) {
    resp.impact = v.impact as RiskLevel;
  }
  if (typeof v.notes === "string") resp.notes = v.notes;
  return resp;
}

export { STORAGE_KEY };
