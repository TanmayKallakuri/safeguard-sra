/**
 * Type definitions for the HIPAA Security Rule control catalog.
 *
 * The catalog mirrors the structure of the HIPAA Security Rule (45 CFR Part 164,
 * Subpart C), specifically the Standards and Implementation Specifications laid out
 * in Appendix A to Subpart C. Each assessable unit is a {@link Control}.
 */

/** The five safeguard groupings of the HIPAA Security Rule. */
export type SafeguardCategory =
  | "administrative" // 45 CFR § 164.308
  | "physical" // 45 CFR § 164.310
  | "technical" // 45 CFR § 164.312
  | "organizational" // 45 CFR § 164.314
  | "documentation"; // 45 CFR § 164.316

/**
 * HIPAA classifies each implementation specification as either Required or
 * Addressable. "Addressable" does NOT mean optional — it means the entity must
 * assess whether the spec is reasonable and appropriate, and either implement it,
 * implement an equivalent alternative, or document why it is not reasonable.
 */
export type SpecRequirement = "required" | "addressable";

/** Display metadata for a safeguard category. */
export interface CategoryMeta {
  id: SafeguardCategory;
  /** e.g. "Administrative Safeguards" */
  name: string;
  /** e.g. "45 CFR § 164.308" */
  citation: string;
  /** Short plain-language summary of what this category covers. */
  description: string;
}

/**
 * A single assessable control. In HIPAA terms this is an Implementation
 * Specification, or — for Standards that have no separate specifications — the
 * Standard itself (which must still be met).
 */
export interface Control {
  /** Stable unique id, e.g. "164.308(a)(1)(ii)(A)". */
  id: string;
  /** Full citation, e.g. "45 CFR § 164.308(a)(1)(ii)(A)". */
  citation: string;
  category: SafeguardCategory;
  /** The parent Standard's id, e.g. "164.308(a)(1)". */
  standardId: string;
  /** The parent Standard's name, e.g. "Security Management Process". */
  standardName: string;
  /** This control's name, e.g. "Risk Analysis". */
  name: string;
  requirement: SpecRequirement;
  /** Plain-language description of what the control requires. */
  description: string;
  /** Default remediation guidance shown when this control is a gap. */
  remediation: string;
}
