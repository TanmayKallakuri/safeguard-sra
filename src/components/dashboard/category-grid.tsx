"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import type { CategorySummary } from "@/lib/scoring";
import { ComplianceBar, StatusBreakdownBar } from "@/components/ui/bars";
import { RatingBadge } from "@/components/ui/badges";

function categoryMeta(id: CategorySummary["category"]) {
  return CATEGORIES.find((c) => c.id === id)!;
}

function CategoryCard({ summary }: { summary: CategorySummary }) {
  const meta = categoryMeta(summary.category);
  const openRisks =
    summary.riskCounts.critical +
    summary.riskCounts.high +
    summary.riskCounts.medium +
    summary.riskCounts.low;

  return (
    <Link
      href={`/assess?cat=${summary.category}`}
      className="group flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-shadow hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold leading-snug text-[var(--foreground)]">
            {meta.name}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] text-[var(--muted)]">
            {meta.citation}
          </p>
        </div>
        <RatingBadge rating={summary.topRisk} />
      </div>

      <ComplianceBar pct={summary.compliancePct} label="Compliance" />

      <div className="space-y-1.5">
        <StatusBreakdownBar counts={summary.statusCounts} />
        <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
          <span>{summary.total} controls</span>
          <span>
            {openRisks === 0
              ? "No open risks"
              : `${openRisks} open risk${openRisks === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>
    </Link>
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
