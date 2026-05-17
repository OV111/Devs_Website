import { ObjectId } from "mongodb";
import { verifyToken } from "../utils/jwtToken.js";
import { deleteAccountService } from "../services/accountService.js";

export const deleteAccount = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    const verified = verifyToken(token);
    if (!verified)
      return res.status(401).json({ message: "Unauthorized: Invalid Token", status: 401 });

    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required", status: 400 });

    await deleteAccountService(
      req.app.locals.db,
      new ObjectId(verified.id),
      email,
      password,
    );

    res.status(200).json({ message: "Account deleted successfully", status: 200 });
  } catch (err) {
    res.status(err.status ?? 500).json({
      message: err.message || "Server Error",
      status: err.status ?? 500,
    });
  }
};
