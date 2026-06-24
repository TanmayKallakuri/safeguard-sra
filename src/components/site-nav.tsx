"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, useReducedMotion } from "motion/react";
import { useAssessment } from "@/components/assessment-provider";
import { SPRING } from "@/components/ui/motion";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/assess", label: "Assessment" },
  { href: "/register", label: "Risk register" },
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
        fillOpacity="0.14"
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
  const { summary, register, ready } = useAssessment();

  const openRisks = ready
    ? summary.riskCounts.critical +
      summary.riskCounts.high +
      summary.riskCounts.medium +
      summary.riskCounts.low
    : 0;

  return (
    <header className="no-print frost sticky top-0 z-20 border-b border-[var(--border)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative flex items-center justify-center">
              <ShieldMark />
            </span>
            <span className="flex flex-col leading-none">
              <span className="flex items-center gap-1.5 font-mono text-[15px] font-semibold tracking-tight text-[var(--fg)]">
                safeguard
                <span className="relative flex h-1.5 w-1.5">
                  {/* Pulsing telemetry dot. The ping ring is always in the DOM
                      (so SSR and client markup match) but its animation is
                      disabled under prefers-reduced-motion via the CSS variant. */}
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                </span>
              </span>
              <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-faint)] sm:block">
                HIPAA Security Risk Assessment
              </span>
            </span>
          </Link>
          {ready ? (
            <span className="font-mono text-[11px] tabular-nums text-[var(--fg-muted)] sm:hidden">
              {summary.compliancePct}% compliant
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <nav
            aria-label="Primary"
            className="flex items-center gap-0.5 overflow-x-auto"
          >
            {LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const isRegister = link.href === "/register";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-[13px] font-medium tracking-tight transition-colors ${
                    active
                      ? "text-[var(--fg)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {active ? (
                    <m.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md border border-[rgb(45_212_191_/_0.25)] bg-[var(--accent-dim)]"
                      transition={reduce ? { duration: 0 } : SPRING}
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative z-10 inline-flex items-center">
                    {link.label}
                    {isRegister && ready && register.length > 0 ? (
                      <span className="ml-1.5 inline-flex min-w-4 items-center justify-center rounded bg-[rgb(248_113_113_/_0.16)] px-1 text-[10px] font-semibold tabular-nums text-[#fca5a5]">
                        {register.length}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Telemetry chip — live open-risk count. */}
          {ready ? (
            <div className="hidden items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-inset)] px-2 py-1 lg:flex">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  openRisks === 0 ? "bg-[var(--low)]" : "bg-[var(--high)]"
                }`}
                aria-hidden="true"
              />
              <span className="font-mono text-[11px] tabular-nums text-[var(--fg-muted)]">
                {openRisks} open
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
