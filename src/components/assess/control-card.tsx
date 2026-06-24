"use client";

import { useEffect, useRef, useState } from "react";
import type { Control } from "@/lib/catalog";
import {
  controlRating,
  isGap,
  statusOf,
} from "@/lib/scoring";
import type {
  ControlResponse,
  ImplementationStatus,
  RiskLevel,
} from "@/lib/scoring";
import { Segmented } from "@/components/ui/segmented";
import type { SegmentedOption } from "@/components/ui/segmented";
import { RatingBadge, RequirementBadge } from "@/components/ui/badges";

const STATUS_OPTIONS: SegmentedOption<ImplementationStatus>[] = [
  {
    value: "implemented",
    label: "Implemented",
    activeClass: "bg-emerald-600 text-white dark:bg-emerald-500",
  },
  {
    value: "partial",
    label: "Partial",
    activeClass: "bg-amber-500 text-white",
  },
  {
    value: "not-implemented",
    label: "Not implemented",
    activeClass: "bg-red-600 text-white dark:bg-red-500",
  },
  {
    value: "not-applicable",
    label: "N/A",
    activeClass: "bg-slate-600 text-white dark:bg-slate-500",
  },
];

const LEVEL_OPTIONS: SegmentedOption<RiskLevel>[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function ControlCard({
  control,
  response,
  onChange,
}: {
  control: Control;
  response: ControlResponse | undefined;
  onChange: (next: ControlResponse) => void;
}) {
  const status = statusOf(response);
  const gap = isGap(status);

  // Local notes state so typing is smooth; persists on blur / debounced.
  const [notes, setNotes] = useState(response?.notes ?? "");
  const notesRef = useRef(response?.notes ?? "");

  useEffect(() => {
    // Keep local notes in sync if the doc is replaced externally (import/sample).
    if ((response?.notes ?? "") !== notesRef.current) {
      setNotes(response?.notes ?? "");
      notesRef.current = response?.notes ?? "";
    }
  }, [response?.notes]);

  function patch(next: Partial<ControlResponse>) {
    const base: ControlResponse = response ?? { status: "unassessed" };
    onChange({ ...base, ...next });
  }

  function handleStatus(nextStatus: ImplementationStatus) {
    if (isGap(nextStatus)) {
      patch({
        status: nextStatus,
        // Default likelihood/impact to medium so a rating shows immediately.
        likelihood: response?.likelihood ?? "medium",
        impact: response?.impact ?? "medium",
      });
    } else {
      patch({ status: nextStatus });
    }
  }

  function commitNotes() {
    const trimmed = notes.trim();
    if (trimmed !== (response?.notes ?? "")) {
      notesRef.current = trimmed;
      // Derive status fresh from the current prop, not the render-captured
      // value, so an external doc replacement before blur can't write a stale
      // status back.
      patch({ status: statusOf(response), notes: trimmed });
    }
  }

  const rating = controlRating(response);

  return (
    <article
      id={control.id}
      className="scroll-mt-24 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5"
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold leading-tight">{control.name}</h3>
            <RequirementBadge requirement={control.requirement} />
          </div>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            {control.standardName}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[var(--muted)]">
            {control.citation}
          </p>
        </div>
        {gap ? <RatingBadge rating={rating} className="shrink-0" /> : null}
      </header>

      <p className="mt-3 text-sm leading-relaxed text-[var(--foreground)]">
        {control.description}
      </p>

      <div className="mt-4">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          Implementation status
        </span>
        <Segmented
          ariaLabel={`Implementation status for ${control.name}`}
          options={STATUS_OPTIONS}
          value={status === "unassessed" ? undefined : status}
          onChange={handleStatus}
          size="sm"
        />
      </div>

      {gap ? (
        <div className="mt-4 grid gap-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-900/60 dark:bg-amber-950/20 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Likelihood
            </span>
            <Segmented
              ariaLabel={`Likelihood for ${control.name}`}
              options={LEVEL_OPTIONS}
              value={response?.likelihood ?? "medium"}
              onChange={(likelihood) => patch({ status, likelihood })}
              size="sm"
            />
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Impact
            </span>
            <Segmented
              ariaLabel={`Impact for ${control.name}`}
              options={LEVEL_OPTIONS}
              value={response?.impact ?? "medium"}
              onChange={(impact) => patch({ status, impact })}
              size="sm"
            />
          </div>
          <div className="flex flex-col justify-end">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Risk
            </span>
            <RatingBadge rating={rating} className="self-start px-3 py-1 text-sm" />
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <label
          htmlFor={`notes-${control.id}`}
          className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[var(--muted)]"
        >
          Notes
        </label>
        <textarea
          id={`notes-${control.id}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={commitNotes}
          rows={2}
          placeholder="Evidence, context, or rationale (especially for Addressable specs marked N/A)…"
          className="w-full resize-y rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <details className="group mt-3 text-sm">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-medium text-blue-700 hover:underline dark:text-blue-400">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform group-open:rotate-90"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m9 6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Remediation guidance
        </summary>
        <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm leading-relaxed text-[var(--muted)] dark:bg-slate-900">
          {control.remediation}
        </p>
      </details>
    </article>
  );
}
