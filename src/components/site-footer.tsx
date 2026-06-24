"use client";

import { useAssessment } from "@/components/assessment-provider";
import { formatDate, isUnsavedStamp } from "@/components/ui/format";

export function SiteFooter() {
  const { doc, ready } = useAssessment();
  const updated =
    ready && !isUnsavedStamp(doc.updatedAt)
      ? formatDate(doc.updatedAt)
      : "unsaved";

  return (
    <footer className="no-print mt-6 border-t border-[var(--rule)] bg-[var(--bg-base)]">
      {/* TUI status line */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-1.5 text-[11px] text-[var(--fg-faint)] sm:px-5">
        <span className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
          <span>
            <span className="text-[var(--accent)]">↹</span> navigate
          </span>
          <span className="text-[var(--rule-strong)]">│</span>
          <span>↵ select</span>
          <span className="hidden text-[var(--rule-strong)] sm:inline">│</span>
          <span className="hidden sm:inline">local-only storage</span>
        </span>
        <span className="whitespace-nowrap">
          updated <span className="text-[var(--fg-muted)]">{updated}</span>
        </span>
      </div>

      {/* Disclaimer */}
      <div className="mx-auto max-w-6xl border-t border-[var(--rule)] px-3 py-4 sm:px-5">
        <p className="prose text-xs leading-relaxed text-[var(--fg-muted)]">
          <span className="font-mono font-semibold text-[var(--fg)]">safeguard</span>{" "}
          is a portfolio demonstration. The sample data describes{" "}
          <span className="italic">Riverbend Family Clinic</span>, a fictional
          practice — it contains no real protected health information. This tool
          supports a HIPAA Security Rule self-assessment using a NIST SP 800-30
          style risk method; it is not legal advice and does not by itself
          establish compliance.
        </p>
      </div>
    </footer>
  );
}
