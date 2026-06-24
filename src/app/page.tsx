"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { useAssessment } from "@/components/assessment-provider";
import { OrgHeader } from "@/components/dashboard/org-header";
import { ActionsBar } from "@/components/dashboard/actions-bar";
import { CategoryGrid } from "@/components/dashboard/category-grid";
import type { RatingCounts } from "@/lib/scoring";
import { formatDate, isUnsavedStamp } from "@/components/ui/format";
import { CountUp, GrowBar, Rise, Stagger, POP } from "@/components/ui/motion";
import { ratingStyle } from "@/components/ui/tokens";

function Metric({
  value,
  suffix = "",
  label,
  hint,
  tone = "default",
  glow,
}: {
  value: number;
  suffix?: string;
  label: string;
  hint?: string;
  tone?: "default" | "warn" | "good";
  glow?: "critical" | "high" | null;
}) {
  const valueColor =
    tone === "warn"
      ? "text-[#fca5a5]"
      : tone === "good"
        ? "text-[#6ee7b7]"
        : "text-[var(--fg)]";
  return (
    <div className="panel relative overflow-hidden rounded-xl p-5">
      {glow ? (
        <div
          className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full blur-2xl"
          style={{
            background:
              glow === "critical"
                ? "rgb(248 113 113 / 0.18)"
                : "rgb(251 146 60 / 0.16)",
          }}
          aria-hidden="true"
        />
      ) : null}
      <div
        className={`relative font-mono text-[2.75rem] font-semibold leading-none tabular-nums tracking-tight ${valueColor}`}
      >
        <CountUp value={value} suffix={suffix} />
      </div>
      <div className="relative mt-2.5 text-sm font-medium text-[var(--fg)]">
        {label}
      </div>
      {hint ? (
        <div className="relative mt-0.5 text-xs text-[var(--fg-muted)]">{hint}</div>
      ) : null}
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
    <div className="panel rounded-xl p-5">
      <div className="flex items-baseline justify-between">
        <h2 className="eyebrow !text-[var(--fg-muted)]">Risk distribution</h2>
        <span className="font-mono text-[11px] tabular-nums text-[var(--fg-faint)]">
          {total} open
        </span>
      </div>
      <ul className="mt-4 space-y-2.5">
        {RISK_ROWS.map(({ key, rating }, i) => {
          const c = ratingStyle(rating);
          const n = counts[key];
          const pct = total === 0 ? 0 : (n / total) * 100;
          return (
            <li key={key} className="flex items-center gap-3">
              <span
                className={`inline-flex w-[4.5rem] shrink-0 items-center justify-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text} ${c.border}`}
              >
                {c.label}
              </span>
              <div className="panel-inset h-1.5 flex-1 overflow-hidden rounded-full">
                <GrowBar pct={pct} className={`rounded-full ${c.bar}`} delay={i * 0.04} />
              </div>
              <span className="w-6 text-right font-mono text-sm font-semibold tabular-nums text-[var(--fg)]">
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
      <div className="h-8 w-64 rounded bg-white/5" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-white/[0.03]" />
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { summary, doc, ready } = useAssessment();
  const reduce = useReducedMotion();

  if (!ready) return <DashboardSkeleton />;

  const openRisks =
    summary.riskCounts.critical +
    summary.riskCounts.high +
    summary.riskCounts.medium +
    summary.riskCounts.low;
  const highCrit = summary.riskCounts.critical + summary.riskCounts.high;

  const lastSaved = isUnsavedStamp(doc.updatedAt)
    ? "Not saved yet"
    : `Updated ${formatDate(doc.updatedAt)}`;

  return (
    <Stagger className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Hero */}
      <Rise className="relative">
        <p className="eyebrow text-[var(--accent)]">Compliance command console</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-[2rem]">
          HIPAA Security Risk Assessment
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--fg-muted)]">
          Work through the HIPAA Security Rule safeguards, score each gap on a
          likelihood &times; impact matrix, and produce an audit-ready risk
          register and report.
        </p>
      </Rise>

      <Rise as="section" className="panel mt-6 rounded-xl p-5">
        <OrgHeader />
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)]">
          {lastSaved}
        </p>
      </Rise>

      <Stagger as="section" className="mt-6 grid gap-3 sm:grid-cols-3">
        <Rise>
          <Metric
            value={summary.compliancePct}
            suffix="%"
            label="Overall compliance"
            hint={`${summary.statusCounts.implemented} of ${summary.applicable} applicable controls implemented`}
            tone={summary.compliancePct >= 80 ? "good" : undefined}
          />
        </Rise>
        <Rise>
          <Metric
            value={summary.assessedPct}
            suffix="%"
            label="Assessed"
            hint={`${summary.assessed} of ${summary.total} controls reviewed`}
          />
        </Rise>
        <Rise>
          <Metric
            value={openRisks}
            label="Open risks"
            hint={highCrit > 0 ? `${highCrit} high or critical` : "in the risk register"}
            tone={openRisks > 0 ? "warn" : "good"}
            glow={
              summary.riskCounts.critical > 0
                ? "critical"
                : summary.riskCounts.high > 0
                  ? "high"
                  : null
            }
          />
        </Rise>
      </Stagger>

      <Rise as="section" className="mt-6 grid gap-3 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="eyebrow">Safeguard categories</h2>
          </div>
          <CategoryGrid categories={summary.categories} />
        </div>
        <RiskDistribution counts={summary.riskCounts} />
      </Rise>

      <Rise as="section" className="mt-8">
        <div className="panel relative flex flex-col gap-4 overflow-hidden rounded-xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 120% at 0% 0%, var(--accent-glow), transparent 55%)",
            }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-base font-semibold text-[var(--fg)]">
              {summary.assessed === 0
                ? "Start your assessment"
                : "Continue your assessment"}
            </h2>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">
              {summary.total - summary.assessed === 0
                ? "Every control has a status — review your risk register and report."
                : `${summary.total - summary.assessed} control${
                    summary.total - summary.assessed === 1 ? "" : "s"
                  } still need a status.`}
            </p>
          </div>
          <m.div
            className="relative"
            whileHover={reduce ? undefined : { y: -1 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={POP}
          >
            <Link
              href="/assess"
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#04130d] shadow-[0_4px_20px_-6px_var(--accent-glow)] transition-colors hover:bg-[var(--accent-bright)]"
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
          </m.div>
        </div>
      </Rise>

      <Rise as="section" className="mt-8 border-t border-[var(--border)] pt-6">
        <h2 className="eyebrow">Manage assessment</h2>
        <p className="mb-3 mt-2 text-xs text-[var(--fg-muted)]">
          Everything is stored locally in your browser. Export to back it up or
          move it between machines.
        </p>
        <ActionsBar />
      </Rise>
    </Stagger>
  );
}
