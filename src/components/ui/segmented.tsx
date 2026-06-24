"use client";

import { m, useReducedMotion } from "motion/react";
import { useId, type ReactNode } from "react";
import { SPRING } from "@/components/ui/motion";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Optional per-option active fill (e.g. semantic status colors). */
  activeClass?: string;
}

/**
 * Accessible segmented control built on a radiogroup of buttons. The active
 * background is a shared-element `layoutId` so it slides smoothly between
 * options (transform-based FLIP) — the signature "flow" detail. Keyboard-usable
 * and labelled. Reduced motion → the pill snaps without sliding.
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
  // Unique per-instance group so the active pill never slides across separate
  // controls (e.g. Likelihood vs Impact) that happen to render together.
  const groupId = useId();
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="panel-inset inline-flex flex-wrap gap-0.5 rounded-lg p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const activeFill =
          opt.activeClass ?? "bg-[var(--accent)] text-[#04130d]";
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`relative rounded-md font-medium transition-colors ${pad} ${
              active
                ? "text-current"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {active ? (
              <m.span
                layoutId={`seg-${groupId}`}
                className={`absolute inset-0 rounded-md shadow-[0_2px_8px_-2px_rgba(0,0,0,0.6)] ${activeFill}`}
                transition={reduce ? { duration: 0 } : SPRING}
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
