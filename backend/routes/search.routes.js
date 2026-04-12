import { Router } from "express";
import { CATEGORY_OPTIONS } from "../../constants/Categories.js";

const router = Router();

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /search/users
router.get("/users", async (req, res) => {
  try {
    const query = req.query.q?.trim() || "";
    if (!query) {
      return res.status(200).json({ results: [] });
    }
    const db = req.app.locals.db;
    const users = db.collection("users");
    const regex = new RegExp(escapeRegex(query), "i");
    const foundUsers = await users
      .find(
        {
          $or: [
            { username: { $regex: regex } },
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
          ],
        },
        { projection: { password: 0 } },
      )
      .limit(10)
      .toArray();

    const results = foundUsers.map((user) => ({
      id: user._id,
      type: "user",
      title:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
      username: user.username,
    }));

    res.status(200).json({ results });
  } catch (err) {
    res.status(500).json({ message: "Search failed", code: 500, error: err.message });
  }
});

// GET /search/categories
router.get("/categories", (req, res) => {
  try {
    const query = req.query.q?.trim() || "";
    if (!query) {
      return res.status(200).json({ results: [] });
    }

    const categories = CATEGORY_OPTIONS.filter((category) => {
      const regex = new RegExp(escapeRegex(query), "i");
      return regex.test(category.title) || regex.test(category.slug);
    }).map((category) => ({
      id: category.id,
      type: "category",
      title: category.title,
      slug: category.slug,
    }));

    res.status(200).json({ results: categories });
  } catch (err) {
    res.status(500).json({ message: "Search failed", code: 500, error: err.message });
  }
});

export default router;
