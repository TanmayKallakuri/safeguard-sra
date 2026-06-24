"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { riskRating } from "@/lib/scoring";
import type { RiskLevel, RiskRegisterEntry } from "@/lib/scoring";
import { Cell, Stagger } from "@/components/ui/motion";
import { ratingStyle } from "@/components/ui/tokens";

// Y axis: Likelihood, High at TOP → Low at bottom.
const LIKELIHOODS: RiskLevel[] = ["high", "medium", "low"];
// X axis: Impact, Low → High, left → right.
const IMPACTS: RiskLevel[] = ["low", "medium", "high"];

const AXIS = { low: "L", medium: "M", high: "H" } as const;

/**
 * The 3×3 Likelihood × Impact heatmap — the dashboard centerpiece.
 *
 * Each cell counts open-gap controls whose (likelihood, impact) land there,
 * bucketed straight from the risk register. Cell color is the rating that
 * position maps to via the locked `riskRating()` matrix; background intensity
 * scales with the count (empty cells are ghosted). Clicking a non-empty cell
 * deep-links to the register.
 */
export function RiskMatrix({ register }: { register: RiskRegisterEntry[] }) {
  const router = useRouter();

  // counts[likelihood][impact] = number of open gaps at that position.
  const counts = useMemo(() => {
    const m: Record<RiskLevel, Record<RiskLevel, number>> = {
      low: { low: 0, medium: 0, high: 0 },
      medium: { low: 0, medium: 0, high: 0 },
      high: { low: 0, medium: 0, high: 0 },
    };
    for (const entry of register) {
      m[entry.likelihood][entry.impact] += 1;
    }
    return m;
  }, [register]);

  const max = useMemo(() => {
    let n = 0;
    for (const l of LIKELIHOODS) for (const i of IMPACTS) n = Math.max(n, counts[l][i]);
    return n;
  }, [counts]);

  return (
    <div>
      <div className="flex">
        {/* Y-axis label, rotated. */}
        <div className="flex w-5 items-center justify-center">
          <span className="label rotate-180 [writing-mode:vertical-rl] tracking-[0.2em]">
            Likelihood
          </span>
        </div>

        <div className="flex-1">
          <Stagger className="grid grid-cols-3 gap-px border border-[var(--rule)] bg-[var(--rule)]">
            {LIKELIHOODS.map((likelihood) =>
              IMPACTS.map((impact) => {
                const count = counts[likelihood][impact];
                const rating = riskRating(likelihood, impact);
                const c = ratingStyle(rating);
                // Intensity scales 0..1 with count relative to the busiest cell.
                const intensity = max === 0 ? 0 : count / max;
                const empty = count === 0;
                const bgAlpha = empty ? 0.05 : 0.12 + intensity * 0.38;
                return (
                  <Cell
                    key={`${likelihood}-${impact}`}
                    className="aspect-[4/3] min-h-[58px]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (!empty) router.push("/register");
                      }}
                      disabled={empty}
                      aria-label={`${count} open ${
                        count === 1 ? "risk" : "risks"
                      } at likelihood ${likelihood}, impact ${impact} — ${rating}`}
                      className={`group relative flex h-full w-full flex-col items-center justify-center transition-colors ${
                        empty
                          ? "cursor-default"
                          : "cursor-pointer hover:brightness-125"
                      }`}
                      style={{
                        backgroundColor: empty
                          ? "var(--bg-inset)"
                          : `color-mix(in oklab, ${c.fill} ${Math.round(
                              bgAlpha * 100,
                            )}%, var(--bg-inset))`,
                      }}
                    >
                      <span
                        className={`text-xl font-bold leading-none tabular-nums ${
                          empty ? "text-[var(--fg-faint)]" : c.text
                        }`}
                      >
                        {count}
                      </span>
                      <span
                        className="mt-1 text-[8px] font-semibold uppercase leading-none tracking-[0.12em]"
                        style={{ color: empty ? "var(--fg-faint)" : c.fill }}
                      >
                        {c.label}
                      </span>
                      {/* Hairline accent edge on hover for non-empty cells. */}
                      {!empty ? (
                        <span
                          className="pointer-events-none absolute inset-0 border border-transparent group-hover:border-[var(--rule-strong)]"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  </Cell>
                );
              }),
            )}
          </Stagger>

          {/* X-axis tick labels (Low → High). */}
          <div className="mt-1 grid grid-cols-3 text-center">
            {IMPACTS.map((i) => (
              <span key={i} className="label">
                {AXIS[i]}
              </span>
            ))}
          </div>
          <div className="mt-0.5 text-right">
            <span className="label tracking-[0.18em]">Impact →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
