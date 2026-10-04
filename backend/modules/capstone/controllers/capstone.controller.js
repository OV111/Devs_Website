import {
  getCatalogService,
  getOverviewService,
  getStatusService,
  startAttemptService,
} from "../services/capstoneService.js";
import { submitService } from "../services/submissionService.js";
import { reviewService } from "../services/reviewService.js";
import {
  answerDefenseService,
  getDefenseService,
  gradeDefenseService,
  startDefenseService,
} from "../services/defenseService.js";

// Services throw errors carrying `status` (and optional `details`, e.g. the
// missing layers or a retryAt). Anything without a status is a real bug: log
// it and hide the message from the client.
const sendError = (res, err) => {
  if (!err.status) console.error("capstone error:", err);
  res.status(err.status ?? 500).json({
    success: false,
    message: err.status ? err.message : "Something went wrong",
    ...(err.details ?? {}),
  });
};

export const getStatus = async (req, res) => {
  try {
    const data = await getStatusService(req.app.locals.db, req.user._id.toString(), req.params.trackId);
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};

export const startAttempt = async (req, res) => {
  try {
    const data = await startAttemptService(req.app.locals.db, req.user._id.toString(), req.params.trackId);
    res.status(data.resumed ? 200 : 201).json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};

export const submit = async (req, res) => {
  try {
    const data = await submitService(
      req.app.locals.db,
      req.user._id.toString(),
      req.params.trackId,
      req.body.repo, // { owner, repo } — parsed and validated by submitSchema
    );
    res.status(201).json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};

// Synchronous: a review takes roughly 10–40 seconds and the client shows a
// progress state. If the request dies mid-review, the claim goes stale after
// REVIEW_LOCK_STALE_MS and a retry works.
export const review = async (req, res) => {
  try {
    const data = await reviewService(req.app.locals.db, req.user._id.toString(), req.params.trackId);
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};

const handle = (fn) => async (req, res) => {
  try {
    const data = await fn(req);
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};
const args = (req) => [req.app.locals.db, req.user._id.toString(), req.params.trackId];

export const getDefense = handle((req) => getDefenseService(...args(req)));
export const startDefense = handle((req) => startDefenseService(...args(req)));
export const answerDefense = handle((req) => answerDefenseService(...args(req), req.body));
export const gradeDefense = handle((req) => gradeDefenseService(...args(req)));

// Public: includes drafts as locked previews. Learners can open published ones only.
export const getCatalog = handle((req) => getCatalogService(req.app.locals.db, { includeDrafts: true }));
export const getOverview = handle((req) => getOverviewService(req.app.locals.db, req.user._id.toString()));
