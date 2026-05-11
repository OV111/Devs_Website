import {
  createBlog,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  getUserBlogs
} from "../controllers/blogController.js";
import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", getBlogs);
router.post("/", authenticate, createBlog);
router.get("/id/:id",getBlogById);
router.get("/user/:userId",getUserBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
