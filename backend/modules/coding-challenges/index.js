/**
 * Coding Challenges module — the only public entry point.
 *
 * Everything DevsWebs needs from this module is re-exported here, so `app.js`
 * mounts one router and never reaches inside the module's folders. Sub-routers
 * are added to this router as each stage lands (attempts, submissions, admin).
 */

import { Router } from "express";
import challengeRoutes from "./routes/challenge.routes.js";
import attemptRoutes from "./routes/attempt.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import proposalRoutes from "./routes/admin.routes.js";

const router = Router();

// "/attempts" is mounted before the challenge routes because those end in a
// catch-all "/:slug" — a sub-router registered after it would be shadowed.
router.use("/attempts", attemptRoutes);
router.use("/submissions", submissionRoutes);
router.use("/proposals", proposalRoutes);
router.use("/", challengeRoutes);

export default router;
