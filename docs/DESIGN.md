# Safeguard — HIPAA Security Risk Assessment (SRA) Tool

**Status:** Approved design · Weekend MVP
**Date:** 2026-06-23

## Purpose

A clean, modern web app for performing a **HIPAA Security Rule risk assessment** — a
recognizable, mandatory compliance exercise for any healthcare organization that handles
electronic protected health information (ePHI). It is a portfolio piece demonstrating that
the author can *operationalize* the HIPAA Security Rule, apply a NIST SP 800-30 risk
methodology, and ship working software — the combination that healthcare GRC roles want.

Reference point: the U.S. HHS/ONC "SRA Tool" is a clunky desktop application. Safeguard is a
modern, browser-based take on the same exercise.

## What it does

1. The user works through the HIPAA Security Rule **safeguards**:
   - Administrative (45 CFR §164.308)
   - Physical (45 CFR §164.310)
   - Technical (45 CFR §164.312)
   - Organizational Requirements (45 CFR §164.314)
   - Policies, Procedures & Documentation (45 CFR §164.316)
2. Each **implementation specification** is marked **Required (R)** or **Addressable (A)** —
   the real HIPAA distinction — and carries its exact CFR citation and a plain-language
   description.
3. For each spec the user sets an **implementation status**: Implemented / Partial /
   Not Implemented / Not Applicable, with optional notes.
4. For anything not fully implemented, the user rates **Likelihood × Impact** (Low/Med/High).
   The engine derives a **risk rating** (Low / Medium / High / Critical) from a 3×3 matrix
   (NIST SP 800-30 style).
5. The app rolls scores up into a **dashboard**: overall compliance %, status counts, and a
   risk heatmap by safeguard category.
6. The app generates the actual GRC deliverables:
   - a **risk register** — every gap with its control reference, CFR citation, risk rating,
     and a remediation recommendation;
   - an **exportable report** — print-to-PDF (clean print stylesheet) and Markdown.

## Architecture

- **Stack:** Next.js 16 (App Router, `src/`) · React 19 · TypeScript · Tailwind v4 · Vitest.
- **No backend, no database, no auth.** Assessment state lives in `localStorage`, with
  JSON export/import so a saved assessment is portable. This is a deliberate YAGNI call:
  trivial Vercel deploy, zero infrastructure, and no storage of any real data.
- **Layers (each independently testable):**
  - `src/lib/catalog/` — the HIPAA Security Rule control catalog as typed, static data.
    Single source of truth for controls, citations, required/addressable flags, and
    default remediation guidance.
  - `src/lib/scoring/` — pure functions: risk matrix, per-control status model, category and
    overall rollups, risk-register derivation. No React, no I/O → unit-tested with Vitest.
  - `src/lib/store/` — `localStorage` persistence + JSON import/export + the seeded sample
    assessment. Thin, typed.
  - `src/components/` + `src/app/` — UI: assessment screens per category, dashboard, risk
    register table, report/export view. Client components.
- **Seeded sample:** a fictional "Riverbend Family Clinic" assessment so the live demo is
  populated and tells a story — never an empty screen for a recruiter.

## Risk methodology (NIST SP 800-30 style)

Risk = function(Likelihood, Impact), each on a Low/Medium/High scale, mapped through a 3×3
matrix to a Low / Medium / High / Critical rating. Fully-implemented and N/A controls carry
no open risk. The methodology and the matrix are documented in-app so the output is
defensible, not a black box.

## Testing

Vitest unit tests covering the parts where correctness matters:
- the risk matrix (every Likelihood×Impact cell),
- category and overall rollups (including edge cases: all-N/A, empty, all-implemented),
- catalog integrity (unique IDs, every spec has a citation and a required/addressable flag),
- risk-register derivation (only real gaps appear; ratings match the matrix).

## Out of scope (this weekend)

Multi-user, database, authentication, AI features, real PHI, and multi-framework support
(HITRUST / NIST 800-66 crosswalks). These are the "keep iterating" version, not the MVP.

## Delivery

- Tested locally (`npm test`, `npm run build` green).
- Gated: code-sanity review, verification run, and a public-safety scan (no personal paths,
  usernames, tokens; zero real PHI — only the fictional clinic) before it goes public.
- Deployed to Vercel (live URL).
- Pushed to a public GitHub repo under TanmayKallakuri with a recruiter-facing README.
