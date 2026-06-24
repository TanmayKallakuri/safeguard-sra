"use client";

import Link from "next/link";
import { useAssessment } from "@/components/assessment-provider";
import { OrgHeader } from "@/components/dashboard/org-header";
import { ActionsBar } from "@/components/dashboard/actions-bar";
import { CategoryGrid } from "@/components/dashboard/category-grid";
import { ratingColor } from "@/lib/scoring";
import type { RatingCounts } from "@/lib/scoring";
import { formatDate, isUnsavedStamp } from "@/components/ui/format";

function Metric({
  value,
  label,
  hint,
  tone = "default",
}: {
  value: string;
  label: string;
  hint?: string;
  tone?: "default" | "warn" | "good";
}) {
  const valueColor =
    tone === "warn"
      ? "text-red-600 dark:text-red-400"
      : tone === "good"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-[var(--foreground)]";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className={`text-4xl font-bold tabular-nums tracking-tight ${valueColor}`}>
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-[var(--foreground)]">{label}</div>
      {hint ? <div className="mt-0.5 text-xs text-[var(--muted)]">{hint}</div> : null}
    </div>
  );
}

const RISK_ROWS: { key: keyof RatingCounts; rating: "critical" | "high" | "medium" | "low" }[] = [
  { key: "critical", rating: "critical" },
  { key: "high", rating: "high" },
  { key: "medium", rating: "medium" },
  { key: "low", rating: "low" },
];

function RiskDistribution({ counts }: { counts: RatingCounts }) {
  const total = counts.critical + counts.high + counts.medium + counts.low;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">Risk distribution</h2>
        <span className="text-xs text-[var(--muted)]">{total} open</span>
      </div>
      <ul className="mt-3 space-y-2">
        {RISK_ROWS.map(({ key, rating }) => {
          const c = ratingColor(rating);
          const n = counts[key];
          return (
            <li key={key} className="flex items-center gap-3">
              <span
                className={`inline-flex w-20 shrink-0 items-center justify-center rounded-full border px-2 py-0.5 text-xs font-semibold ${c.bg} ${c.text} ${c.border}`}
              >
                {c.label}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    rating === "critical"
                      ? "bg-red-500"
                      : rating === "high"
                        ? "bg-orange-500"
                        : rating === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                  }`}
                  style={{ width: total === 0 ? "0%" : `${(n / total) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right text-sm font-semibold tabular-nums">
                {n}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-slate-100 dark:bg-slate-900"
          />
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-40 rounded-xl bg-slate-100 dark:bg-slate-900"
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { summary, doc, ready } = useAssessment();

  if (!ready) return <DashboardSkeleton />;

  const openRisks =
    summary.riskCounts.critical +
    summary.riskCounts.high +
    summary.riskCounts.medium +
    summary.riskCounts.low;

  const lastSaved = isUnsavedStamp(doc.updatedAt)
    ? "Not saved yet"
    : `Updated ${formatDate(doc.updatedAt)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          HIPAA Security Risk Assessment
        </h1>
        <p className="max-w-2xl text-sm text-[var(--muted)]">
          Work through the HIPAA Security Rule safeguards, score each gap on a
          likelihood × impact matrix, and produce an audit-ready risk register and
          report.
        </p>
      </div>

      <section className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <OrgHeader />
        <p className="mt-3 text-xs text-[var(--muted)]">{lastSaved}</p>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Metric
          value={`${summary.compliancePct}%`}
          label="Overall compliance"
          hint={`${summary.statusCounts.implemented} of ${summary.applicable} applicable controls implemented`}
          tone={summary.compliancePct >= 80 ? "good" : undefined}
        />
        <Metric
          value={`${summary.assessedPct}%`}
          label="Assessed"
          hint={`${summary.assessed} of ${summary.total} controls reviewed`}
        />
        <Metric
          value={`${openRisks}`}
          label="Open risks"
          hint={
            summary.riskCounts.critical + summary.riskCounts.high > 0
              ? `${summary.riskCounts.critical + summary.riskCounts.high} high or critical`
              : "in the risk register"
          }
          tone={openRisks > 0 ? "warn" : "good"}
        />
      </section>

      <section className="mt-6 grid gap-3 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
              Safeguard categories
            </h2>
          </div>
          <CategoryGrid categories={summary.categories} />
        </div>
        <RiskDistribution counts={summary.riskCounts} />
      </section>

      <section className="mt-8 flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-gradient-to-br from-blue-50 to-[var(--surface)] p-5 dark:from-blue-950/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">
            {summary.assessed === 0
              ? "Start your assessment"
              : "Continue your assessment"}
          </h2>
          <p className="mt-0.5 text-sm text-[var(--muted)]">
            {summary.total - summary.assessed === 0
              ? "Every control has a status — review your risk register and report."
              : `${summary.total - summary.assessed} control${
                  summary.total - summary.assessed === 1 ? "" : "s"
                } still need a status.`}
          </p>
        </div>
        <Link
          href="/assess"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          {summary.assessed === 0 ? "Begin assessment" : "Continue assessment"}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </section>

      <section className="mt-8 border-t border-[var(--border)] pt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          Manage assessment
        </h2>
        <p className="mb-3 mt-1 text-xs text-[var(--muted)]">
          Everything is stored locally in your browser. Export to back it up or move
          it between machines.
        </p>
        <ActionsBar />
      </section>
    </div>
  );
}
