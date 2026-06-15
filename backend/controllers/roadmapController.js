import {
  getUserProgress,
  createUserProgress,
  updateUserProgress,
} from "../services/userProgressService.js";

export const getProgress = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const progress = await getUserProgress(db, userId);
    res.json({ progress: progress ?? null });
  } catch (err) {
    console.error("getProgress error:", err);
    res.status(500).json({ message: "Failed to fetch progress" });
  }
};

export const startPath = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const { activePath } = req.body;

    if (!activePath || typeof activePath !== "string") {
      return res.status(400).json({ message: "activePath is required" });
    }

    const existing = await getUserProgress(db, userId);
    if (existing) {
      // only update activePath — never reset progress already earned
      const updated = await updateUserProgress(db, userId, { activePath });
      return res.json({ progress: updated });
    }

    const created = await createUserProgress(db, userId, {
      activePath,
      currentLayer: 1,
      completedLayers: [],
    });
    res.status(201).json({ progress: created });
  } catch (err) {
    console.error("startPath error:", err);
    res.status(500).json({ message: "Failed to start path" });
  }
};

export const saveProgress = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user._id.toString();
    const { layerProgress, activePath, currentLayer } = req.body;

    if (!layerProgress || typeof layerProgress !== "object") {
      return res.status(400).json({ message: "layerProgress object is required" });
    }

    const completedLayers = Object.entries(layerProgress)
      .filter(([, status]) => status === "done")
      .map(([id]) => id);

    const fields = { layerProgress, completedLayers };
    if (activePath) fields.activePath = activePath;
    if (currentLayer != null) fields.currentLayer = currentLayer;

    const updated = await updateUserProgress(db, userId, fields);
    res.json({ progress: updated });
  } catch (err) {
    console.error("saveProgress error:", err);
    res.status(500).json({ message: "Failed to save progress" });
  }
};
