"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { useAssessment } from "@/components/assessment-provider";
import { RatingBadge, RequirementBadge, StatusBadge } from "@/components/ui/badges";
import { Rise, Stagger, SPRING } from "@/components/ui/motion";
import { levelLabel } from "@/components/ui/tokens";
import type { RiskRegisterEntry } from "@/lib/scoring";

function RegisterSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-7 w-48 rounded bg-white/5" />
      <div className="mt-6 h-96 rounded-xl bg-white/[0.03]" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="panel-inset rounded-xl border-dashed p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgb(52_211_153_/_0.3)] bg-[rgb(52_211_153_/_0.1)]">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-[var(--low)]"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m5 13 4 4L19 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[var(--fg)]">No open risks</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-[var(--fg-muted)]">
        Nothing in this assessment is marked partial or not implemented, so the
        register is empty. Work through the controls to surface gaps here.
      </p>
      <Link
        href="/assess"
        className="mt-4 inline-flex items-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#04130d] transition-colors hover:bg-[var(--accent-bright)]"
      >
        Go to assessment
      </Link>
    </div>
  );
}

function MobileRow({ entry }: { entry: RiskRegisterEntry }) {
  return (
    <article className="panel rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight text-[var(--fg)]">
            {entry.control.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-[var(--fg-faint)]">
            {entry.control.citation}
          </p>
        </div>
        <RatingBadge rating={entry.rating} className="shrink-0" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <StatusBadge status={entry.status} />
        <RequirementBadge requirement={entry.control.requirement} />
        <span className="font-mono text-[11px] text-[var(--fg-muted)]">
          L: {levelLabel(entry.likelihood)} &middot; I: {levelLabel(entry.impact)}
        </span>
      </div>
      {entry.notes ? (
        <p className="mt-2 text-xs italic text-[var(--fg-muted)]">
          &ldquo;{entry.notes}&rdquo;
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-[var(--fg)]/90">
        <span className="font-medium text-[var(--fg)]">Remediation: </span>
        {entry.control.remediation}
      </p>
    </article>
  );
}

function CountChip({
  n,
  label,
  color,
}: {
  n: number;
  label: string;
  color: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`font-mono font-semibold tabular-nums ${color}`}>{n}</span>
      <span className="font-mono uppercase tracking-wider">{label}</span>
    </span>
  );
}

export default function RegisterPage() {
  const reduce = useReducedMotion();
  const { register, summary, doc, ready } = useAssessment();

  if (!ready) return <RegisterSkeleton />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-1">
        <p className="eyebrow text-[var(--accent)]">Open gaps, worst-first</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
          Risk register
        </h1>
        <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
          Every open gap for{" "}
          <span className="font-medium text-[var(--fg)]">
            {doc.orgName || "this organization"}
          </span>
          , ranked worst-first by derived risk rating.
        </p>
      </div>

      {register.length === 0 ? (
        <div className="mt-6">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--fg-faint)]">
            <CountChip n={register.length} label={`open risk${register.length === 1 ? "" : "s"}`} color="text-[var(--fg)]" />
            <CountChip n={summary.riskCounts.critical} label="critical" color="text-[#fca5a5]" />
            <CountChip n={summary.riskCounts.high} label="high" color="text-[#fdba74]" />
            <CountChip n={summary.riskCounts.medium} label="medium" color="text-[#fcd34d]" />
            <CountChip n={summary.riskCounts.low} label="low" color="text-[#6ee7b7]" />
          </div>

          {/* Desktop table */}
          <div className="panel mt-4 hidden overflow-hidden rounded-xl md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-inset)] text-left">
                  {["Control", "Status", "Likelihood", "Impact", "Risk", "Remediation"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-faint)]"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {register.map((entry, i) => (
                  <m.tr
                    key={entry.control.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { ...SPRING, delay: Math.min(i, 20) * 0.025 }
                    }
                    className="border-t border-[var(--border)] align-top transition-colors hover:bg-[var(--bg-elevated)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--fg)]">
                          {entry.control.name}
                        </span>
                        <RequirementBadge requirement={entry.control.requirement} />
                      </div>
                      <span className="mt-0.5 block font-mono text-[11px] text-[var(--fg-faint)]">
                        {entry.control.citation}
                      </span>
                      {entry.notes ? (
                        <span className="mt-1 block text-xs italic text-[var(--fg-muted)]">
                          &ldquo;{entry.notes}&rdquo;
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--fg-muted)]">
                      {levelLabel(entry.likelihood)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--fg-muted)]">
                      {levelLabel(entry.impact)}
                    </td>
                    <td className="px-4 py-3">
                      <RatingBadge rating={entry.rating} />
                    </td>
                    <td className="max-w-md px-4 py-3 text-xs leading-relaxed text-[var(--fg-muted)]">
                      {entry.control.remediation}
                    </td>
                  </m.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <Stagger className="mt-4 space-y-3 md:hidden">
            {register.slice(0, 20).map((entry) => (
              <Rise as="div" key={entry.control.id}>
                <MobileRow entry={entry} />
              </Rise>
            ))}
            {register.length > 20
              ? register.slice(20).map((entry) => (
                  <MobileRow key={entry.control.id} entry={entry} />
                ))
              : null}
          </Stagger>
        </>
      )}
    </div>
  );
}
