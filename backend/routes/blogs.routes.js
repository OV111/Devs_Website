import {
  createBlog,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  getUserBlogs,
  toggleLike,
} from "../controllers/blogController.js";
import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", getBlogs);
router.post("/", authenticate, createBlog);
router.get("/id/:id",getBlogById);
router.get("/user/:userId",getUserBlogs);
router.post("/:id/like", authenticate, toggleLike);
router.get("/:slug", getBlogBySlug);

export default router;
