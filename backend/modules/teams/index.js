/**
 * Teams module: the only public entry point. `app.js` mounts this router at
 * /api/teams and never reaches inside the module's folders.
 */

import { Router } from "express";
import teamsRoutes from "./routes/teams.routes.js";

const router = Router();
router.use("/", teamsRoutes);

export default router;
