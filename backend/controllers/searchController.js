import { searchUsers, searchCategories } from "../services/searchService.js";

export const getUsers = async (req, res) => {
  try {
    const query = req.query.q?.trim() || "";
    if (!query) return res.status(200).json({ results: [] });
    const db = req.app.locals.db;
    const results = await searchUsers(db, query);
    res.status(200).json({ results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Search failed", code: 500, error: err.message });
  }
};

export const getCategories = (req, res) => {
  try {
    const query = req.query.q?.trim() || "";
    if (!query) return res.status(200).json({ results: [] });
    const results = searchCategories(query);

    res.status(200).json({ results });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Search failed", code: 500, error: err.message });
  }
};
