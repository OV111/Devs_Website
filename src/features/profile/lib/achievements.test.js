import { describe, it, expect } from "vitest";
import { ACHIEVEMENTS, deriveAchievements } from "./achievements";

const earnedIds = (data) =>
  deriveAchievements(data)
    .filter((a) => a.earned)
    .map((a) => a.id);

describe("deriveAchievements", () => {
  it("a brand-new learner has earned nothing (and nothing crashes on missing data)", () => {
    expect(earnedIds()).toEqual([]);
    expect(deriveAchievements()).toHaveLength(ACHIEVEMENTS.length);
  });

  it("exams: taking, passing and scoring 90%+ are separate badges", () => {
    expect(earnedIds({ exams: [{ passed: false, correctAnswers: 5, totalQuestions: 15 }] })).toEqual([
      "first-exam",
    ]);
    expect(earnedIds({ exams: [{ passed: true, correctAnswers: 12, totalQuestions: 15 }] })).toEqual([
      "first-exam",
      "layer-clear",
    ]);
    expect(earnedIds({ exams: [{ passed: true, correctAnswers: 14, totalQuestions: 15 }] })).toContain(
      "exam-90",
    );
  });

  it("an exam with zero questions never counts as 90%+", () => {
    expect(earnedIds({ exams: [{ passed: false, correctAnswers: 0, totalQuestions: 0 }] })).not.toContain(
      "exam-90",
    );
  });

  it("challenges: first solve and 10 solves", () => {
    expect(earnedIds({ challenges: { solved: 1 } })).toEqual(["first-solve"]);
    expect(earnedIds({ challenges: { solved: 10 } })).toEqual(["first-solve", "solves-10"]);
  });

  it("track complete needs every layer exam passed, and a non-empty track", () => {
    const track = (passed, total) => ({ eligibility: { passed, total } });
    expect(earnedIds({ tracks: [track(9, 10)] })).toEqual([]);
    expect(earnedIds({ tracks: [track(10, 10)] })).toEqual(["track-complete"]);
    expect(earnedIds({ tracks: [track(0, 0)] })).toEqual([]);
  });

  it("capstone approved = at least one certificate", () => {
    expect(earnedIds({ certificates: [{ publicId: "x" }] })).toEqual(["capstone"]);
  });

  it("returns display data only — the rule functions don't leak to the UI", () => {
    deriveAchievements().forEach((a) => expect(a).not.toHaveProperty("test"));
  });
});
