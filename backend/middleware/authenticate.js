// authenticate.js
import jwt from "jsonwebtoken";
import process from "node:process";
import { ObjectId } from "mongodb";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_Secret); // ✅ same casing as createToken
    
    const rawId = decoded.id ?? decoded._id; // ✅ handle both old and new tokens
    if (!rawId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      ...decoded,
      _id: new ObjectId(rawId), // ✅ id → _id as ObjectId
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};