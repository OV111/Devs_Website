import { Router } from "express";
import { getCategories, getUsers } from "../controllers/searchController.js";

const router = Router();

router.get("/users", getUsers);
router.get("/categories", getCategories);

export default router;
