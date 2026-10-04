/**
 * The attempt's history as display events, oldest first — what the capstone
 * page shows as "Revision history". Pure: built from records the status
 * endpoint already loads, so every entry is something that really happened.
 *
 * type → how the UI colours it:
 *   assign (purple) · submit (green) · approve (green) · reject (red) · active (pulsing)
 */

const short = (sha) => (sha ? sha.slice(0, 7) : "");

export const buildTimeline = ({ attempt, twistText, submissions = [], review = null, defenses = [], certificate = null }) => {
  if (!attempt) return [];
  const events = [
    {
      type: "assign",
      at: attempt.startedAt,
      action: "Assigned",
      detail: `Attempt ${attempt.attemptNumber} started${twistText ? ` · your twist: ${twistText}` : ""}`,
    },
  ];

  for (const s of submissions) {
    const failed = (s.checks ?? []).filter((c) => !c.passed);
    events.push(
      s.passed
        ? {
            type: "submit",
            at: s.submittedAt,
            action: "Submitted",
            detail: `${s.repo?.fullName ?? s.repoInput} · commit ${short(s.commitSha)} · all automated checks passed`,
          }
        : {
            type: "reject",
            at: s.submittedAt,
            action: "Sent back",
            detail: `${failed.length} automated check${failed.length === 1 ? "" : "s"} failed${failed[0] ? ` — ${failed[0].label}` : ""}`,
          },
    );
  }

  if (review) {
    events.push({
      type: review.passed ? "approve" : "reject",
      at: review.createdAt,
      action: review.passed ? "Review passed" : "Sent back",
      detail: `AI review ${review.totalScore}%${review.passed ? " — on to the defense" : " — below the pass mark"}`,
    });
  }

  for (const d of defenses) {
    events.push({
      type: d.result.passed ? "approve" : "reject",
      at: d.gradedAt,
      action: d.result.passed ? "Defense passed" : "Defense not passed",
      detail: `Defense session ${d.sessionNumber} · ${d.result.score}%`,
    });
  }

  if (attempt.override) {
    events.push({
      type: attempt.status === "passed" ? "approve" : "reject",
      at: attempt.override.at,
      action: "Outcome set by a reviewer",
      detail: attempt.override.reason,
    });
  }

  if (certificate && !certificate.locked) {
    events.push({ type: "approve", at: certificate.issuedAt, action: "Approved", detail: "Certificate issued" });
  }

  // What is happening right now, if anything.
  const NOW_LABEL = {
    checking: "Running automated checks",
    reviewing: "Agent running structured review",
    submitted: "Waiting for the AI review",
    defense: "Defense — answer the agent's questions",
  };
  if (NOW_LABEL[attempt.status]) {
    events.push({ type: "active", at: null, action: "In review", detail: NOW_LABEL[attempt.status] });
  }

  // Oldest first; the live "now" entry (at: null) always last.
  return events.sort((a, b) => (a.at == null) - (b.at == null) || new Date(a.at) - new Date(b.at));
};
