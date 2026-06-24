"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { m, useReducedMotion } from "motion/react";
import { CATEGORIES, CONTROLS } from "@/lib/catalog";
import type { SafeguardCategory } from "@/lib/catalog";
import { useAssessment } from "@/components/assessment-provider";
import { ControlCard } from "@/components/assess/control-card";
import { ComplianceBar } from "@/components/ui/bars";
import { Rise, Stagger, SPRING } from "@/components/ui/motion";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

function isCategory(value: string | null): value is SafeguardCategory {
  return value !== null && (CATEGORY_IDS as string[]).includes(value);
}

function AssessSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-10 sm:px-6">
      <div className="h-7 w-48 rounded bg-white/5" />
      <div className="mt-4 h-10 rounded bg-white/[0.03]" />
      <div className="mt-6 space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 rounded-xl bg-white/[0.03]" />
        ))}
      </div>
    </div>
  );
}

function AssessInner() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
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
        <p className="eyebrow text-[var(--accent)]">Control review</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--fg)]">
          Assessment
        </h1>
        <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
          Set a status for each control. Anything partial or not implemented gets
          a likelihood &times; impact rating and flows into the risk register.
        </p>
      </div>

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Safeguard categories"
        className="mt-6 flex gap-1 overflow-x-auto border-b border-[var(--border)]"
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
              className={`relative whitespace-nowrap px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-[var(--fg)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {cat.name.replace(" Safeguards", "").replace(" Requirements", "")}
              <span className="ml-1.5 font-mono text-[11px] tabular-nums text-[var(--fg-faint)]">
                {done}/{catSummary.total}
              </span>
              {isActive ? (
                <m.span
                  layoutId="assess-tab"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[var(--accent)]"
                  transition={reduce ? { duration: 0 } : SPRING}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Category header + progress. Constant `initial` (hydration-safe);
          reduced motion only flattens the transition. */}
      <m.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.2 }}
        className="panel mt-6 rounded-xl p-4 sm:p-5"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--fg)]">
              {activeMeta.name}
            </h2>
            <p className="font-mono text-xs text-[var(--fg-faint)]">
              {activeMeta.citation}
            </p>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--fg-faint)]">
            {assessedInCat} of {activeSummary.total} reviewed
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
          {activeMeta.description}
        </p>
        <div className="mt-4">
          <ComplianceBar pct={activeSummary.compliancePct} label="Compliance" />
        </div>
      </m.div>

      {/* Controls — re-stagger on category change. */}
      <Stagger key={`controls-${active}`} className="mt-4 space-y-4">
        {controls.map((control) => (
          <Rise as="div" key={control.id}>
            <ControlCard
              control={control}
              response={doc.responses[control.id]}
              onChange={(next) => setResponse(control.id, next)}
            />
          </Rise>
        ))}
      </Stagger>
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
