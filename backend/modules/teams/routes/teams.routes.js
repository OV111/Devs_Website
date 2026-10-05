import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authenticate } from "../../../middleware/authenticate.js";
import { aiBurstLimiter } from "../../../middleware/aiRateLimit.js";
import { requireAdmin } from "../../../middleware/requireAdmin.js";
import { validate } from "../../../middleware/validate.js";
import {
  addMemberSchema,
  defenseAnswerSchema,
  evidenceRevokeSchema,
  createTeamSchema,
  memberParamSchema,
  publicIdParamSchema,
  ratingParamSchema,
  ratingSchema,
  setRepoSchema,
  statusSchema,
  teamParamSchema,
  userSearchSchema,
} from "../schemas/teams.schemas.js";
import {
  addMember,
  answerDefense,
  createTeam,
  getDefense,
  getPublicEvidence,
  getMyTeam,
  gradeDefense,
  getTeam,
  listTeams,
  searchUsers,
  getEvidenceStatus,
  issueEvidence,
  listContributions,
  listMyRatings,
  rateMember,
  removeMember,
  revokeEvidence,
  setRepo,
  setStatus,
  startDefense,
  syncContributions,
} from "../controllers/teams.controller.js";

const router = Router();

// Public and unauthenticated, so keyed per IP (trust proxy is set in app.js). It
// MUST stay above authenticate and before "/:teamId" so "evidence" is not read as an id.
const evidenceLimiter = rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests. Please wait a minute.", code: 429 },
});
router.get("/evidence/:publicId", evidenceLimiter, validate({ params: publicIdParamSchema }), getPublicEvidence);

router.use(authenticate);

// Admin reads. Both sit above "/:teamId" so "admin" is not read as an id.
router.get("/", requireAdmin, listTeams);
router.get("/admin/users", requireAdmin, validate({ query: userSearchSchema }), searchUsers);

router.get("/mine", getMyTeam); // before "/:teamId" so "mine" is not read as an id
router.get("/:teamId", validate({ params: teamParamSchema }), getTeam);
router.get("/:teamId/contributions", validate({ params: teamParamSchema }), listContributions);

router.get("/:teamId/defense", validate({ params: teamParamSchema }), getDefense);
// start, answer (the last answer triggers grading) and grade all call the model, so they share
// the per-user AI burst limiter (after authenticate, which keys it) like the capstone routes.
router.post("/:teamId/defense/start", aiBurstLimiter, validate({ params: teamParamSchema }), startDefense);
router.post("/:teamId/defense/answer", aiBurstLimiter, validate({ params: teamParamSchema, body: defenseAnswerSchema }), answerDefense);
router.post("/:teamId/defense/grade", aiBurstLimiter, validate({ params: teamParamSchema }), gradeDefense);

router.get("/:teamId/ratings/mine", validate({ params: teamParamSchema }), listMyRatings);
router.put("/:teamId/ratings/:userId", validate({ params: ratingParamSchema, body: ratingSchema }), rateMember);

// Team 1 is run by hand: everything below is admin-only.
router.post("/", requireAdmin, validate({ body: createTeamSchema }), createTeam);
router.put("/:teamId/repo", requireAdmin, validate({ params: teamParamSchema, body: setRepoSchema }), setRepo);
router.post("/:teamId/members", requireAdmin, validate({ params: teamParamSchema, body: addMemberSchema }), addMember);
router.put("/:teamId/status", requireAdmin, validate({ params: teamParamSchema, body: statusSchema }), setStatus);
router.post("/:teamId/sync", requireAdmin, validate({ params: teamParamSchema }), syncContributions);
router.get("/:teamId/evidence", requireAdmin, validate({ params: teamParamSchema }), getEvidenceStatus);
router.post("/:teamId/evidence", requireAdmin, validate({ params: teamParamSchema }), issueEvidence);
router.put("/:teamId/evidence/revocation", requireAdmin, validate({ params: teamParamSchema, body: evidenceRevokeSchema }), revokeEvidence);
router.delete("/:teamId/members/:userId", requireAdmin, validate({ params: memberParamSchema }), removeMember);

export default router;
