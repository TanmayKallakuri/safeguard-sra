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
    "inline-flex items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors active:scale-[0.97]";
  const btnNeutral = `${btnBase} border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] hover:border-[var(--border-strong)] hover:bg-[#1b2430]`;

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
          <span className="inline-flex items-center gap-2 rounded-md border border-[rgb(248_113_113_/_0.3)] bg-[rgb(248_113_113_/_0.08)] px-2.5 py-1.5 text-sm">
            <span className="text-[#fca5a5]">Clear everything?</span>
            <button
              type="button"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
                setNotice({ kind: "ok", text: "Assessment cleared." });
              }}
              className="rounded bg-[var(--critical)] px-2 py-0.5 text-xs font-semibold text-[#1a0606] hover:brightness-110 active:scale-95"
            >
              Yes, start over
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded px-2 py-0.5 text-xs font-medium text-[var(--fg-muted)] hover:bg-white/5 hover:text-[var(--fg)]"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className={`${btnBase} border-transparent text-[#fca5a5] hover:bg-[rgb(248_113_113_/_0.08)]`}
          >
            Start over
          </button>
        )}
      </div>

      {notice ? (
        <p
          role="status"
          className={`text-sm ${
            notice.kind === "ok" ? "text-[#6ee7b7]" : "text-[#fca5a5]"
          }`}
        >
          {notice.text}
        </p>
      ) : null}
    </div>
  );
}
