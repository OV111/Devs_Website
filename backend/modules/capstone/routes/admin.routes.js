import { Router } from "express";
import { authenticate } from "../../../middleware/authenticate.js";
import { requireAdmin } from "../../../middleware/requireAdmin.js";
import { validate } from "../../../middleware/validate.js";
import {
  adminListQuerySchema,
  attemptIdParamSchema,
  certificateParamSchema,
  overrideSchema,
  revokeSchema,
} from "../schemas/capstone.schemas.js";
import {
  getAttemptDetail,
  listAttempts,
  overrideAttempt,
  setCertificateRevoked,
} from "../controllers/admin.controller.js";

const router = Router();

// Every route: signed in (authenticate) AND an admin right now (requireAdmin
// re-reads the role from the database and answers 404 to everyone else).
router.use(authenticate, requireAdmin);

router.get("/attempts", validate({ query: adminListQuerySchema }), listAttempts);
router.get("/attempts/:attemptId", validate({ params: attemptIdParamSchema }), getAttemptDetail);
router.post(
  "/attempts/:attemptId/override",
  validate({ params: attemptIdParamSchema, body: overrideSchema }),
  overrideAttempt,
);
router.post(
  "/certificates/:publicId/revocation",
  validate({ params: certificateParamSchema, body: revokeSchema }),
  setCertificateRevoked,
);

export default router;
