import { Router } from "express";
import {
  getResources,
  getResourceById,
  getResourcesByLayer,
  getResourceCounts,
  toggleSaveResource,
  getSavedResourceIds,
} from "../controllers/libraryController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

// GET /library/counts      — type breakdown for hub page cards
router.get("/counts", getResourceCounts);

// GET /library/saved-ids   — IDs of resources saved by current user
router.get("/saved-ids", authenticate, getSavedResourceIds);

// GET /library/layer/:layerId  — resources for a roadmap layer
router.get("/layer/:layerId", getResourcesByLayer);

// GET /library             — all resources, filterable
router.get("/", getResources);

// GET /library/:id         — single resource
router.get("/:id", getResourceById);

// POST /library/:id/save   — toggle save/unsave
router.post("/:id/save", authenticate, toggleSaveResource);

export default router;
