import { describe, it, expect } from "vitest";
import { CATEGORIES, CONTROLS } from "./index";

describe("HIPAA Security Rule catalog integrity", () => {
  it("has a non-trivial number of controls", () => {
    expect(CONTROLS.length).toBeGreaterThanOrEqual(40);
  });

  it("has unique control ids", () => {
    const ids = CONTROLS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every control a CFR citation", () => {
    for (const c of CONTROLS) {
      expect(c.citation, c.id).toMatch(/^45 CFR § 164\.3(08|10|12|14|16)/);
    }
  });

  it("flags every control as required or addressable", () => {
    for (const c of CONTROLS) {
      expect(["required", "addressable"], c.id).toContain(c.requirement);
    }
  });

  it("gives every control a non-empty name, description, and remediation", () => {
    for (const c of CONTROLS) {
      expect(c.name.length, c.id).toBeGreaterThan(0);
      expect(c.description.length, c.id).toBeGreaterThan(10);
      expect(c.remediation.length, c.id).toBeGreaterThan(10);
    }
  });

  it("assigns every control to one of the five known categories", () => {
    const known = new Set(CATEGORIES.map((c) => c.id));
    for (const c of CONTROLS) {
      expect(known.has(c.category), c.id).toBe(true);
    }
  });

  it("has at least one control in every category", () => {
    for (const meta of CATEGORIES) {
      const count = CONTROLS.filter((c) => c.category === meta.id).length;
      expect(count, meta.id).toBeGreaterThan(0);
    }
  });

  it("links every control's standardId to a citation prefix that matches its own", () => {
    for (const c of CONTROLS) {
      // The control id should begin with its standardId (specs nest under the standard),
      // except where the standard itself is the assessable control.
      const sharesRoot =
        c.id.startsWith(c.standardId) || c.standardId.startsWith(c.id.slice(0, 10));
      expect(sharesRoot, `${c.id} vs ${c.standardId}`).toBe(true);
    }
  });

  it("contains the well-known required Risk Analysis control", () => {
    const ra = CONTROLS.find((c) => c.id === "164.308(a)(1)(ii)(A)");
    expect(ra).toBeDefined();
    expect(ra?.requirement).toBe("required");
    expect(ra?.name).toBe("Risk Analysis");
  });
});
