import { Router } from "express";
import {
  getDefaultPostsByCategory,
  getPostsByCategory,
  createPost,
} from "../controllers/postController.js";

const router = Router();

// must be before /:categoryName to avoid "default" being caught as a category name
router.get("/categories/:categoryName/default", getDefaultPostsByCategory);
router.get("/categories/:categoryName", getPostsByCategory);
router.post("/blogs", createPost);

export default router;
