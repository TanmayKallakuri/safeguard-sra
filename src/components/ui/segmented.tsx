"use client";

import type { ReactNode } from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Optional per-option active styles (e.g. semantic risk colors). */
  activeClass?: string;
}

/**
 * Accessible segmented control built on a radiogroup of buttons. Keyboard-usable
 * (tab to the group, arrow/enter via native button focus) and labelled.
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
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap gap-1 rounded-lg border border-[var(--border)] bg-slate-50 p-1 dark:bg-slate-900"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const activeStyle =
          opt.activeClass ??
          "bg-blue-600 text-white shadow-sm dark:bg-blue-500";
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md font-medium transition-colors ${pad} ${
              active
                ? activeStyle
                : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
