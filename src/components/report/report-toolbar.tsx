"use client";

import { useEffect, useRef, useState } from "react";
import { useAssessment } from "@/components/assessment-provider";
import { buildReportMarkdown } from "@/components/report/markdown";

export function ReportToolbar() {
  const { doc, summary, register } = useAssessment();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending "Copied" reset timer on unmount so we never call
  // setState on an unmounted component (also covers StrictMode double-mount).
  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    };
  }, []);

  function flagCopied() {
    setCopied(true);
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      setCopied(false);
      resetTimer.current = null;
    }, 2000);
  }

  async function copyMarkdown() {
    const md = buildReportMarkdown(doc, summary, register);
    try {
      await navigator.clipboard.writeText(md);
      flagCopied();
    } catch {
      // Fallback: open a textarea selection so the user can copy manually.
      const ta = document.createElement("textarea");
      ta.value = md;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        flagCopied();
      } catch {
        /* no-op */
      }
      ta.remove();
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6v-7Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Print / Save as PDF
      </button>
      <button
        type="button"
        onClick={copyMarkdown}
        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        {copied ? (
          <>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-emerald-600"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m5 13 4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 9V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-4M5 9h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Copy as Markdown
          </>
        )}
      </button>
    </div>
  );
}
