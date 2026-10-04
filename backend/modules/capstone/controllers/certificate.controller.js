import { getPublicCertificateService, listMyCertificatesService } from "../services/certificateService.js";

const sendError = (res, err) => {
  if (!err.status) console.error("certificate error:", err);
  res.status(err.status ?? 500).json({ success: false, message: err.status ? err.message : "Something went wrong" });
};

export const getPublicCertificate = async (req, res) => {
  try {
    const data = await getPublicCertificateService(req.app.locals.db, req.params.publicId);
    // A certificate can be revoked, so caches must revalidate rather than keep
    // serving a stale "valid" answer for long.
    res.set("Cache-Control", "public, max-age=60");
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};

export const listMyCertificates = async (req, res) => {
  try {
    const data = await listMyCertificatesService(req.app.locals.db, req.user._id.toString());
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err);
  }
};
