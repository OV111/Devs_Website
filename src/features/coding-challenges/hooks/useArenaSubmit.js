import { useCallback, useState } from "react";
import posthog, { isPostHogConfigured } from "@/lib/posthog";

/**
 * Server-side grading. Distinct from the in-browser Run: this one is
 * authoritative, pays XP, and returns the solution on a pass.
 */
export default function useArenaSubmit(submitAttempt) {
  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);

  const submit = useCallback(async () => {
    setSubmitting(true);
    try {
      const nextVerdict = await submitAttempt();
      setVerdict(nextVerdict);
      if (isPostHogConfigured) {
        posthog.capture("coding_challenge_submitted", {
          passed: nextVerdict.passed,
          total_tests: nextVerdict.total,
          passed_tests: nextVerdict.passedCount,
        });
      }
    } catch (err) {
      setVerdict({
        passed: false,
        results: [],
        total: 0,
        passedCount: 0,
        error: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  }, [submitAttempt]);

  return { submit, submitting, verdict, setVerdict };
}
