import { submitAttemptService } from "../services/submissionService.js";
import { describeRunner } from "../services/runnerService.js";

export const submit = async (req, res) => {
  try {
    const data = await submitAttemptService(
      req.app.locals.db,
      req.user._id.toString(),
      req.params.id,
    );
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

/**
 * Which sandbox is live. Exposed so the operator can tell at a glance whether
 * the hardened isolate is in use or the weaker child-process fallback.
 */
export const runnerStatus = (_req, res) => {
  res.json({ success: true, ...describeRunner() });
};
