"use client";

import { CATEGORIES } from "@/lib/catalog";
import { useAssessment } from "@/components/assessment-provider";
import { ReportToolbar } from "@/components/report/report-toolbar";
import { RatingBadge, StatusBadge } from "@/components/ui/badges";
import { formatDate, isUnsavedStamp } from "@/components/ui/format";

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ReportSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-9 w-80 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 h-40 rounded-xl bg-slate-100 dark:bg-slate-900" />
      <div className="mt-6 h-64 rounded-xl bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}

export default function ReportPage() {
  const { doc, summary, register, ready } = useAssessment();

  if (!ready) return <ReportSkeleton />;

  const reportDate = isUnsavedStamp(doc.updatedAt)
    ? formatDate(new Date().toISOString())
    : formatDate(doc.updatedAt);

  return (
    <div className="print-container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="no-print mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--muted)]">
          A one-page summary you can print, save as PDF, or copy as Markdown.
        </p>
        <ReportToolbar />
      </div>

      {/* Report header */}
      <header className="border-b-2 border-[var(--foreground)] pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          HIPAA Security Risk Assessment
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {doc.orgName || "Organization"}
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--muted)]">
          <span>
            <span className="font-medium text-[var(--foreground)]">Assessor:</span>{" "}
            {doc.assessorName || "—"}
          </span>
          <span>
            <span className="font-medium text-[var(--foreground)]">Date:</span>{" "}
            {reportDate}
          </span>
          <span>
            <span className="font-medium text-[var(--foreground)]">Framework:</span>{" "}
            45 CFR Part 164, Subpart C
          </span>
        </div>
      </header>

      {/* Executive summary */}
      <section className="mt-6 print-avoid-break">
        <h2 className="text-lg font-semibold">Executive summary</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SummaryStat
            value={`${summary.compliancePct}%`}
            label="Compliance"
          />
          <SummaryStat value={`${summary.assessedPct}%`} label="Assessed" />
          <SummaryStat value={`${register.length}`} label="Open risks" />
          <SummaryStat
            value={`${summary.riskCounts.critical + summary.riskCounts.high}`}
            label="High / critical"
          />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
          <span className="font-medium text-[var(--foreground)]">Methodology.</span>{" "}
          Risk = Likelihood × Impact on a 3×3 NIST SP 800-30-style matrix. Each
          safeguard marked Partial or Not Implemented is rated for likelihood and
          impact (Low / Medium / High); the matrix derives a Low / Medium / High /
          Critical rating. Implemented and Not Applicable controls carry no open
          risk. Of {summary.total} controls in the catalog, {summary.assessed} have
          been reviewed.
        </p>
      </section>

      {/* Category compliance table */}
      <section className="mt-8 print-avoid-break">
        <h2 className="text-lg font-semibold">Category compliance</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-slate-900">
                <th className="px-3 py-2 font-semibold">Safeguard category</th>
                <th className="px-3 py-2 font-semibold">Citation</th>
                <th className="px-3 py-2 text-right font-semibold">Compliance</th>
                <th className="px-3 py-2 text-right font-semibold">Applicable</th>
                <th className="px-3 py-2 font-semibold">Top risk</th>
              </tr>
            </thead>
            <tbody>
              {summary.categories.map((cat) => {
                const meta = CATEGORIES.find((c) => c.id === cat.category)!;
                return (
                  <tr
                    key={cat.category}
                    className="border-t border-[var(--border)] bg-[var(--surface)]"
                  >
                    <td className="px-3 py-2 font-medium">{meta.name}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-[var(--muted)]">
                      {meta.citation}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {cat.compliancePct}%
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-[var(--muted)]">
                      {cat.applicable}
                    </td>
                    <td className="px-3 py-2">
                      <RatingBadge rating={cat.topRisk} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Full risk register */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Risk register</h2>
          <span className="text-xs text-[var(--muted)]">
            {register.length} open risk{register.length === 1 ? "" : "s"},
            worst-first
          </span>
        </div>
        {register.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            No open risks — every assessed control is implemented or not
            applicable.
          </p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-slate-900">
                  <th className="px-3 py-2 font-semibold">Control</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">L</th>
                  <th className="px-3 py-2 font-semibold">I</th>
                  <th className="px-3 py-2 font-semibold">Risk</th>
                  <th className="px-3 py-2 font-semibold">Remediation</th>
                </tr>
              </thead>
              <tbody>
                {register.map((entry) => (
                  <tr
                    key={entry.control.id}
                    className="border-t border-[var(--border)] align-top bg-[var(--surface)] print-avoid-break"
                  >
                    <td className="px-3 py-2">
                      <span className="font-medium">{entry.control.name}</span>
                      <span className="mt-0.5 block font-mono text-[10px] text-[var(--muted)]">
                        {entry.control.citation}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-3 py-2 text-[var(--muted)]">
                      {cap(entry.likelihood)}
                    </td>
                    <td className="px-3 py-2 text-[var(--muted)]">
                      {cap(entry.impact)}
                    </td>
                    <td className="px-3 py-2">
                      <RatingBadge rating={entry.rating} />
                    </td>
                    <td className="px-3 py-2 text-xs leading-relaxed text-[var(--muted)]">
                      {entry.control.remediation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="mt-8 border-t border-[var(--border)] pt-4 text-xs text-[var(--muted)]">
        Generated with Safeguard. Portfolio demonstration using a fictional clinic;
        not legal advice and does not by itself establish compliance.
      </footer>
    </div>
  );
}

function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3">
      <div className="text-2xl font-bold tabular-nums tracking-tight">{value}</div>
      <div className="text-xs text-[var(--muted)]">{label}</div>
    </div>
  );
}
