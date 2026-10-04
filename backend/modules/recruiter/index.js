/**
 * Recruiter module: the only public entry point. `app.js` mounts this router at
 * /api/recruiter and never reaches inside the module's folders.
 */

import { Router } from "express";
import recruiterRoutes from "./routes/recruiter.routes.js";

const router = Router();
router.use("/", recruiterRoutes);

export default router;
