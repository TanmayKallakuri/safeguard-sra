"use client";

import { m, useReducedMotion } from "motion/react";
import { useId, type ReactNode } from "react";
import { SLIDE } from "@/components/ui/motion";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Optional per-option active fill (e.g. semantic status colors). */
  activeClass?: string;
}

/**
 * Accessible segmented control (radiogroup of buttons). The active fill is a
 * shared-element `layoutId` that slides crisply between options on a soft glass
 * track. Reduced motion snaps without sliding.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
}: {
  options: SegmentedOption<T>[];
  value: T | undefined;
  onChange: (next: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
}) {
  const reduce = useReducedMotion();
  // Unique per-instance group so the active fill never slides across separate
  // controls (e.g. Likelihood vs Impact) rendered together.
  const groupId = useId();
  const pad =
    size === "sm"
      ? "px-2 py-1 text-[11px]"
      : "px-2.5 py-1 text-xs";

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-0.5 rounded-lg border border-[var(--rule)] bg-[var(--glass-inset)] p-0.5"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const activeFill =
          opt.activeClass ?? "bg-[var(--accent)] text-white";
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`relative rounded-md font-medium uppercase tracking-[0.05em] transition-colors ${pad} ${
              active
                ? "text-current"
                : "text-[var(--fg-muted)] hover:bg-white/50 hover:text-[var(--fg)]"
            }`}
          >
            {active ? (
              <m.span
                layoutId={`seg-${groupId}`}
                className={`absolute inset-0 rounded-md shadow-sm ${activeFill}`}
                transition={reduce ? { duration: 0 } : SLIDE}
                aria-hidden="true"
              />
            ) : null}
            <span className="relative z-10">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
