"use client";

import { useState } from "react";
import { useAssessment } from "@/components/assessment-provider";

function EditableField({
  label,
  value,
  placeholder,
  onCommit,
}: {
  label: string;
  value: string;
  placeholder: string;
  onCommit: (next: string) => void;
}) {
  // `draft` is only meaningful while editing; we seed it from the current value
  // when the user opens the field, so there's no prop→state sync effect.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function startEditing() {
    setDraft(value);
    setEditing(true);
  }

  function commit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) onCommit(trimmed);
  }

  if (editing) {
    return (
      <label className="flex min-w-0 items-center gap-2">
        <span className="label w-12 shrink-0">{label}</span>
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          placeholder={placeholder}
          className="inset min-w-0 flex-1 border-[var(--accent)] px-2 py-1 text-sm font-semibold text-[var(--fg)] outline-none placeholder:text-[var(--fg-faint)]"
        />
      </label>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="label w-12 shrink-0">{label}</span>
      <button
        type="button"
        onClick={startEditing}
        className="group inline-flex min-w-0 items-center gap-1.5 text-left"
        title={`Edit ${label.toLowerCase()}`}
      >
        <span
          className={`truncate text-sm font-semibold ${
            value ? "text-[var(--fg)]" : "italic text-[var(--fg-faint)]"
          }`}
        >
          {value || placeholder}
        </span>
        <span
          className="text-[var(--fg-faint)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          ✎
        </span>
      </button>
    </div>
  );
}

export function OrgHeader() {
  const { doc, setMeta } = useAssessment();
  return (
    <div className="grid gap-2 sm:grid-cols-2 sm:gap-6">
      <EditableField
        label="Org"
        value={doc.orgName}
        placeholder="Name your organization"
        onCommit={(orgName) => setMeta({ orgName })}
      />
      <EditableField
        label="Assessor"
        value={doc.assessorName}
        placeholder="Who is running this assessment?"
        onCommit={(assessorName) => setMeta({ assessorName })}
      />
    </div>
  );
}
