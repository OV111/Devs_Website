/**
 * Solve-status buckets for the More Filters popover.
 *
 * `done` and `inProgress` are both set server-side (challengeService), so
 * these predicates read real state rather than guessing from anything local:
 * a challenge is in progress when an attempt row exists and it isn't solved.
 */
export const STATUS_OPTIONS = [
  { key: "not-started", label: "Not started", test: (c) => !c.done && !c.inProgress },
  { key: "in-progress", label: "In progress", test: (c) => Boolean(c.inProgress) },
  { key: "completed", label: "Completed", test: (c) => Boolean(c.done) },
];
