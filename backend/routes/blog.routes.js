import { createBlog, getBlogBySlug, getBlogs } from "../controllers/blogController.js";
import {Router} from "express";

const router = Router();

router.get("/",getBlogs);
router.post("/",createBlog)
router.get("/:slug",getBlogBySlug);

export default router;