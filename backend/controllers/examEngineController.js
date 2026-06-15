import { generateAttempt, submitAttempt } from "../services/examEngineService.js";

export const generate = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const { path, layer } = req.body;

    if (!path || typeof path !== "string") {
      return res.status(400).json({ message: "path is required" });
    }
    if (!layer || typeof layer !== "string") {
      return res.status(400).json({ message: "layer is required" });
    }

    const attempt = await generateAttempt(db, userId, path, layer);
    res.json(attempt);
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ message: err.message ?? "Failed to generate exam" });
  }
};

export const submit = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const { attemptId, answers } = req.body;

    if (!attemptId || typeof attemptId !== "string") {
      return res.status(400).json({ message: "attemptId is required" });
    }
    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return res.status(400).json({ message: "answers must be an object mapping questionId to choiceIndex" });
    }

    const result = await submitAttempt(db, userId, attemptId, answers);
    res.json(result);
  } catch (err) {
    const status = err.status ?? 500;
    res.status(status).json({ message: err.message ?? "Failed to submit exam" });
  }
};
