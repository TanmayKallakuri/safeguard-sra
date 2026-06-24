"use client";

import Link from "next/link";
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
      ? "text-[#f87b77]"
      : tone === "good"
        ? "text-[#6dd1a3]"
        : "text-[var(--fg)]";
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
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

/* Open-risk severity tape: ▌3 ▌4 ▌3 ▌1 */
function SeverityTape({ counts }: { counts: RatingCounts }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
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
                className="h-3.5 w-1"
                style={{ backgroundColor: c.fill }}
                aria-hidden="true"
              />
              <span className="text-xs font-semibold tabular-nums" style={{ color: c.fill }}>
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
      <div className="h-5 w-48 bg-white/5" />
      <div className="mt-4 grid gap-px border border-[var(--rule)] bg-[var(--rule)] lg:grid-cols-2">
        <div className="h-56 bg-[var(--bg-panel)]" />
        <div className="h-56 bg-[var(--bg-panel)]" />
      </div>
      <div className="mt-4 h-72 border border-[var(--rule)] bg-[var(--bg-panel)]" />
    </div>
  );
}

export default function DashboardPage() {
  const { summary, register, doc, ready } = useAssessment();

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
      <Rise as="section" className="panel px-3 py-2.5">
        <OrgHeader />
      </Rise>

      {/* Top row: RISK MATRIX | telemetry stack — ruled, not carded. */}
      <Rise as="section" className="mt-4">
        <div className="grid gap-px border border-[var(--rule)] bg-[var(--rule)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* Risk matrix */}
          <div className="bg-[var(--bg-panel)] p-3 sm:p-4">
            <h2 className="section-head mb-3">
              <span className="text-[var(--accent)]">▸</span> Risk matrix
            </h2>
            <RiskMatrix register={register} />
          </div>

          {/* Telemetry */}
          <div className="bg-[var(--bg-panel)] p-3 sm:p-4">
            <h2 className="section-head mb-2">
              <span className="text-[var(--accent)]">▸</span> Telemetry
            </h2>
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

            {/* CTA — terminal command line. */}
            <Link
              href="/assess"
              className="mt-3 flex items-center justify-between border border-[var(--rule)] bg-[var(--bg-inset)] px-3 py-2.5 transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-elevated)]"
            >
              <span className="flex items-center gap-2 text-[13px]">
                <span className="text-[var(--accent)]">$</span>
                <span className="text-[var(--fg)]">
                  {summary.assessed === 0 ? "begin assessment" : "continue assessment"}
                </span>
                <span className="text-[var(--fg-faint)]">
                  {remaining > 0
                    ? `# ${remaining} control${remaining === 1 ? "" : "s"} pending`
                    : "# all controls reviewed"}
                </span>
              </span>
              <span className="text-[var(--accent)]">→</span>
            </Link>
          </div>
        </div>
      </Rise>

      {/* Safeguard categories — ruled rows. */}
      <Rise as="section" className="mt-4">
        <h2 className="section-head mb-2">Safeguard categories</h2>
        <CategoryRows categories={summary.categories} />
      </Rise>

      {/* Manage assessment */}
      <Rise as="section" className="mt-4">
        <h2 className="section-head mb-2">Manage assessment</h2>
        <div className="panel px-3 py-3">
          <p className="label mb-2.5 normal-case tracking-normal text-[var(--fg-muted)]">
            Stored locally in your browser. Export to back up or move between machines
            {lastSaved !== "unsaved" ? ` · last write ${lastSaved}` : ""}.
          </p>
          <ActionsBar />
        </div>
      </Rise>
      <span className="sr-only">{openRisks} open risks in the register</span>
    </Stagger>
  );
}
