import {
  startAttemptService,
  getAttemptService,
  saveAttemptCodeService,
  revealHintService,
} from "../services/attemptService.js";

export const startAttempt = async (req, res) => {
  try {
    const data = await startAttemptService(
      req.app.locals.db,
      req.user._id,
      req.body?.slug,
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const getAttempt = async (req, res) => {
  try {
    const data = await getAttemptService(
      req.app.locals.db,
      req.user._id,
      req.params.id,
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const saveAttemptCode = async (req, res) => {
  try {
    const data = await saveAttemptCodeService(
      req.app.locals.db,
      req.user._id,
      req.params.id,
      req.body?.code,
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};

export const revealHint = async (req, res) => {
  try {
    const data = await revealHintService(
      req.app.locals.db,
      req.user._id,
      req.params.id,
      req.params.order,
    );
    res.json({ success: true, ...data });
  } catch (err) {
    res.status(err.status ?? 500).json({ success: false, message: err.message });
  }
};
