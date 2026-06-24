export function SiteFooter() {
  return (
    <footer className="no-print mt-8 border-t border-[var(--border)] bg-[var(--bg-base)]">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-[var(--fg-muted)] sm:px-6">
        <p>
          <span className="font-mono font-medium text-[var(--fg)]">safeguard</span>{" "}
          is a portfolio demonstration. The sample data describes{" "}
          <span className="italic">Riverbend Family Clinic</span>, a fictional
          practice — it contains no real protected health information.
        </p>
        <p className="mt-1">
          This tool supports a HIPAA Security Rule self-assessment using a NIST SP
          800-30 style risk method. It is not legal advice and does not by itself
          establish compliance.
        </p>
      </div>
    </footer>
  );
}
