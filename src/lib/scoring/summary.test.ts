import { describe, it, expect } from "vitest";
import { CONTROLS } from "@/lib/catalog";
import type { AssessmentDocument, ControlResponse } from "./types";
import { summarize, buildRegister } from "./summary";

function makeDoc(responses: Record<string, ControlResponse> = {}): AssessmentDocument {
  return {
    id: "test",
    orgName: "Test Org",
    assessorName: "Tester",
    updatedAt: "2026-01-01T00:00:00.000Z",
    responses,
  };
}

/** Build a doc where every control gets the same status. */
function uniform(status: ControlResponse["status"]): AssessmentDocument {
  const responses: Record<string, ControlResponse> = {};
  for (const c of CONTROLS) responses[c.id] = { status };
  return makeDoc(responses);
}

describe("summarize — empty assessment", () => {
  const s = summarize(makeDoc());

  it("counts every control as unassessed", () => {
    expect(s.total).toBe(CONTROLS.length);
    expect(s.statusCounts.unassessed).toBe(CONTROLS.length);
    expect(s.assessed).toBe(0);
    expect(s.assessedPct).toBe(0);
  });

  it("reports 0% compliance and an empty risk register", () => {
    expect(s.compliancePct).toBe(0);
    expect(s.registerCount).toBe(0);
    expect(s.riskCounts).toEqual({ low: 0, medium: 0, high: 0, critical: 0 });
  });

  it("includes all five categories summing to the catalog total", () => {
    expect(s.categories).toHaveLength(5);
    const totalAcrossCategories = s.categories.reduce((n, c) => n + c.total, 0);
    expect(totalAcrossCategories).toBe(CONTROLS.length);
  });
});

describe("summarize — all implemented", () => {
  const s = summarize(uniform("implemented"));

  it("reports 100% compliance, no gaps", () => {
    expect(s.compliancePct).toBe(100);
    expect(s.assessedPct).toBe(100);
    expect(s.registerCount).toBe(0);
    expect(s.statusCounts.implemented).toBe(CONTROLS.length);
  });
});

describe("summarize — all not applicable", () => {
  const s = summarize(uniform("not-applicable"));

  it("treats compliance as 100% when nothing is applicable", () => {
    expect(s.applicable).toBe(0);
    expect(s.compliancePct).toBe(100);
    expect(s.registerCount).toBe(0);
  });
});

describe("summarize — all not implemented (default medium risk)", () => {
  const s = summarize(uniform("not-implemented"));

  it("puts every control in the register as medium risk by default", () => {
    expect(s.registerCount).toBe(CONTROLS.length);
    expect(s.riskCounts.medium).toBe(CONTROLS.length);
    expect(s.compliancePct).toBe(0);
  });
});

describe("summarize — mixed assessment", () => {
  const ids = CONTROLS.map((c) => c.id);
  const doc = makeDoc({
    [ids[0]]: { status: "implemented" },
    [ids[1]]: { status: "not-applicable" },
    [ids[2]]: { status: "not-implemented", likelihood: "high", impact: "high" }, // critical
    [ids[3]]: { status: "partial", likelihood: "low", impact: "low" }, // low
  });
  const s = summarize(doc);

  it("counts statuses correctly", () => {
    expect(s.statusCounts.implemented).toBe(1);
    expect(s.statusCounts["not-applicable"]).toBe(1);
    expect(s.statusCounts["not-implemented"]).toBe(1);
    expect(s.statusCounts.partial).toBe(1);
    expect(s.statusCounts.unassessed).toBe(CONTROLS.length - 4);
  });

  it("counts risks by rating", () => {
    expect(s.riskCounts.critical).toBe(1);
    expect(s.riskCounts.low).toBe(1);
    expect(s.registerCount).toBe(2);
  });

  it("compliance = implemented / applicable", () => {
    // 1 implemented out of (total - 1 N/A) applicable controls.
    expect(s.applicable).toBe(CONTROLS.length - 1);
    expect(s.compliancePct).toBe(
      Math.round((1 / (CONTROLS.length - 1)) * 100),
    );
  });
});

describe("buildRegister", () => {
  const ids = CONTROLS.map((c) => c.id);
  const doc = makeDoc({
    [ids[0]]: { status: "implemented" },
    [ids[1]]: { status: "partial", likelihood: "low", impact: "low" }, // low
    [ids[2]]: { status: "not-implemented", likelihood: "high", impact: "high" }, // critical
    [ids[3]]: { status: "not-implemented", likelihood: "medium", impact: "high" }, // high
  });
  const register = buildRegister(doc);

  it("includes only gaps", () => {
    expect(register).toHaveLength(3);
    expect(register.every((e) => e.status === "partial" || e.status === "not-implemented")).toBe(
      true,
    );
  });

  it("sorts by descending severity", () => {
    expect(register.map((e) => e.rating)).toEqual(["critical", "high", "low"]);
  });

  it("carries the full control object and citation", () => {
    expect(register[0].control.citation).toMatch(/45 CFR/);
  });

  it("defaults likelihood/impact to medium when unset on a gap", () => {
    const d = makeDoc({ [ids[0]]: { status: "not-implemented" } });
    const reg = buildRegister(d);
    expect(reg[0].likelihood).toBe("medium");
    expect(reg[0].impact).toBe("medium");
    expect(reg[0].rating).toBe("medium");
  });
});
