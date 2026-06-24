"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import type { CategorySummary } from "@/lib/scoring";
import { TickBar, StatusBreakdownBar } from "@/components/ui/bars";
import { RatingBadge } from "@/components/ui/badges";

function categoryMeta(id: CategorySummary["category"]) {
  return CATEGORIES.find((c) => c.id === id)!;
}

/** Short tag for a category, e.g. "Administrative Safeguards" → "ADMIN". */
function shortName(name: string): string {
  return name
    .replace(/ Safeguards$/, "")
    .replace(/ Requirements$/, "")
    .replace(/, .*/, "")
    .toUpperCase();
}

function CategoryRow({ summary }: { summary: CategorySummary }) {
  const meta = categoryMeta(summary.category);
  const openRisks =
    summary.riskCounts.critical +
    summary.riskCounts.high +
    summary.riskCounts.medium +
    summary.riskCounts.low;

  return (
    <Link
      href={`/assess?cat=${summary.category}`}
      className="group grid grid-cols-[7rem_1fr] items-center gap-x-3 gap-y-1.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/55 sm:grid-cols-[7rem_5rem_minmax(8rem,1fr)_4rem_minmax(6rem,9rem)]"
    >
      {/* Citation */}
      <span className="text-[11px] tabular-nums text-[var(--fg-muted)] group-hover:text-[var(--accent)]">
        {meta.citation.replace("45 CFR ", "")}
      </span>

      {/* Short name */}
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--fg)]">
        {shortName(meta.name)}
      </span>

      {/* Compliance % + tick bar */}
      <span className="col-span-2 flex items-center gap-2 sm:col-span-1">
        <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-[var(--fg)]">
          {summary.compliancePct}%
        </span>
        <span className="flex-1">
          <TickBar pct={summary.compliancePct} ariaLabel={`${meta.name} compliance`} />
        </span>
      </span>

      {/* Top risk */}
      <span className="hidden sm:block">
        <RatingBadge rating={summary.topRisk} />
      </span>

      {/* Open count + density */}
      <span className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:justify-end">
        <span className="hidden flex-1 sm:block">
          <StatusBreakdownBar counts={summary.statusCounts} />
        </span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--fg-faint)]">
          <span className="sm:hidden">
            <RatingBadge rating={summary.topRisk} />{" "}
          </span>
          {openRisks === 0 ? "0 open" : `${openRisks} open`}
        </span>
      </span>
    </Link>
  );
}

/** Hairline-divided category list (the dashboard's scannable register). */
export function CategoryRows({ categories }: { categories: CategorySummary[] }) {
  return (
    <div className="divide-y divide-[var(--rule)]">
      {categories.map((c) => (
        <CategoryRow key={c.category} summary={c} />
      ))}
    </div>
  );
}
