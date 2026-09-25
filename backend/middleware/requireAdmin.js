import { ObjectId } from "mongodb";

/**
 * Gate for admin-only routes. Always runs *after* `authenticate`, which has
 * already proven who the caller is — this only answers "may they".
 *
 * The role is read from the database on every request rather than trusted from
 * the JWT. Access tokens live 15 minutes, so a role baked into the token would
 * keep working for that long after an admin is demoted. A revoked admin should
 * stop being an admin immediately.
 *
 * A missing `role` field means "user" — existing accounts predate this field
 * and must not be silently promoted.
 */
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await req.app.locals.db
      .collection("users")
      .findOne(
        { _id: new ObjectId(req.user._id) },
        { projection: { role: 1 } },
      );

    if (user?.role !== "admin") {
      // 404, not 403: an admin surface shouldn't confirm its own existence to
      // someone who isn't allowed to use it.
      return res.status(404).json({ success: false, message: "Not found" });
    }

    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
