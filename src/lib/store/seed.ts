import type { AssessmentDocument, ControlResponse } from "@/lib/scoring";

/**
 * A seeded, fictional sample assessment so the live demo is never empty.
 *
 * "Riverbend Family Clinic" is an invented small primary-care practice. It
 * contains NO real protected health information and refers to no real
 * organization. It models a realistic mid-assessment posture: solid basics,
 * a few serious gaps (no completed risk analysis, no incident response plan,
 * ePHI not encrypted at rest), and a couple of Not Applicable items.
 */
const responses: Record<string, ControlResponse> = {
  // Security Management Process — the classic weak spot
  "164.308(a)(1)(ii)(A)": {
    status: "partial",
    likelihood: "high",
    impact: "high",
    notes: "A vendor questionnaire was completed in 2023 but no formal, current risk analysis exists.",
  },
  "164.308(a)(1)(ii)(B)": {
    status: "not-implemented",
    likelihood: "high",
    impact: "high",
    notes: "No documented risk management process; remediation is ad hoc.",
  },
  "164.308(a)(1)(ii)(C)": { status: "implemented", notes: "Sanction policy in the employee handbook." },
  "164.308(a)(1)(ii)(D)": {
    status: "partial",
    likelihood: "medium",
    impact: "medium",
    notes: "EHR logs exist but are reviewed only after an incident, not regularly.",
  },

  "164.308(a)(2)": { status: "implemented", notes: "Office manager designated as Security Official." },

  "164.308(a)(5)(ii)(D)": {
    status: "partial",
    likelihood: "medium",
    impact: "high",
    notes: "Password policy exists; MFA not yet enforced on the EHR.",
  },

  "164.308(a)(6)(ii)": {
    status: "not-implemented",
    likelihood: "high",
    impact: "high",
    notes: "No written incident response plan.",
  },

  "164.308(a)(7)(ii)(A)": { status: "implemented", notes: "Nightly encrypted cloud backups of the EHR." },
  "164.308(a)(7)(ii)(B)": {
    status: "partial",
    likelihood: "medium",
    impact: "high",
    notes: "Backups exist but recovery has never been tested.",
  },

  "164.308(b)(4)": {
    status: "not-implemented",
    likelihood: "medium",
    impact: "high",
    notes: "No central BAA register; several vendor BAAs unaccounted for.",
  },

  // Information Access Management — not a clearinghouse
  "164.308(a)(4)(ii)(A)": { status: "not-applicable", notes: "Clinic is not a health care clearinghouse." },

  // Physical
  "164.310(a)(2)(ii)": { status: "implemented", notes: "Locked server closet, alarmed premises." },
  "164.310(d)(2)(i)": {
    status: "partial",
    likelihood: "low",
    impact: "medium",
    notes: "Old drives are physically destroyed, but no destruction log is kept.",
  },

  // Technical
  "164.312(a)(2)(i)": { status: "implemented", notes: "Unique EHR logins per staff member." },
  "164.312(a)(2)(iv)": {
    status: "not-implemented",
    likelihood: "medium",
    impact: "high",
    notes: "ePHI on the local file server is not encrypted at rest.",
  },
  "164.312(b)": {
    status: "partial",
    likelihood: "medium",
    impact: "medium",
    notes: "EHR audit logging on; file server logging off.",
  },
  "164.312(d)": { status: "implemented", notes: "Named accounts with passwords on all systems." },
  "164.312(e)(2)(ii)": { status: "implemented", notes: "All EHR traffic over TLS; secure messaging for referrals." },

  // Organizational — no group health plan
  "164.314(b)(2)": { status: "not-applicable", notes: "Clinic does not sponsor a group health plan." },

  // Documentation
  "164.316(a)": {
    status: "partial",
    likelihood: "medium",
    impact: "medium",
    notes: "Some policies exist but are not mapped to the Security Rule.",
  },
  "164.316(b)(2)(i)": { status: "implemented", notes: "6-year retention enforced in document management." },
};

export const SAMPLE_ASSESSMENT: AssessmentDocument = {
  id: "sample-riverbend",
  orgName: "Riverbend Family Clinic (sample)",
  assessorName: "Demo Assessor",
  updatedAt: "2026-06-01T00:00:00.000Z",
  responses,
};
