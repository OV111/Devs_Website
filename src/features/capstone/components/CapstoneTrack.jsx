import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import useCapstone from "../hooks/useCapstone";
import CapstoneHero from "./CapstoneHero";
import AgentStatusCard from "./AgentStatusCard";
import AssignmentCard from "./AssignmentCard";
import OnApprovalCard from "./OnApprovalCard";
import SubmissionPanel from "./SubmissionPanel";
import RevisionHistory from "./RevisionHistory";
import AgentReviewFullCard from "./AgentReviewFullCard";
import { ErrorBanner, PrimaryButton, SURFACE } from "./ui";
import { TrackSkeleton } from "./CapstoneSkeleton";
import { markIntroPlayed } from "../lib/motion";

const PAGE = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-12";

/** Full-page load failure: what happened, and one way forward. */
function LoadError({ error, onRetry }) {
  return (
    <div className={`${PAGE} pb-20 pt-14`}>
      <div
        role="alert"
        className={`${SURFACE} mx-auto flex max-w-lg flex-col items-start gap-4 p-7`}
      >
        <span className="grid size-10 place-items-center rounded-full bg-amber-500/10 text-amber-300">
          <AlertTriangle size={20} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-lg font-semibold text-white">
            Couldn't load your capstone
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-neutral-300">
            {error.message}
          </p>
        </div>
        <PrimaryButton onClick={onRetry}>
          <RotateCcw size={16} aria-hidden="true" /> Try again
        </PrimaryButton>
      </div>
    </div>
  );
}

/**
 * One capstone track, rendered entirely from server state (useCapstone).
 *
 * Layout: the hero states where the learner is and offers ONE action; below,
 * a two-column grid puts the work on the left (what you do now first) and
 * context on the right. Review sections follow once there is a review.
 */
export default function CapstoneTrack({ trackId }) {
  const {
    status,
    defense,
    loading,
    loadError,
    busy,
    actionError,
    clearError,
    actions,
  } = useCapstone(trackId);

  // After the first real render, later visits skip the entrance animations.
  useEffect(() => {
    if (!loading) markIntroPlayed();
  }, [loading]);

  if (loading) return <TrackSkeleton />;
  if (loadError)
    return <LoadError error={loadError} onRetry={actions.reload} />;

  const { attempt, review, timeline } = status;
  const attemptStatus = attempt?.status;
  // While an attempt can still take a submission, the form comes first.
  const building = ["started", "checking"].includes(attemptStatus);
  const showReview =
    review ||
    attemptStatus === "submitted" ||
    attemptStatus === "reviewing" ||
    busy === "review";

  const brief = (
    <div id="brief" className="scroll-mt-24">
      <AssignmentCard status={status} />
    </div>
  );
  const submission = attempt && (
    <div id="submit" className="scroll-mt-24">
      <SubmissionPanel status={status} onSubmit={actions.submit} busy={busy} />
    </div>
  );

  return (
    <div className="min-h-screen pb-24 text-white">
      {/* ── Hero + agent ── */}
      <div className={`${PAGE} pt-12 sm:pt-14`}>
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_400px] lg:gap-12">
          <CapstoneHero status={status} busy={busy} actions={actions} />
          <div className="lg:mt-10">
            <AgentStatusCard status={status} busy={busy} />
          </div>
        </div>

        {actionError && (
          <div className="mt-8">
            <ErrorBanner error={actionError} onDismiss={clearError} />
          </div>
        )}
      </div>

      {/* ── The work (left) + context (right) ── */}
      <div className={`${PAGE} mt-14 sm:mt-16`}>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex min-w-0 flex-col gap-6">
            {building ? (
              <>
                {submission}
                {brief}
              </>
            ) : (
              <>
                {brief}
                {submission}
              </>
            )}
          </div>
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            {attempt ? (
              <RevisionHistory timeline={timeline} />
            ) : (
              <OnApprovalCard />
            )}
          </div>
        </div>
      </div>

      {/* ── Full agent review ── */}
      {showReview && (
        <div
          id="review"
          className={`${PAGE} mt-6 flex scroll-mt-24 flex-col gap-6`}
        >
          <AgentReviewFullCard
            review={review}
            attemptStatus={attemptStatus}
            defense={review?.passed ? defense : null}
            busy={busy}
            actions={actions}
          />
        </div>
      )}
    </div>
  );
}
