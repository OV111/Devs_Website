/**
 * Achievements derived from data the profile already loads — no separate
 * achievements store to keep in sync, and nothing self-reported.
 *
 * Each rule reads the four profile sources:
 *   exams        recent exam attempts (the API returns the last 10)
 *   challenges   /challenges/stats/me  ({ solved, attempted, ... }) or null
 *   tracks       /capstone overview    ([{ eligibility: { passed, total } }])
 *   certificates issued capstone certificates
 *
 * Known limit: exam rules only see the last 10 attempts, so a very old 90%+
 * exam can be missed. Moving these rules server-side would fix that.
 */
export const ACHIEVEMENTS = [
  {
    id: "first-exam",
    label: "First exam",
    char: "1",
    tone: "teal",
    hint: "Take any layer exam",
    test: ({ exams }) => exams.length > 0,
  },
  {
    id: "layer-clear",
    label: "Layer cleared",
    char: "✓",
    tone: "purple",
    hint: "Pass a layer exam",
    test: ({ exams }) => exams.some((e) => e.passed),
  },
  {
    id: "exam-90",
    label: "90%+ exam",
    char: "90",
    tone: "amber",
    hint: "Score 90% or more on an exam",
    test: ({ exams }) =>
      exams.some(
        (e) =>
          e.totalQuestions > 0 && e.correctAnswers / e.totalQuestions >= 0.9,
      ),
  },
  {
    id: "first-solve",
    label: "First solve",
    char: "A",
    tone: "orange",
    hint: "Solve a coding challenge",
    test: ({ challenges }) => (challenges?.solved ?? 0) >= 1,
  },
  {
    id: "solves-10",
    label: "10 solves",
    char: "10",
    tone: "yellow",
    hint: "Solve 10 coding challenges",
    test: ({ challenges }) => (challenges?.solved ?? 0) >= 10,
  },
  {
    id: "track-complete",
    label: "Track complete",
    char: "▶",
    tone: "teal",
    hint: "Pass every layer exam of a track",
    test: ({ tracks }) =>
      tracks.some(
        (t) =>
          t.eligibility.total > 0 &&
          t.eligibility.passed >= t.eligibility.total,
      ),
  },
  {
    id: "capstone",
    label: "Capstone approved",
    char: "★",
    tone: "purple",
    hint: "Get a capstone approved",
    test: ({ certificates }) => certificates.length > 0,
  },
];

/** Every achievement with `earned` resolved. Missing sources count as "not yet". */
export const deriveAchievements = ({
  exams = [],
  challenges = null,
  tracks = [],
  certificates = [],
} = {}) =>
  ACHIEVEMENTS.map(({ test, ...achievement }) => ({
    ...achievement,
    earned: Boolean(test({ exams, challenges, tracks, certificates })),
  }));
