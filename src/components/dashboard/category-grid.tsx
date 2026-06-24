"use client";

import Link from "next/link";
import { m, useReducedMotion } from "motion/react";
import { CATEGORIES } from "@/lib/catalog";
import type { CategorySummary } from "@/lib/scoring";
import { ComplianceBar, StatusBreakdownBar } from "@/components/ui/bars";
import { RatingBadge } from "@/components/ui/badges";
import { SPRING } from "@/components/ui/motion";

function categoryMeta(id: CategorySummary["category"]) {
  return CATEGORIES.find((c) => c.id === id)!;
}

function CategoryCard({ summary }: { summary: CategorySummary }) {
  const reduce = useReducedMotion();
  const meta = categoryMeta(summary.category);
  const openRisks =
    summary.riskCounts.critical +
    summary.riskCounts.high +
    summary.riskCounts.medium +
    summary.riskCounts.low;

  return (
    <m.div
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
      transition={SPRING}
      className="h-full"
    >
      <Link
        href={`/assess?cat=${summary.category}`}
        className="panel group flex h-full flex-col gap-3 rounded-xl p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-snug text-[var(--fg)]">
              {meta.name}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] text-[var(--fg-faint)]">
              {meta.citation}
            </p>
          </div>
          <RatingBadge rating={summary.topRisk} />
        </div>

        <ComplianceBar pct={summary.compliancePct} label="Compliance" />

        <div className="mt-auto space-y-1.5">
          <StatusBreakdownBar counts={summary.statusCounts} />
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--fg-faint)]">
            <span>{summary.total} controls</span>
            <span
              className={
                openRisks > 0 ? "text-[var(--fg-muted)]" : "text-[var(--fg-faint)]"
              }
            >
              {openRisks === 0
                ? "No open risks"
                : `${openRisks} open risk${openRisks === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>
      </Link>
    </m.div>
  );
}

export function CategoryGrid({ categories }: { categories: CategorySummary[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <CategoryCard key={c.category} summary={c} />
      ))}
    </div>
  );
}
