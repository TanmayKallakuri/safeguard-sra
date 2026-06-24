"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { useAssessment } from "@/components/assessment-provider";
import { RatingBadge, RequirementBadge, StatusBadge } from "@/components/ui/badges";
import { Rise, Stagger, CRISP } from "@/components/ui/motion";
import { levelLabel } from "@/components/ui/tokens";
import type { RiskRegisterEntry } from "@/lib/scoring";

function RegisterSkeleton() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-3 py-6 sm:px-5">
      <div className="h-5 w-40 bg-white/5" />
      <div className="mt-4 h-80 bg-white/[0.03]" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="inset p-8 text-center">
      <p className="text-2xl text-[var(--low)]">[ ✓ ]</p>
      <h2 className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--fg)]">
        Register empty
      </h2>
      <p className="prose mx-auto mt-1.5 max-w-md text-[13px] text-[var(--fg-muted)]">
        Nothing is marked partial or not implemented, so there are no open gaps.
        Work through the controls to surface risks here.
      </p>
      <Link
        href="/assess"
        className="mt-4 inline-flex items-center gap-2 border border-[var(--accent)] bg-[var(--accent-dim)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)] transition-colors hover:bg-[var(--bg-elevated)]"
      >
        <span>$</span> go to assessment
      </Link>
    </div>
  );
}

function MobileRow({ entry }: { entry: RiskRegisterEntry }) {
  return (
    <article className="panel px-3 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold leading-tight text-[var(--fg)]">
            {entry.control.name}
          </h3>
          <p className="mt-0.5 text-[11px] tabular-nums text-[var(--fg-faint)]">
            {entry.control.citation}
          </p>
        </div>
        <RatingBadge rating={entry.rating} className="shrink-0" />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge status={entry.status} />
        <RequirementBadge requirement={entry.control.requirement} />
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--fg-muted)]">
          L:{levelLabel(entry.likelihood)} I:{levelLabel(entry.impact)}
        </span>
      </div>
      {entry.notes ? (
        <p className="prose mt-2 text-[12px] italic text-[var(--fg-muted)]">
          &ldquo;{entry.notes}&rdquo;
        </p>
      ) : null}
      <p className="prose mt-2 text-[12px] leading-relaxed text-[var(--fg-muted)]">
        <span className="label not-italic">Fix</span> {entry.control.remediation}
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
      <span className={`font-semibold tabular-nums ${color}`}>{n}</span>
      <span className="text-[10px] uppercase tracking-[0.1em] text-[var(--fg-faint)]">
        {label}
      </span>
    </span>
  );
}

export default function RegisterPage() {
  const reduce = useReducedMotion();
  const { register, summary, doc, ready } = useAssessment();

  if (!ready) return <RegisterSkeleton />;

  return (
    <div className="mx-auto max-w-6xl px-3 py-5 sm:px-5 sm:py-6">
      <h2 className="section-head mb-3">
        <span className="text-[var(--accent)]">▸</span> Risk register
      </h2>
      <p className="prose max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
        Every open gap for{" "}
        <span className="font-mono font-semibold text-[var(--fg)]">
          {doc.orgName || "this organization"}
        </span>
        , ranked worst-first by derived risk rating.
      </p>

      {register.length === 0 ? (
        <div className="mt-4">
          <EmptyState />
        </div>
      ) : (
        <>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-y border-[var(--rule)] bg-[var(--bg-inset)] px-3 py-1.5 text-[11px]">
            <CountChip n={register.length} label={`open`} color="text-[var(--fg)]" />
            <span className="text-[var(--rule-strong)]">│</span>
            <CountChip n={summary.riskCounts.critical} label="crit" color="text-[#f87b77]" />
            <CountChip n={summary.riskCounts.high} label="high" color="text-[#f7ab73]" />
            <CountChip n={summary.riskCounts.medium} label="med" color="text-[#edcf73]" />
            <CountChip n={summary.riskCounts.low} label="low" color="text-[#6dd1a3]" />
          </div>

          {/* Desktop table */}
          <div className="panel mt-3 hidden overflow-hidden md:block">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="border-b border-[var(--rule)] bg-[var(--bg-inset)] text-left">
                  {["Control", "Status", "L", "I", "Risk", "Remediation"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--fg-faint)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {register.map((entry, i) => (
                  <m.tr
                    key={entry.control.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { ...CRISP, delay: Math.min(i, 20) * 0.018 }
                    }
                    className="border-t border-[var(--rule)] align-top transition-colors hover:bg-[var(--bg-elevated)]"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--fg)]">
                          {entry.control.name}
                        </span>
                        <RequirementBadge requirement={entry.control.requirement} />
                      </div>
                      <span className="mt-0.5 block text-[11px] tabular-nums text-[var(--fg-faint)]">
                        {entry.control.citation}
                      </span>
                      {entry.notes ? (
                        <span className="prose mt-1 block text-[12px] italic text-[var(--fg-muted)]">
                          &ldquo;{entry.notes}&rdquo;
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={entry.status} />
                    </td>
                    <td className="px-3 py-2 uppercase text-[var(--fg-muted)]">
                      {levelLabel(entry.likelihood)}
                    </td>
                    <td className="px-3 py-2 uppercase text-[var(--fg-muted)]">
                      {levelLabel(entry.impact)}
                    </td>
                    <td className="px-3 py-2">
                      <RatingBadge rating={entry.rating} />
                    </td>
                    <td className="prose max-w-md px-3 py-2 text-[12px] leading-relaxed text-[var(--fg-muted)]">
                      {entry.control.remediation}
                    </td>
                  </m.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <Stagger className="mt-3 space-y-2 md:hidden">
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
