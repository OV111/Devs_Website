import { verifyToken } from "../utils/jwtToken.js";
import {
  getDefaultPostsByCategoryService,
  getPostsByCategoryService,
  createPostService,
} from "../services/postService.js";

export const getDefaultPostsByCategory = async (req, res) => {
  try {
    const posts = await getDefaultPostsByCategoryService(
      req.app.locals.db,
      req.params.categoryName,
    );
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: "Server Error!", code: 500 });
  }
};

export const getPostsByCategory = async (req, res) => {
  try {
    const posts = await getPostsByCategoryService(
      req.app.locals.db,
      req.params.categoryName,
    );
    res.status(200).json(posts);
  } catch {
    res.status(500).json({ message: "Server Error!", code: 500 });
  }
};

export const createPost = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!verifyToken(token))
      return res.status(401).json({ message: "Unauthorized", code: 401 });

    await createPostService(req.app.locals.db, req.body);
    res.status(201).json({ code: 201, message: "Created Blog" });
  } catch (err) {
    res.status(500).json({ message: "Server Error.", code: 500, error: err.message });
  }
};
