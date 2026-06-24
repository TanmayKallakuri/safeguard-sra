"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { Control } from "@/lib/catalog";
import { controlRating, isGap, statusOf } from "@/lib/scoring";
import type {
  ControlResponse,
  ImplementationStatus,
  RiskLevel,
} from "@/lib/scoring";
import { Segmented } from "@/components/ui/segmented";
import type { SegmentedOption } from "@/components/ui/segmented";
import { RatingBadge, RequirementBadge } from "@/components/ui/badges";
import { CRISP } from "@/components/ui/motion";
import { statusStyle } from "@/components/ui/tokens";

const STATUS_OPTIONS: SegmentedOption<ImplementationStatus>[] = [
  { value: "implemented", label: "Impl", activeClass: statusStyle("implemented").active },
  { value: "partial", label: "Partial", activeClass: statusStyle("partial").active },
  { value: "not-implemented", label: "Not impl", activeClass: statusStyle("not-implemented").active },
  { value: "not-applicable", label: "N/A", activeClass: statusStyle("not-applicable").active },
];

const LEVEL_OPTIONS: SegmentedOption<RiskLevel>[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Med" },
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
  const reduce = useReducedMotion();
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
    <m.article
      id={control.id}
      layout={reduce ? false : "position"}
      transition={reduce ? { duration: 0 } : CRISP}
      className="panel scroll-mt-28 px-3 py-3 sm:px-4"
    >
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[13px] font-semibold leading-tight text-[var(--fg)]">
              {control.name}
            </h3>
            <RequirementBadge requirement={control.requirement} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] tabular-nums text-[var(--fg-faint)]">
            <span className="text-[var(--fg-muted)]">{control.standardName}</span>
            <span className="text-[var(--rule-strong)]">·</span>
            <span>{control.citation}</span>
          </p>
        </div>
        {/* `initial={false}`: a saved gap shows its badge without a spurious
            entrance, and first-mount markup is the resolved `animate` state
            (hydration-safe). `initial` is constant; reduced motion flattens
            only the transition. */}
        <AnimatePresence initial={false}>
          {gap ? (
            <m.div
              key="header-rating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={reduce ? { duration: 0 } : CRISP}
              className="shrink-0"
            >
              <RatingBadge rating={rating} />
            </m.div>
          ) : null}
        </AnimatePresence>
      </header>

      <p className="prose mt-2.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
        {control.description}
      </p>

      <div className="mt-3">
        <span className="label mb-1.5 block">Implementation status</span>
        <Segmented
          ariaLabel={`Implementation status for ${control.name}`}
          options={STATUS_OPTIONS}
          value={status === "unassessed" ? undefined : status}
          onChange={handleStatus}
          size="sm"
        />
      </div>

      <AnimatePresence initial={false}>
        {gap ? (
          <m.div
            key="gap"
            layout={reduce ? false : "position"}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={reduce ? { duration: 0 } : CRISP}
            className="mt-3 grid gap-3 border-l-2 border-[var(--medium)] bg-[var(--bg-inset)] p-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <div>
              <span className="label mb-1.5 block">Likelihood</span>
              <Segmented
                ariaLabel={`Likelihood for ${control.name}`}
                options={LEVEL_OPTIONS}
                value={response?.likelihood ?? "medium"}
                onChange={(likelihood) => patch({ status, likelihood })}
                size="sm"
              />
            </div>
            <div>
              <span className="label mb-1.5 block">Impact</span>
              <Segmented
                ariaLabel={`Impact for ${control.name}`}
                options={LEVEL_OPTIONS}
                value={response?.impact ?? "medium"}
                onChange={(impact) => patch({ status, impact })}
                size="sm"
              />
            </div>
            <div className="flex flex-col justify-end">
              <span className="label mb-1.5 block">Risk</span>
              <m.div
                key={rating}
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                transition={reduce ? { duration: 0 } : CRISP}
                className="self-start"
              >
                <RatingBadge rating={rating} className="px-2 py-0.5 text-[11px]" />
              </m.div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-3">
        <label htmlFor={`notes-${control.id}`} className="label mb-1.5 block">
          Notes
        </label>
        <textarea
          id={`notes-${control.id}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={commitNotes}
          rows={2}
          placeholder="Evidence, context, or rationale (especially for Addressable specs marked N/A)…"
          className="prose inset w-full resize-y px-2.5 py-2 text-[13px] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg-faint)] focus:border-[var(--accent)]"
        />
      </div>

      <details className="group mt-2.5">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--accent)] transition-colors hover:brightness-125">
          <span className="text-[var(--fg-faint)] transition-transform group-open:rotate-90">
            ▸
          </span>
          Remediation
        </summary>
        <p className="prose inset mt-2 px-3 py-2.5 text-[13px] leading-relaxed text-[var(--fg-muted)]">
          {control.remediation}
        </p>
      </details>
    </m.article>
  );
}
