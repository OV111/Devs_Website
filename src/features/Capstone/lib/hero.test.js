import { describe, it, expect } from "vitest";
import { heroCopy } from "./hero";

// A minimal capstone status; each test overrides only what it is about.
const status = (over = {}) => ({
  track: { title: "API Developer" },
  eligibility: { complete: true, passed: 10, total: 10, missing: [] },
  attempt: null,
  certificate: null,
  review: null,
  maxAttempts: 3,
  attemptsUsed: 0,
  canStart: false,
  reason: null,
  retryAt: null,
  ...over,
});

describe("heroCopy", () => {
  it("locked: points to the roadmap and names what is still missing", () => {
    const copy = heroCopy(
      status({ eligibility: { complete: false, passed: 3, total: 10, missing: ["L4", "L5"] } }),
    );
    expect(copy.cta).toEqual({ kind: "link", label: "Go to the roadmap", to: "/roadmaps" });
    expect(copy.body).toContain("3 of 10");
    expect(copy.body).toContain("L4, L5");
  });

  it("ready, first attempt: the one action is to start", () => {
    const copy = heroCopy(status({ canStart: true }));
    expect(copy.cta).toMatchObject({ kind: "action", action: "start", label: "Start the capstone" });
    expect(copy.tone).toBe("default");
    expect(copy.body).toContain("Attempt 1 of 3");
  });

  it("ready after being sent back: retry wording and a danger tone", () => {
    const copy = heroCopy(
      status({ canStart: true, attemptsUsed: 1, attempt: { status: "failed" } }),
    );
    expect(copy.cta.label).toBe("Start a new attempt");
    expect(copy.tone).toBe("danger");
    expect(copy.body).toContain("Attempt 2 of 3");
  });

  it("building: keeps the original headline and scrolls to the repo field", () => {
    const copy = heroCopy(status({ attempt: { status: "started" } }));
    expect([copy.lead, copy.pre, copy.highlight]).toEqual([
      "You finished the path.",
      "Now ",
      "build something real.",
    ]);
    expect(copy.cta).toMatchObject({ kind: "scroll", target: "submit", focus: "capstone-repo" });
  });

  it("checking: no action while the server works (also when the submit is in flight)", () => {
    expect(heroCopy(status({ attempt: { status: "checking" } })).cta).toBeNull();
    expect(heroCopy(status({ attempt: { status: "started" } }), "submit").cta).toBeNull();
  });

  it("reviewing and defense both send the learner to the review", () => {
    expect(heroCopy(status({ attempt: { status: "reviewing" } })).cta.target).toBe("review");
    const defense = heroCopy(status({ attempt: { status: "defense" } }));
    expect(defense.cta).toMatchObject({ target: "review", label: "Answer the questions" });
  });

  it("passed with a certificate: links to it", () => {
    const copy = heroCopy(
      status({
        attempt: { status: "passed" },
        certificate: { locked: false, verifyPath: "/verify/abc123def456" },
      }),
    );
    expect(copy.tone).toBe("success");
    expect(copy.cta).toEqual({ kind: "link", label: "Open your certificate", to: "/verify/abc123def456" });
  });

  it("passed but certificate locked behind Pro: links to pricing", () => {
    const copy = heroCopy(status({ attempt: { status: "passed" }, certificate: { locked: true } }));
    expect(copy.cta.to).toBe("/pricing");
  });

  it("cooldown: says how many attempts are left; offers the review only if there is one", () => {
    const base = { attempt: { status: "failed" }, attemptsUsed: 1, reason: "cooldown", retryAt: "2026-10-10T10:00:00Z" };
    const withReview = heroCopy(status({ ...base, review: { totalScore: 64 } }));
    expect(withReview.body).toContain("2 left");
    expect(withReview.cta.target).toBe("review");
    expect(heroCopy(status(base)).cta).toBeNull();
  });

  it("out of attempts", () => {
    const copy = heroCopy(
      status({ attempt: { status: "failed" }, attemptsUsed: 3, reason: "max_attempts" }),
    );
    expect(`${copy.lead} ${copy.highlight}`).toBe("No attempts left.");
  });
});
