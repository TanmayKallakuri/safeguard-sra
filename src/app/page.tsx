"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { useAssessment } from "@/components/assessment-provider";
import { OrgHeader } from "@/components/dashboard/org-header";
import { ActionsBar } from "@/components/dashboard/actions-bar";
import { CategoryRows } from "@/components/dashboard/category-grid";
import { RiskMatrix } from "@/components/dashboard/risk-matrix";
import type { RatingCounts } from "@/lib/scoring";
import { formatDate, isUnsavedStamp } from "@/components/ui/format";
import { CountUp, Rise, Stagger } from "@/components/ui/motion";
import { TickBar } from "@/components/ui/bars";
import { ratingStyle } from "@/components/ui/tokens";

/* A single big-numeral telemetry readout with a ticked bar. */
function MetricLine({
  value,
  suffix = "",
  label,
  pct,
  tone = "default",
}: {
  value: number;
  suffix?: string;
  label: string;
  pct?: number;
  tone?: "default" | "warn" | "good";
}) {
  const valueColor =
    tone === "warn"
      ? "text-[var(--high)]"
      : tone === "good"
        ? "text-[var(--low)]"
        : "text-[var(--fg)]";
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="label w-[4.5rem] shrink-0">{label}</span>
      <span
        className={`w-14 shrink-0 text-right text-2xl font-bold leading-none tabular-nums ${valueColor}`}
      >
        <CountUp value={value} suffix={suffix} />
      </span>
      {pct !== undefined ? (
        <span className="flex-1">
          <TickBar pct={pct} ariaLabel={label} />
        </span>
      ) : (
        <span className="flex-1" />
      )}
    </div>
  );
}

const RISK_ROWS: { key: keyof RatingCounts; rating: "critical" | "high" | "medium" | "low" }[] = [
  { key: "critical", rating: "critical" },
  { key: "high", rating: "high" },
  { key: "medium", rating: "medium" },
  { key: "low", rating: "low" },
];

/* Open-risk severity tape. */
function SeverityTape({ counts }: { counts: RatingCounts }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="label w-[4.5rem] shrink-0">Open risk</span>
      <span className="w-14 shrink-0 text-right text-2xl font-bold leading-none tabular-nums text-[var(--fg)]">
        <CountUp value={counts.critical + counts.high + counts.medium + counts.low} />
      </span>
      <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1">
        {RISK_ROWS.map(({ key, rating }) => {
          const c = ratingStyle(rating);
          return (
            <span key={key} className="inline-flex items-center gap-1">
              <span
                className="h-3.5 w-1 rounded-full"
                style={{ backgroundColor: c.fill }}
                aria-hidden="true"
              />
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: c.fill }}
              >
                {counts[key]}
              </span>
              <span className="label">{c.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-3 py-6 sm:px-5">
      <div className="h-12 rounded-2xl bg-white/40" />
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="h-60 rounded-2xl bg-white/40" />
        <div className="h-60 rounded-2xl bg-white/40" />
      </div>
      <div className="mt-4 h-64 rounded-2xl bg-white/40" />
    </div>
  );
}

export default function DashboardPage() {
  const { summary, register, doc, ready } = useAssessment();
  const reduce = useReducedMotion();

  if (!ready) return <DashboardSkeleton />;

  const openRisks =
    summary.riskCounts.critical +
    summary.riskCounts.high +
    summary.riskCounts.medium +
    summary.riskCounts.low;

  const lastSaved = isUnsavedStamp(doc.updatedAt)
    ? "unsaved"
    : formatDate(doc.updatedAt);

  const remaining = summary.total - summary.assessed;

  return (
    <Stagger className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-6">
      {/* Org / assessor metadata strip */}
      <Rise as="section" className="panel px-4 py-3">
        <OrgHeader />
      </Rise>

      {/* Top row: risk matrix | telemetry — two glass panels, fog in gutter. */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <Rise as="section" className="panel p-4 sm:p-5">
          <h2 className="section-head mb-4">Risk matrix</h2>
          <RiskMatrix register={register} />
        </Rise>

        <Rise as="section" className="panel flex flex-col p-4 sm:p-5">
          <h2 className="section-head mb-1">Telemetry</h2>
          <div className="divide-y divide-[var(--rule)]">
            <MetricLine
              value={summary.compliancePct}
              suffix="%"
              label="Compliance"
              pct={summary.compliancePct}
              tone={summary.compliancePct >= 80 ? "good" : undefined}
            />
            <MetricLine
              value={summary.assessedPct}
              suffix="%"
              label="Assessed"
              pct={summary.assessedPct}
            />
            <SeverityTape counts={summary.riskCounts} />
          </div>

          <m.div
            className="mt-auto pt-4"
            whileHover={reduce ? undefined : { y: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <Link
              href="/assess"
              className="flex items-center justify-between gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-white shadow-[0_8px_24px_-10px_var(--accent)] transition hover:brightness-95"
            >
              <span className="flex flex-col">
                <span className="text-[13px] font-semibold">
                  {summary.assessed === 0 ? "Begin assessment" : "Continue assessment"}
                </span>
                <span className="text-[11px] text-white/90">
                  {remaining > 0
                    ? `${remaining} control${remaining === 1 ? "" : "s"} still need a status`
                    : "All controls reviewed"}
                </span>
              </span>
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" aria-hidden="true">
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
        </Rise>
      </div>

      {/* Safeguard categories */}
      <Rise as="section" className="panel mt-4 p-4 sm:p-5">
        <h2 className="section-head mb-3">Safeguard categories</h2>
        <CategoryRows categories={summary.categories} />
      </Rise>

      {/* Manage assessment */}
      <Rise as="section" className="panel mt-4 p-4 sm:p-5">
        <h2 className="section-head mb-2">Manage assessment</h2>
        <p className="prose mb-3 text-xs text-[var(--fg-muted)]">
          Stored locally in your browser. Export to back up or move between
          machines
          {lastSaved !== "unsaved" ? ` · last write ${lastSaved}` : ""}.
        </p>
        <ActionsBar />
      </Rise>
      <span className="sr-only">{openRisks} open risks in the register</span>
    </Stagger>
  );
}
