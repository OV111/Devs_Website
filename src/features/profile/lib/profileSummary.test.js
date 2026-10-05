import { describe, it, expect } from "vitest";
import { formatLastActive, summarizeProfile } from "./profileSummary";

describe("summarizeProfile", () => {
  it("adds layer exams across tracks and counts only non-revoked certificates", () => {
    const out = summarizeProfile({
      tracks: [{ eligibility: { passed: 3 } }, { eligibility: { passed: 2 } }],
      certificates: [{ revoked: false }, { revoked: true }],
    });
    expect(out).toEqual({ layersPassed: 5, capstones: 1, headline: "5 layers passed · 1 capstone passed" });
  });

  it("returns no headline when nothing is passed yet", () => {
    expect(summarizeProfile({ tracks: [{ eligibility: { passed: 0 } }], certificates: [] }).headline).toBeNull();
    expect(summarizeProfile().headline).toBeNull();
  });

  it("uses the singular for one", () => {
    expect(summarizeProfile({ tracks: [{ eligibility: { passed: 1 } }] }).headline).toBe("1 layer passed");
  });
});

describe("formatLastActive", () => {
  const now = new Date("2026-10-05T12:00:00Z");
  const ago = (ms) => new Date(now.getTime() - ms).toISOString();

  it("says Active now for missing, invalid or very recent values", () => {
    expect(formatLastActive(null, now)).toBe("Active now");
    expect(formatLastActive("nope", now)).toBe("Active now");
    expect(formatLastActive(ago(60_000), now)).toBe("Active now");
  });

  it("uses minutes, hours and days", () => {
    expect(formatLastActive(ago(10 * 60_000), now)).toBe("10 minutes ago");
    expect(formatLastActive(ago(3_600_000), now)).toBe("1 hour ago");
    expect(formatLastActive(ago(2 * 86_400_000), now)).toBe("2 days ago");
  });

  it("falls back to a date after a month", () => {
    expect(formatLastActive(ago(40 * 86_400_000), now)).toMatch(/2026|Aug|Sep/);
  });
});
