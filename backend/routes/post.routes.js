import { Router } from "express";
import {
  getDefaultPostsByCategory,
  getPostsByCategory,
  createPost,
} from "../controllers/postController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Categories
 *     description: Category pages and default posts
 */

/**
 * @openapi
 * /categories/{categoryName}/default:
 *   get:
 *     tags: [Categories]
 *     summary: Get default (seeded) posts for a category
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Default posts
 */

/**
 * @openapi
 * /categories/{categoryName}:
 *   get:
 *     tags: [Categories]
 *     summary: Get community posts for a category
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Community posts
 */

// must be before /:categoryName to avoid "default" being caught as a category name
router.get("/categories/:categoryName/default", getDefaultPostsByCategory);
router.get("/categories/:categoryName", getPostsByCategory);
router.post("/blogs", createPost);

export default router;
