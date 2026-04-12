import { Router } from "express";
import { verifyToken } from "../utils/jwtToken.js";

const router = Router();

// Must be before /categories/:categoryName to avoid :categoryName catching "default"
router.get("/categories/:categoryName/default", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const posts = await db.collection("posts-default")
      .find({ category: req.params.categoryName })
      .toArray();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error!", code: 500 });
  }
});

router.get("/categories/:categoryName", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const posts = await db.collection("posts")
      .find({ category: req.params.categoryName })
      .toArray();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server Error!", code: 500 });
  }
});

router.post("/blogs", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!verifyToken(token)) {
      return res.status(401).json({ message: "Unauthorized", code: 401 });
    }
    const db = req.app.locals.db;
    const { title, text, category, file } = req.body;
    const blogs = db.collection("blogs");
    await blogs.insertOne({ title, text, category, file });
    res.status(201).json({ code: 201, message: "Created Blog" });
  } catch (err) {
    res.status(500).json({ message: "Server Error.", code: 500, error: err.message });
  }
});

export default router;
