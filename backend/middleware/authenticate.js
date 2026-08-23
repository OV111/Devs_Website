// authenticate.js
import { ObjectId } from "mongodb";
import { verifyAccessToken } from "../utils/jwtToken.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  // verifyAccessToken (single source of truth, shared with the manual
  // verifyToken() calls in the controllers) also rejects a refresh token
  // presented here — refresh tokens are cookie-only and carry type:"refresh".
  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const rawId = decoded.id ?? decoded._id; // ✅ handle both old and new tokens
  if (!rawId) {
    return res.status(401).json({ message: "Invalid token payload" });
  }

  req.user = {
    ...decoded,
    _id: new ObjectId(rawId), // ✅ id → _id as ObjectId
  };
  next();
};