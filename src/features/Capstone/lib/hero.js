import { formatDateTime } from "./format";

/**
 * What the hero says — and the ONE thing it asks the learner to do — for each
 * capstone state. Pure: derived only from server `status` and the running
 * action, so it can be unit-tested without rendering.
 *
 * cta.kind:
 *   "action"  → call actions[cta.action]
 *   "scroll"  → scroll to section `cta.target` (focus `cta.focus` if given)
 *   "link"    → navigate to `cta.to`
 *
 * `pre` (optional) is plain text before the highlight on the second line.
 *
 * @returns {{ tone: "default"|"success"|"danger", lead: string, pre?: string,
 *   highlight: string, body: string, cta: object|null }}
 */
export const heroCopy = (status, busy) => {
  const { attempt, eligibility, certificate, track, review } = status;
  const s = attempt?.status;
  const attemptsLeft = status.maxAttempts - (status.attemptsUsed ?? 0);

  if (!eligibility?.complete) {
    const missing = eligibility.missing?.length
      ? ` Still to pass: ${eligibility.missing.join(", ")}.`
      : "";
    return {
      tone: "default",
      lead: "Finish the path to unlock",
      highlight: "your capstone.",
      body: `Pass every ${track.title} layer exam — ${eligibility.passed} of ${eligibility.total} done.${missing}`,
      cta: { kind: "link", label: "Go to the roadmap", to: "/roadmaps" },
    };
  }

  if (s === "passed") {
    const issued = certificate && !certificate.locked;
    return {
      tone: "success",
      lead: "Shipped. Defended.",
      highlight: "Approved.",
      body: issued
        ? "Your certificate is live, with your repo, commit and scores — anyone can verify it."
        : "You passed. Certificates are part of Pro — upgrade and yours is issued automatically.",
      cta: issued
        ? {
            kind: "link",
            label: "Open your certificate",
            to: certificate.verifyPath,
          }
        : { kind: "link", label: "See plans", to: "/pricing" },
    };
  }

  // A submit in flight leaves the attempt "started" until the server answers,
  // so this is decided by `busy` — otherwise the hero would keep offering
  // "Submit repository" mid-submit.
  if (s === "started" && busy !== "submit") {
    return {
      tone: "default",
      lead: "You finished the path.",
      pre: "Now ",
      highlight: "build something real.",
      body: "Push to a GitHub repository created after you started, then submit. The agent reviews the commit at that moment — later pushes are ignored.",
      cta: {
        kind: "scroll",
        label: "Submit repository",
        target: "submit",
        focus: "capstone-repo",
      },
    };
  }

  if (s === "checking" || busy === "submit") {
    return {
      tone: "default",
      lead: "Checking",
      highlight: "your repository…",
      body: "Automated checks are reading your repo. This takes a moment — you can stay or come back.",
      cta: null,
    };
  }

  if (s === "submitted" || s === "reviewing" || busy === "review") {
    return {
      tone: "default",
      lead: "The agent is reviewing",
      highlight: "your code.",
      body: "It scores every rubric criterion and writes feedback like a senior dev. Then it asks you questions about what you built.",
      cta: { kind: "scroll", label: "Follow the review", target: "review" },
    };
  }

  if (s === "defense") {
    return {
      tone: "default",
      lead: "Now",
      highlight: "defend your code.",
      body: "The review passed. Answer the agent's questions about your decisions to get approved.",
      cta: { kind: "scroll", label: "Answer the questions", target: "review" },
    };
  }

  // No open attempt: either never started, or the last one was sent back.
  if (status.canStart) {
    const retry = Boolean(attempt);
    return {
      tone: retry ? "danger" : "default",
      lead: retry ? "Sent back." : "Your capstone",
      highlight: retry ? "Try again." : "is ready.",
      body: `${retry ? "Read the review below, then start a new attempt — you get a fresh twist." : "Starting assigns your brief and a unique twist. Create your repository after you press start."} Attempt ${status.attemptsUsed + 1} of ${status.maxAttempts}.`,
      cta: {
        kind: "action",
        label: retry ? "Start a new attempt" : "Start the capstone",
        action: "start",
      },
    };
  }

  if (status.reason === "cooldown") {
    return {
      tone: "danger",
      lead: "Sent back.",
      highlight: "Learn, then retry.",
      body: `Your next attempt opens ${formatDateTime(status.retryAt)} with a new twist — ${attemptsLeft} left. Use the review feedback until then.`,
      cta: review
        ? { kind: "scroll", label: "Read the review", target: "review" }
        : null,
    };
  }

  return {
    tone: "danger",
    lead: "No attempts",
    highlight: "left.",
    body: `All ${status.maxAttempts} attempts have been used. The review feedback below is yours to keep.`,
    cta: review
      ? { kind: "scroll", label: "Read the review", target: "review" }
      : null,
  };
};
