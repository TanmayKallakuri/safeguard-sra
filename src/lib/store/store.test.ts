import { describe, it, expect } from "vitest";
import { exportAssessment, importAssessment, sampleAssessment } from "./store";
import { summarize } from "@/lib/scoring";

describe("import/export round-trip", () => {
  it("re-imports an exported sample unchanged", () => {
    const doc = sampleAssessment();
    const restored = importAssessment(exportAssessment(doc));
    expect(restored).not.toBeNull();
    expect(restored!.orgName).toBe(doc.orgName);
    expect(Object.keys(restored!.responses).length).toBe(
      Object.keys(doc.responses).length,
    );
  });
});

describe("importAssessment — defensive parsing of arbitrary input", () => {
  it("rejects non-JSON", () => {
    expect(importAssessment("not json")).toBeNull();
    expect(importAssessment("")).toBeNull();
  });

  it("rejects JSON without a responses object", () => {
    expect(importAssessment("123")).toBeNull();
    expect(importAssessment('{"orgName":"x"}')).toBeNull();
    expect(importAssessment("[]")).toBeNull();
  });

  it("drops malformed individual responses but keeps valid ones", () => {
    const raw = JSON.stringify({
      orgName: "X",
      responses: {
        good: { status: "implemented" },
        badStatus: { status: "banana" },
        notObject: 42,
        partialWithRisk: { status: "partial", likelihood: "high", impact: "high" },
        bogusLevel: { status: "partial", likelihood: "extreme", impact: "high" },
      },
    });
    const doc = importAssessment(raw);
    expect(doc).not.toBeNull();
    expect(doc!.responses.good.status).toBe("implemented");
    expect(doc!.responses.partialWithRisk.likelihood).toBe("high");
    // invalid status -> dropped entirely
    expect(doc!.responses.badStatus).toBeUndefined();
    expect(doc!.responses.notObject).toBeUndefined();
    // invalid likelihood -> field stripped, response kept
    expect(doc!.responses.bogusLevel.status).toBe("partial");
    expect(doc!.responses.bogusLevel.likelihood).toBeUndefined();
  });

  it("imported sample still summarizes correctly", () => {
    const doc = importAssessment(exportAssessment(sampleAssessment()))!;
    const summary = summarize(doc);
    expect(summary.total).toBeGreaterThan(0);
    expect(summary.registerCount).toBeGreaterThan(0);
  });
});
