import {
  getPublicEvidenceService,
  issueEvidenceService,
  setEvidenceRevokedService,
} from "../services/evidenceService.js";
import { listMyRatingsService, rateMemberService } from "../services/ratingService.js";
import { ObjectId } from "mongodb";
import {
  answerTeamDefenseService,
  getTeamDefenseService,
  gradeTeamDefenseService,
  startTeamDefenseService,
} from "../services/teamDefenseService.js";
import {
  addMemberService,
  createTeamService,
  getMyTeamService,
  getTeamService,
  removeMemberService,
  setRepoService,
  setStatusService,
} from "../services/teamsService.js";
import { listContributionsService, syncContributionsService } from "../services/contributionService.js";

const handle = (fn) => async (req, res) => {
  try {
    res.json({ success: true, data: await fn(req) });
  } catch (err) {
    if (!err.status) console.error("teams error:", err);
    res.status(err.status ?? 500).json({ success: false, message: err.status ? err.message : "Something went wrong" });
  }
};

const db = (req) => req.app.locals.db;

export const createTeam = handle((req) => createTeamService(db(req), req.body));
export const setRepo = handle((req) => setRepoService(db(req), req.params.teamId, req.body));
export const addMember = handle((req) => addMemberService(db(req), req.params.teamId, req.body));
export const removeMember = handle((req) => removeMemberService(db(req), req.params.teamId, req.params.userId));
// viewerId lets the client tell "me" from teammates without a separate profile call.
const withViewer = (team, req) => (team ? { ...team, viewerId: req.user._id } : null);
export const getTeam = handle(async (req) => withViewer(await getTeamService(db(req), req.params.teamId, req.user), req));
export const getMyTeam = handle(async (req) => withViewer(await getMyTeamService(db(req), req.user._id), req));
export const syncContributions = handle((req) => syncContributionsService(db(req), req.params.teamId));
export const listContributions = handle(async (req) => {
  await getTeamService(db(req), req.params.teamId, req.user); // same member/admin check as the team page
  return listContributionsService(db(req), req.params.teamId);
});

// Team defense: always the signed-in member's own session, never a userId from the client.
const me = (req) => new ObjectId(req.user._id);
export const getDefense = handle((req) => getTeamDefenseService(db(req), req.params.teamId, me(req)));
export const startDefense = handle((req) => startTeamDefenseService(db(req), req.params.teamId, me(req)));
export const answerDefense = handle((req) => answerTeamDefenseService(db(req), req.params.teamId, me(req), req.body));
export const gradeDefense = handle((req) => gradeTeamDefenseService(db(req), req.params.teamId, me(req)));

export const rateMember = handle((req) =>
  rateMemberService(db(req), req.params.teamId, me(req), new ObjectId(req.params.userId), req.body),
);
export const listMyRatings = handle((req) => listMyRatingsService(db(req), req.params.teamId, me(req)));

export const issueEvidence = handle((req) => issueEvidenceService(db(req), req.user._id, req.params.teamId));
export const revokeEvidence = handle((req) => setEvidenceRevokedService(db(req), req.params.teamId, req.body.revoked));
export const getPublicEvidence = handle((req) => getPublicEvidenceService(db(req), req.params.publicId));

export const setStatus = handle((req) => setStatusService(db(req), req.params.teamId, req.body.status));
