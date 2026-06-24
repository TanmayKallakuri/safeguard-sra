"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAssessment } from "@/components/assessment-provider";

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
      className="h-6 w-6 text-blue-600 dark:text-blue-400"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5 4 5.2v6.1c0 4.6 3.2 8.4 8 10.2 4.8-1.8 8-5.6 8-10.2V5.2L12 2.5Z"
        fill="currentColor"
        fillOpacity="0.12"
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
  const { summary, register, ready } = useAssessment();

  return (
    <header className="no-print sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur supports-[backdrop-filter]:bg-[var(--surface)]/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldMark />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight">
                Safeguard
              </span>
              <span className="hidden text-[11px] text-[var(--muted)] sm:block">
                HIPAA Security Risk Assessment
              </span>
            </span>
          </Link>
          {ready ? (
            <span className="text-xs text-[var(--muted)] sm:hidden">
              {summary.compliancePct}% compliant
            </span>
          ) : null}
        </div>

        <nav
          aria-label="Primary"
          className="flex items-center gap-1 overflow-x-auto"
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
                className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                    : "text-[var(--muted)] hover:bg-slate-100 hover:text-[var(--foreground)] dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
                {isRegister && ready && register.length > 0 ? (
                  <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-[11px] font-semibold tabular-nums text-red-700 dark:bg-red-950 dark:text-red-300">
                    {register.length}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
