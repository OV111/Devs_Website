import {
  listChallengesService,
  getChallengeBySlugService,
  getTagCountsService,
  getDailyChallengeService,
} from "../services/challengeService.js";

export const listChallenges = async (req, res) => {
  try {
    const result = await listChallengesService(req.app.locals.db, req.query);
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

export const getDailyChallenge = async (req, res) => {
  try {
    const data = await getDailyChallengeService(req.app.locals.db);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};
