import {
  createBlog,
  getBlogBySlug,
  getBlogs,
} from "../controllers/blogController.js";
import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", getBlogs);
router.post("/", authenticate, createBlog);

router.get("/:slug", getBlogBySlug);

export default router;
