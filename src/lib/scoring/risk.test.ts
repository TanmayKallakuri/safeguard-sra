import { describe, it, expect } from "vitest";
import {
  riskRating,
  isGap,
  statusOf,
  controlRating,
  maxRating,
  severityIndex,
} from "./risk";
import type { ControlResponse, RiskLevel } from "./types";

describe("riskRating (3×3 NIST 800-30 matrix)", () => {
  // Exhaustively assert every cell of the matrix.
  const cases: [RiskLevel, RiskLevel, string][] = [
    ["low", "low", "low"],
    ["low", "medium", "low"],
    ["low", "high", "medium"],
    ["medium", "low", "low"],
    ["medium", "medium", "medium"],
    ["medium", "high", "high"],
    ["high", "low", "medium"],
    ["high", "medium", "high"],
    ["high", "high", "critical"],
  ];

  it.each(cases)("L=%s × I=%s → %s", (likelihood, impact, expected) => {
    expect(riskRating(likelihood, impact)).toBe(expected);
  });

  it("is symmetric for low/high corners (defensible ordering)", () => {
    expect(riskRating("low", "high")).toBe(riskRating("high", "low"));
  });
});

describe("isGap", () => {
  it("treats partial and not-implemented as gaps", () => {
    expect(isGap("partial")).toBe(true);
    expect(isGap("not-implemented")).toBe(true);
  });
  it("does not treat implemented / N/A / unassessed as gaps", () => {
    expect(isGap("implemented")).toBe(false);
    expect(isGap("not-applicable")).toBe(false);
    expect(isGap("unassessed")).toBe(false);
  });
});

describe("statusOf", () => {
  it("returns unassessed for a missing response", () => {
    expect(statusOf(undefined)).toBe("unassessed");
  });
  it("returns the response status when present", () => {
    expect(statusOf({ status: "implemented" })).toBe("implemented");
  });
});

describe("controlRating", () => {
  it("is none for non-gaps", () => {
    expect(controlRating({ status: "implemented" })).toBe("none");
    expect(controlRating({ status: "not-applicable" })).toBe("none");
    expect(controlRating(undefined)).toBe("none");
  });

  it("uses provided likelihood/impact for gaps", () => {
    const r: ControlResponse = {
      status: "not-implemented",
      likelihood: "high",
      impact: "high",
    };
    expect(controlRating(r)).toBe("critical");
  });

  it("defaults unset likelihood/impact to medium for gaps", () => {
    expect(controlRating({ status: "partial" })).toBe("medium");
    expect(controlRating({ status: "not-implemented", likelihood: "high" })).toBe(
      "high",
    );
  });
});

describe("severity helpers", () => {
  it("orders ratings none < low < medium < high < critical", () => {
    expect(severityIndex("none")).toBe(0);
    expect(severityIndex("low")).toBe(1);
    expect(severityIndex("medium")).toBe(2);
    expect(severityIndex("high")).toBe(3);
    expect(severityIndex("critical")).toBe(4);
  });

  it("maxRating returns the more severe rating", () => {
    expect(maxRating("low", "critical")).toBe("critical");
    expect(maxRating("high", "medium")).toBe("high");
    expect(maxRating("none", "low")).toBe("low");
  });
});
