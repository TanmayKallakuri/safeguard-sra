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
    "inline-flex items-center justify-center gap-1.5 border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] transition-colors active:translate-y-px";
  const btnNeutral = `${btnBase} border-[var(--rule)] bg-[var(--bg-inset)] text-[var(--fg-muted)] hover:border-[var(--rule-strong)] hover:bg-[var(--bg-elevated)] hover:text-[var(--fg)]`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
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
          <span className="inline-flex items-center gap-2 border border-[rgb(220_38_38_/_0.3)] bg-[rgb(220_38_38_/_0.08)] px-2.5 py-1 text-[11px]">
            <span className="uppercase tracking-[0.06em] text-[#b91c1c]">
              Clear everything?
            </span>
            <button
              type="button"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
                setNotice({ kind: "ok", text: "Assessment cleared." });
              }}
              className="bg-[var(--critical)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-white hover:brightness-90 active:translate-y-px"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--fg-muted)] hover:text-[var(--fg)]"
            >
              Cancel
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className={`${btnBase} border-transparent text-[#b91c1c] hover:bg-[rgb(220_38_38_/_0.08)]`}
          >
            Start over
          </button>
        )}
      </div>

      {notice ? (
        <p
          role="status"
          className={`text-[11px] ${
            notice.kind === "ok" ? "text-[var(--low)]" : "text-[#b91c1c]"
          }`}
        >
          {notice.text}
        </p>
      ) : null}
    </div>
  );
}
