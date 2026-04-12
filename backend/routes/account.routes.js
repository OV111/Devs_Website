import { Router } from "express";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { verifyToken } from "../utils/jwtToken.js";

const router = Router();

router.delete("/deleteAccount", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const verifyTokenResult = verifyToken(token);
    if (!verifyTokenResult) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid Token", status: 401 });
    }

    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required", status: 400 });
    }

    const db = req.app.locals.db;
    const users = db.collection("users");
    const userStats = db.collection("usersStats");
    const follows = db.collection("follows");
    const currentUserId = new ObjectId(verifyTokenResult.id);
    const currentUser = await users.findOne({ _id: currentUserId });

    if (!currentUser) {
      return res
        .status(404)
        .json({ message: "Current user not found", status: 404 });
    }
    if (currentUser.email !== email) {
      return res.status(403).json({
        message: "Forbidden: Email does not match current user",
        status: 403,
      });
    }

    const isMatch = await bcrypt.compare(password, currentUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Incorrect password", status: 401 });
    }

    await Promise.all([
      follows.deleteMany({ followerId: currentUserId }),
      follows.deleteMany({ followingId: currentUserId }),
      userStats.deleteOne({ userId: currentUserId }),
      users.deleteOne({ _id: currentUserId }),
    ]);

    res.status(200).json({ message: "Account deleted successfully", status: 200 });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      status: 500,
      error: err.message,
    });
  }
});

export default router;
