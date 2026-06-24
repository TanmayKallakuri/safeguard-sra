"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, useReducedMotion } from "motion/react";
import { useAssessment } from "@/components/assessment-provider";
import { SLIDE } from "@/components/ui/motion";

const LINKS = [
  { href: "/", label: "dashboard" },
  { href: "/assess", label: "assess" },
  { href: "/register", label: "register" },
  { href: "/report", label: "report" },
] as const;

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
      {/* Tier 1 — status bar: wordmark + live telemetry. */}
      <div className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-1.5 sm:px-5">
          <Link
            href="/"
            className="flex items-baseline gap-0 text-[15px] font-bold tracking-tight text-[var(--fg)]"
          >
            safeguard
            <span className="cursor" aria-hidden="true" />
          </Link>

          {ready ? (
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-medium tabular-nums sm:gap-3">
              <Telemetry
                label="OPEN"
                value={openRisks}
                tone={openRisks === 0 ? "low" : "warn"}
              />
              <span className="text-[var(--fg-faint)]">·</span>
              <Telemetry
                label="CRIT"
                value={summary.riskCounts.critical}
                tone={summary.riskCounts.critical > 0 ? "crit" : "muted"}
              />
              <span className="text-[var(--fg-faint)]">·</span>
              <Telemetry label="COMPLIANCE" value={summary.compliancePct} suffix="%" />
            </div>
          ) : (
            <span className="text-[11px] text-[var(--fg-faint)]">connecting…</span>
          )}
        </div>
      </div>

      {/* Tier 2 — path-style nav. */}
      <nav
        aria-label="Primary"
        className="border-b border-[var(--rule)] bg-[color-mix(in_oklab,var(--bg-base)_60%,transparent)]"
      >
        <div className="mx-auto flex max-w-6xl items-center gap-0.5 overflow-x-auto px-2 sm:px-4">
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
                className={`relative whitespace-nowrap px-2.5 py-2 text-[13px] tracking-tight transition-colors ${
                  active
                    ? "text-[var(--accent)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                <span className="text-[var(--fg-faint)]">~/</span>
                {link.label}
                {active ? (
                  <m.span
                    layoutId="nav-active"
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--accent)]"
                    transition={reduce ? { duration: 0 } : SLIDE}
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      </nav>
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
      ? "text-[#f87b77]"
      : tone === "warn"
        ? "text-[#f7ab73]"
        : tone === "low"
          ? "text-[#6dd1a3]"
          : "text-[var(--fg)]";
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <span className="text-[10px] tracking-[0.1em] text-[var(--fg-faint)]">
        {label}
      </span>
      <span className={`font-semibold ${color}`}>
        {value}
        {suffix}
      </span>
    </span>
  );
}
