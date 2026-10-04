import { describe, it, expect } from "vitest";
import { evidenceRef, levelOf, summarize } from "./review";

describe("levelOf", () => {
  it("maps each 0–4 rubric score to one label", () => {
    expect([0, 1, 2, 3, 4].map((s) => levelOf(s).label)).toEqual([
      "Missing",
      "Weak",
      "Needs work",
      "Strong",
      "Excellent",
    ]);
  });

  it("matches the server's strong cut (score >= 3)", () => {
    expect(levelOf(2).strong).toBe(false);
    expect(levelOf(3).strong).toBe(true);
  });

  it("rounds and clamps out-of-range scores instead of crashing", () => {
    expect(levelOf(2.6).label).toBe("Strong");
    expect(levelOf(9).label).toBe("Excellent");
    expect(levelOf(-1).label).toBe("Missing");
  });
});

describe("summarize", () => {
  it("counts strong vs needs-work with the same rule as the chips", () => {
    const criteria = [{ score: 4 }, { score: 3 }, { score: 2 }, { score: 0 }];
    expect(summarize(criteria)).toEqual({ strong: 2, needsWork: 2 });
  });
});

describe("evidenceRef", () => {
  it("formats path:line, or just the path when there is no line", () => {
    expect(evidenceRef({ path: "src/auth.js", line: 31 })).toBe("src/auth.js:31");
    expect(evidenceRef({ path: "README.md" })).toBe("README.md");
  });
});
