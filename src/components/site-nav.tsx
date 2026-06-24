"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, useReducedMotion } from "motion/react";
import { useAssessment } from "@/components/assessment-provider";
import { SLIDE } from "@/components/ui/motion";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/assess", label: "Assess" },
  { href: "/register", label: "Register" },
  { href: "/report", label: "Report" },
] as const;

function ShieldMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[var(--accent)]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5 4 5.2v6.1c0 4.6 3.2 8.4 8 10.2 4.8-1.8 8-5.6 8-10.2V5.2L12 2.5Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m8.6 12 2.3 2.3L15.6 9.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteNav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { summary, ready } = useAssessment();

  const openRisks = ready
    ? summary.riskCounts.critical +
      summary.riskCounts.high +
      summary.riskCounts.medium +
      summary.riskCounts.low
    : 0;

  return (
    <header className="no-print frost sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <ShieldMark />
            <span className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-bold tracking-tight text-[var(--fg)]">
                safeguard
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.14em] text-[var(--fg-faint)] sm:inline">
                SRA
              </span>
            </span>
          </Link>

          {ready ? (
            <span className="text-[11px] font-medium tabular-nums text-[var(--fg-muted)] sm:hidden">
              {summary.compliancePct}% compliant
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav
            aria-label="Primary"
            className="flex items-center gap-0.5 overflow-x-auto"
          >
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium tracking-tight transition-colors ${
                    active
                      ? "text-[var(--accent)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {active ? (
                    <m.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-dim)]"
                      transition={reduce ? { duration: 0 } : SLIDE}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Telemetry chip. */}
          {ready ? (
            <div className="hidden items-center gap-2 rounded-lg border border-[var(--rule)] bg-[var(--glass-inset)] px-2.5 py-1 text-[11px] tabular-nums lg:flex">
              <Telemetry
                label="Open"
                value={openRisks}
                tone={openRisks === 0 ? "low" : "warn"}
              />
              <span className="text-[var(--rule-strong)]">·</span>
              <Telemetry
                label="Crit"
                value={summary.riskCounts.critical}
                tone={summary.riskCounts.critical > 0 ? "crit" : "muted"}
              />
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function Telemetry({
  label,
  value,
  suffix = "",
  tone = "muted",
}: {
  label: string;
  value: number;
  suffix?: string;
  tone?: "muted" | "low" | "warn" | "crit";
}) {
  const color =
    tone === "crit"
      ? "text-[var(--critical)]"
      : tone === "warn"
        ? "text-[var(--high)]"
        : tone === "low"
          ? "text-[var(--low)]"
          : "text-[var(--fg)]";
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--fg-faint)]">
        {label}
      </span>
      <span className={`font-semibold ${color}`}>
        {value}
        {suffix}
      </span>
    </span>
  );
}
