"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, CONTROLS } from "@/lib/catalog";
import type { SafeguardCategory } from "@/lib/catalog";
import { useAssessment } from "@/components/assessment-provider";
import { ControlCard } from "@/components/assess/control-card";
import { ComplianceBar } from "@/components/ui/bars";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

function isCategory(value: string | null): value is SafeguardCategory {
  return value !== null && (CATEGORY_IDS as string[]).includes(value);
}

function AssessSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-7 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      <div className="mt-4 h-10 rounded bg-slate-100 dark:bg-slate-900" />
      <div className="mt-6 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 rounded-xl bg-slate-100 dark:bg-slate-900" />
        ))}
      </div>
    </div>
  );
}

function AssessInner() {
  const params = useSearchParams();
  const { doc, summary, setResponse, ready } = useAssessment();

  const initialCat = params.get("cat");
  const [active, setActive] = useState<SafeguardCategory>(
    isCategory(initialCat) ? initialCat : "administrative",
  );

  const controls = useMemo(
    () => CONTROLS.filter((c) => c.category === active),
    [active],
  );

  const activeMeta = CATEGORIES.find((c) => c.id === active)!;
  const activeSummary = summary.categories.find((c) => c.category === active)!;

  if (!ready) return <AssessSkeleton />;

  const assessedInCat =
    activeSummary.total - activeSummary.statusCounts.unassessed;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Assessment</h1>
        <p className="text-sm text-[var(--muted)]">
          Set a status for each control. Anything partial or not implemented gets a
          likelihood × impact rating and flows into the risk register.
        </p>
      </div>

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Safeguard categories"
        className="mt-6 flex gap-1 overflow-x-auto border-b border-[var(--border)] pb-px"
      >
        {CATEGORIES.map((cat) => {
          const catSummary = summary.categories.find(
            (c) => c.category === cat.id,
          )!;
          const isActive = cat.id === active;
          const done = catSummary.total - catSummary.statusCounts.unassessed;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat.id)}
              className={`relative whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-300"
                  : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {cat.name.replace(" Safeguards", "").replace(" Requirements", "")}
              <span className="ml-1.5 text-[11px] tabular-nums text-[var(--muted)]">
                {done}/{catSummary.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category header + progress */}
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">{activeMeta.name}</h2>
            <p className="font-mono text-xs text-[var(--muted)]">
              {activeMeta.citation}
            </p>
          </div>
          <span className="text-xs text-[var(--muted)]">
            {assessedInCat} of {activeSummary.total} reviewed
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          {activeMeta.description}
        </p>
        <div className="mt-3">
          <ComplianceBar pct={activeSummary.compliancePct} label="Compliance" />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 space-y-4">
        {controls.map((control) => (
          <ControlCard
            key={control.id}
            control={control}
            response={doc.responses[control.id]}
            onChange={(next) => setResponse(control.id, next)}
          />
        ))}
      </div>
    </div>
  );
}

export default function AssessPage() {
  return (
    <Suspense fallback={<AssessSkeleton />}>
      <AssessInner />
    </Suspense>
  );
}
