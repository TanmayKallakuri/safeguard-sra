"use client";

import { useRef, useState } from "react";
import { useAssessment } from "@/components/assessment-provider";
import { exportAssessment, importAssessment } from "@/lib/store";

type Notice = { kind: "ok" | "error"; text: string } | null;

export function ActionsBar() {
  const { doc, loadSample, resetAll, replaceDoc } = useAssessment();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  function handleExport() {
    const json = exportAssessment(doc);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug =
      (doc.orgName || "assessment")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "assessment";
    a.href = url;
    a.download = `safeguard-${slug}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setNotice({ kind: "ok", text: "Exported assessment as JSON." });
  }

  async function handleImportFile(file: File) {
    try {
      const text = await file.text();
      const parsed = importAssessment(text);
      if (!parsed) {
        setNotice({
          kind: "error",
          text: "That file is not a valid Safeguard assessment.",
        });
        return;
      }
      replaceDoc(parsed);
      setNotice({ kind: "ok", text: "Imported assessment." });
    } catch {
      setNotice({ kind: "error", text: "Could not read that file." });
    }
  }

  const btnBase =
    "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors";
  const btnNeutral = `${btnBase} border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-slate-50 dark:hover:bg-slate-800`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={loadSample} className={btnNeutral}>
          Load sample
        </button>
        <button type="button" onClick={handleExport} className={btnNeutral}>
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={btnNeutral}
        >
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          aria-label="Import assessment JSON file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImportFile(file);
            e.target.value = "";
          }}
        />

        {confirmReset ? (
          <span className="inline-flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-2 py-1 text-sm dark:border-red-800 dark:bg-red-950/50">
            <span className="text-red-700 dark:text-red-300">Clear everything?</span>
            <button
              type="button"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
                setNotice({ kind: "ok", text: "Assessment cleared." });
              }}
              className="rounded bg-red-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Yes, start over
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className={`${btnBase} border-transparent text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40`}
          >
            Start over
          </button>
        )}
      </div>

      {notice ? (
        <p
          role="status"
          className={`text-sm ${
            notice.kind === "ok"
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {notice.text}
        </p>
      ) : null}
    </div>
  );
}
