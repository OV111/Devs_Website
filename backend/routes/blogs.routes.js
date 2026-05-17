import {
  createBlog,
  getBlogById,
  getBlogBySlug,
  getBlogs,
  getUserBlogs,
  toggleLike,
  toggleFavourite,
  getFavourites,
  getSavedIds,
} from "../controllers/blogController.js";
import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Blogs
 *     description: Blog posts management
 */

/**
 * @openapi
 * /blogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Get paginated list of published blogs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blogs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *   post:
 *     tags: [Blogs]
 *     summary: Create a new blog post (multipart/form-data)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, category]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               tags:
 *                 type: string
 *                 description: JSON array string e.g. '["React","Node.js"]'
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /blogs/favourites:
 *   get:
 *     tags: [Blogs]
 *     summary: Get current user's saved blogs
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 */

/**
 * @openapi
 * /blogs/saved-ids:
 *   get:
 *     tags: [Blogs]
 *     summary: Get IDs of blogs saved by current user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of saved blog ID strings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 ids:
 *                   type: array
 *                   items:
 *                     type: string
 */

/**
 * @openapi
 * /blogs/id/{id}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get a blog by MongoDB ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Not found
 */

/**
 * @openapi
 * /blogs/user/{userId}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get all published blogs by a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of blogs
 */

/**
 * @openapi
 * /blogs/{id}/like:
 *   post:
 *     tags: [Blogs]
 *     summary: Toggle like on a blog
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 liked:
 *                   type: boolean
 *                 likesCount:
 *                   type: number
 */

/**
 * @openapi
 * /blogs/{id}/favourite:
 *   post:
 *     tags: [Blogs]
 *     summary: Toggle save/unsave a blog
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favourite toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 saved:
 *                   type: boolean
 */

/**
 * @openapi
 * /blogs/{slug}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get a blog by slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog document
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Not found
 */

router.get("/", getBlogs);
router.post("/", authenticate, createBlog);
router.get("/favourites", authenticate, getFavourites);
router.get("/saved-ids", authenticate, getSavedIds);
router.get("/id/:id", getBlogById);
router.get("/user/:userId", getUserBlogs);
router.post("/:id/like", authenticate, toggleLike);
router.post("/:id/favourite", authenticate, toggleFavourite);
router.get("/:slug", getBlogBySlug);

export default router;
