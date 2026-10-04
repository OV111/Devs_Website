import {
  getAttemptDetailService,
  listAttemptsService,
  overrideAttemptService,
  setCertificateRevokedService,
} from "../services/adminService.js";

const handle = (fn) => async (req, res) => {
  try {
    res.json({ success: true, data: await fn(req) });
  } catch (err) {
    if (!err.status) console.error("capstone admin error:", err);
    res.status(err.status ?? 500).json({ success: false, message: err.status ? err.message : "Something went wrong" });
  }
};

const adminId = (req) => req.user._id.toString();

export const listAttempts = handle((req) => listAttemptsService(req.app.locals.db, req.query));
export const getAttemptDetail = handle((req) => getAttemptDetailService(req.app.locals.db, req.params.attemptId));
export const overrideAttempt = handle((req) =>
  overrideAttemptService(req.app.locals.db, adminId(req), req.params.attemptId, req.body),
);
export const setCertificateRevoked = handle((req) =>
  setCertificateRevokedService(req.app.locals.db, adminId(req), req.params.publicId, req.body),
);
