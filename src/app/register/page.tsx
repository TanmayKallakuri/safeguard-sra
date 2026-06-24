"use client";

import Link from "next/link";
import { useAssessment } from "@/components/assessment-provider";
import { RatingBadge, RequirementBadge, StatusBadge } from "@/components/ui/badges";
import type { RiskRegisterEntry } from "@/lib/scoring";

function levelLabel(level: string) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function RegisterSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-7 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-6 h-96 rounded-xl bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
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
      <h2 className="mt-4 text-lg font-semibold">No open risks</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-[var(--muted)]">
        Nothing in this assessment is marked partial or not implemented, so the
        register is empty. Work through the controls to surface gaps here.
      </p>
      <Link
        href="/assess"
        className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Go to assessment
      </Link>
    </div>
  );
}

function MobileRow({ entry }: { entry: RiskRegisterEntry }) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-tight">
            {entry.control.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">
            {entry.control.citation}
          </p>
        </div>
        <RatingBadge rating={entry.rating} className="shrink-0" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <StatusBadge status={entry.status} />
        <RequirementBadge requirement={entry.control.requirement} />
        <span className="text-[var(--muted)]">
          L: {levelLabel(entry.likelihood)} · I: {levelLabel(entry.impact)}
        </span>
      </div>
      {entry.notes ? (
        <p className="mt-2 text-xs italic text-[var(--muted)]">“{entry.notes}”</p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-[var(--foreground)]">
        <span className="font-medium">Remediation: </span>
        {entry.control.remediation}
      </p>
    </article>
  );
}

export default function RegisterPage() {
  const { register, summary, doc, ready } = useAssessment();

  if (!ready) return <RegisterSkeleton />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Risk register</h1>
        <p className="text-sm text-[var(--muted)]">
          Every open gap for{" "}
          <span className="font-medium text-[var(--foreground)]">
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
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
            <span>
              <span className="font-semibold text-[var(--foreground)]">
                {register.length}
              </span>{" "}
              open risk{register.length === 1 ? "" : "s"}
            </span>
            <span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {summary.riskCounts.critical}
              </span>{" "}
              critical
            </span>
            <span>
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                {summary.riskCounts.high}
              </span>{" "}
              high
            </span>
            <span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {summary.riskCounts.medium}
              </span>{" "}
              medium
            </span>
            <span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {summary.riskCounts.low}
              </span>{" "}
              low
            </span>
          </div>

          {/* Desktop table */}
          <div className="mt-4 hidden overflow-hidden rounded-xl border border-[var(--border)] md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-[var(--muted)] dark:bg-slate-900">
                  <th className="px-4 py-3 font-semibold">Control</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Likelihood</th>
                  <th className="px-4 py-3 font-semibold">Impact</th>
                  <th className="px-4 py-3 font-semibold">Risk</th>
                  <th className="px-4 py-3 font-semibold">Remediation</th>
                </tr>
              </thead>
              <tbody>
                {register.map((entry) => (
                  <tr
                    key={entry.control.id}
                    className="border-t border-[var(--border)] align-top bg-[var(--surface)]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.control.name}</span>
                        <RequirementBadge
                          requirement={entry.control.requirement}
                        />
                      </div>
                      <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">
                        {entry.control.citation}
                      </span>
                      {entry.notes ? (
                        <span className="mt-1 block text-xs italic text-[var(--muted)]">
                          “{entry.notes}”
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {levelLabel(entry.likelihood)}
                    </td>
                    <td className="px-4 py-3 text-[var(--foreground)]">
                      {levelLabel(entry.impact)}
                    </td>
                    <td className="px-4 py-3">
                      <RatingBadge rating={entry.rating} />
                    </td>
                    <td className="max-w-md px-4 py-3 text-xs leading-relaxed text-[var(--muted)]">
                      {entry.control.remediation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-3 md:hidden">
            {register.map((entry) => (
              <MobileRow key={entry.control.id} entry={entry} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
