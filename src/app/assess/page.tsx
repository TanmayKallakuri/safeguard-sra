"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { m, useReducedMotion } from "motion/react";
import { CATEGORIES, CONTROLS } from "@/lib/catalog";
import type { SafeguardCategory } from "@/lib/catalog";
import { useAssessment } from "@/components/assessment-provider";
import { ControlCard } from "@/components/assess/control-card";
import { ComplianceBar } from "@/components/ui/bars";
import { Rise, Stagger, SLIDE } from "@/components/ui/motion";

const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

function isCategory(value: string | null): value is SafeguardCategory {
  return value !== null && (CATEGORY_IDS as string[]).includes(value);
}

function shortTab(name: string): string {
  return name
    .replace(/ Safeguards$/, "")
    .replace(/ Requirements$/, "")
    .replace(/, .*/, "")
    .toUpperCase();
}

function AssessSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-3 py-6 sm:px-5">
      <div className="h-5 w-40 rounded-md bg-white/40" />
      <div className="mt-4 h-9 rounded-lg bg-white/40" />
      <div className="mt-4 space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-white/40" />
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
    <div className="mx-auto max-w-4xl px-3 py-5 sm:px-5 sm:py-6">
      <h2 className="section-head mb-3">
        <span className="text-[var(--accent)]">▸</span> Control review
      </h2>
      <p className="prose max-w-2xl text-[13px] leading-relaxed text-[var(--fg-muted)]">
        Set a status for each control. Anything partial or not implemented gets a
        likelihood &times; impact rating and flows into the risk register.
      </p>

      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Safeguard categories"
        className="mt-4 flex gap-0 overflow-x-auto border-b border-[var(--rule)]"
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
              className={`relative whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {shortTab(cat.name)}
              <span className="ml-1.5 text-[10px] tabular-nums text-[var(--fg-faint)]">
                {done}/{catSummary.total}
              </span>
              {isActive ? (
                <m.span
                  layoutId="assess-tab"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--accent)]"
                  transition={reduce ? { duration: 0 } : SLIDE}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Category header + progress. Constant `initial` (hydration-safe). */}
      <m.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.18 }}
        className="panel mt-4 px-3 py-3 sm:px-4"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.06em] text-[var(--fg)]">
              {activeMeta.name}
            </h2>
            <p className="text-[11px] tabular-nums text-[var(--fg-faint)]">
              {activeMeta.citation}
            </p>
          </div>
          <span className="label">
            {assessedInCat}/{activeSummary.total} reviewed
          </span>
        </div>
        <p className="prose mt-2 text-[13px] leading-relaxed text-[var(--fg-muted)]">
          {activeMeta.description}
        </p>
        <div className="mt-3">
          <ComplianceBar pct={activeSummary.compliancePct} label="Compliance" />
        </div>
      </m.div>

      {/* Controls — re-stagger on category change. */}
      <Stagger key={`controls-${active}`} className="mt-3 space-y-3">
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
