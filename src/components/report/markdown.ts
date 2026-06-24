import { CATEGORIES } from "@/lib/catalog";
import { ratingColor, statusLabel } from "@/lib/scoring";
import type {
  AssessmentDocument,
  AssessmentSummary,
  RiskRegisterEntry,
} from "@/lib/scoring";
import { formatDate, isUnsavedStamp } from "@/components/ui/format";

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Escape a value for use inside a Markdown table cell: pipes would otherwise be
 * read as column separators, and newlines would break the row.
 */
function mdEscape(s: string): string {
  return s.replace(/\r?\n/g, " ").replace(/\|/g, "\\|");
}

function categoryName(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

/**
 * Render the assessment as a self-contained Markdown report suitable for pasting
 * into a ticket, wiki, or email.
 */
export function buildReportMarkdown(
  doc: AssessmentDocument,
  summary: AssessmentSummary,
  register: RiskRegisterEntry[],
): string {
  const lines: string[] = [];
  const org = doc.orgName || "Organization";
  const date = isUnsavedStamp(doc.updatedAt)
    ? formatDate(new Date().toISOString())
    : formatDate(doc.updatedAt);

  lines.push(`# HIPAA Security Risk Assessment — ${org}`);
  lines.push("");
  lines.push(`**Assessor:** ${doc.assessorName || "—"}  `);
  lines.push(`**Date:** ${date}  `);
  lines.push(`**Framework:** HIPAA Security Rule (45 CFR Part 164, Subpart C)`);
  lines.push("");

  lines.push("## Executive summary");
  lines.push("");
  lines.push(
    `- **Overall compliance:** ${summary.compliancePct}% (${summary.statusCounts.implemented} of ${summary.applicable} applicable controls implemented)`,
  );
  lines.push(
    `- **Assessed:** ${summary.assessedPct}% (${summary.assessed} of ${summary.total} controls reviewed)`,
  );
  lines.push(`- **Open risks:** ${register.length}`);
  lines.push(
    `  - Critical: ${summary.riskCounts.critical} · High: ${summary.riskCounts.high} · Medium: ${summary.riskCounts.medium} · Low: ${summary.riskCounts.low}`,
  );
  lines.push("");
  lines.push(
    "**Methodology:** Risk = Likelihood × Impact on a 3×3 NIST SP 800-30-style matrix. Each safeguard with a Partial or Not Implemented status is rated for likelihood and impact (Low/Medium/High); the matrix derives a Low / Medium / High / Critical rating. Implemented and Not Applicable controls carry no open risk.",
  );
  lines.push("");

  lines.push("## Category compliance");
  lines.push("");
  lines.push("| Category | Citation | Compliance | Applicable | Top risk |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const cat of summary.categories) {
    const meta = CATEGORIES.find((c) => c.id === cat.category)!;
    const top = ratingColor(cat.topRisk).label;
    lines.push(
      `| ${mdEscape(meta.name)} | ${mdEscape(meta.citation)} | ${cat.compliancePct}% | ${cat.applicable} | ${mdEscape(top)} |`,
    );
  }
  lines.push("");

  lines.push("## Risk register");
  lines.push("");
  if (register.length === 0) {
    lines.push(
      "_No open risks — every assessed control is implemented or not applicable._",
    );
  } else {
    lines.push(
      "| Control | Citation | Status | Likelihood | Impact | Risk | Remediation |",
    );
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const e of register) {
      const control = `${e.control.name} (${categoryName(e.control.category).replace(" Safeguards", "")})`;
      lines.push(
        `| ${mdEscape(control)} | ${mdEscape(e.control.citation)} | ${mdEscape(statusLabel(e.status))} | ${mdEscape(cap(e.likelihood))} | ${mdEscape(cap(e.impact))} | ${mdEscape(ratingColor(e.rating).label)} | ${mdEscape(e.control.remediation)} |`,
      );
    }
  }
  lines.push("");
  lines.push("---");
  lines.push(
    "_Generated with Safeguard. Portfolio demonstration using a fictional clinic; not legal advice and does not by itself establish compliance._",
  );

  return lines.join("\n");
}
