import {
  listChallengesService,
  getChallengeBySlugService,
  getTagCountsService,
  getDailyChallengeService,
  getPersonalStatsService,
} from "../services/challengeService.js";
import {
  getReadinessService,
  getLeaderboardService,
} from "../services/progressService.js";

export const listChallenges = async (req, res) => {
  try {
    const result = await listChallengesService(
      req.app.locals.db,
      req.query,
      req.user._id.toString(),
    );
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const getChallenge = async (req, res) => {
  try {
    const data = await getChallengeBySlugService(
      req.app.locals.db,
      req.params.slug,
      req.user._id.toString(),
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const getTagCounts = async (req, res) => {
  try {
    const data = await getTagCountsService(req.app.locals.db, req.query);
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const getPersonalStats = async (req, res) => {
  try {
    const data = await getPersonalStatsService(
      req.app.locals.db,
      req.user._id.toString(),
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const getReadiness = async (req, res) => {
  try {
    const data = await getReadinessService(
      req.app.locals.db,
      req.user._id.toString(),
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const data = await getLeaderboardService(
      req.app.locals.db,
      req.user._id.toString(),
      {
        scope: req.query.scope,
        range: req.query.range,
        limit: Math.min(25, Math.max(1, +req.query.limit || 5)),
      },
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const getDailyChallenge = async (req, res) => {
  try {
    const data = await getDailyChallengeService(req.app.locals.db);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};
