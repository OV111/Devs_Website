import { Router } from "express";
import { getCategories, getUsers } from "../controllers/searchController.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Search
 *     description: Search across users and categories
 */

/**
 * @openapi
 * /search/users:
 *   get:
 *     tags: [Search]
 *     summary: Search users by name or username
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Matching users
 */

/**
 * @openapi
 * /search/categories:
 *   get:
 *     tags: [Search]
 *     summary: Search blogs by category
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching results
 */

router.get("/users", getUsers);
router.get("/categories", getCategories);

export default router;
