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
      <label className="block">
        <span className="block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
          {label}
        </span>
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
          className="mt-0.5 w-full max-w-md rounded-md border border-blue-400 bg-[var(--surface)] px-2 py-1 text-lg font-semibold outline-none"
        />
      </label>
    );
  }

  return (
    <div>
      <span className="block text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
        {label}
      </span>
      <button
        type="button"
        onClick={startEditing}
        className="group mt-0.5 inline-flex items-center gap-1.5 text-left"
        title={`Edit ${label.toLowerCase()}`}
      >
        <span
          className={`text-lg font-semibold ${
            value ? "" : "text-[var(--muted)] italic"
          }`}
        >
          {value || placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 20h4l10-10-4-4L4 16v4ZM14 6l4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function OrgHeader() {
  const { doc, setMeta } = useAssessment();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <EditableField
        label="Organization"
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
