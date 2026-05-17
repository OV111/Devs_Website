import { Router } from "express";
import {
  signUp,
  login,
  googleAuth,
  githubRedirect,
  githubLinkRedirect,
  githubDisconnect,
  githubCallback,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/jwtToken.js";

const router = Router();

const failedLoginByIp = new Map();
const MAX_FAILED_LOGINS = 5;

const getClientIp = (req) =>
  (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
    .toString()
    .split(",")[0]
    .trim();

router.post("/accept-cookies", (req, res) => {
  const { accepted } = req.body;
  if (accepted) {
    res.cookie("cookiesAccepted", "true", {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365 * 1000,
      path: "/",
    });
    return res.status(200).json({ message: "Cookies Accepted", code: 200 });
  }
  res.status(400).json({ message: "Bad Request" });
});

router.post("/get-started", async (req, res) => {
  try {
    const result = await signUp(req.body);
    res.status(result.status ?? result.code ?? 500).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error.", code: 500, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const ip = getClientIp(req);
    const failedCount = failedLoginByIp.get(ip) || 0;
    if (failedCount >= MAX_FAILED_LOGINS) {
      return res.status(429).json({
        message: "Too many login attempts. Please try again later.",
        code: 429,
      });
    }
    const result = await login(req.body);
    if (result.status === 200) {
      failedLoginByIp.delete(ip);
      res.cookie("session", String(result.userId), {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
        path: "/",
      });
    } else if ([401, 404].includes(result.status)) {
      failedLoginByIp.set(ip, failedCount + 1);
    }
    res.status(result.status).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error.", code: 500, error: err.message });
  }
});

router.delete("/log-out", (req, res) => {
  try {
    res.clearCookie("session", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ message: "Logged out succesfully", code: 200 });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Logout Error", code: 500, error: err.message });
  }
});

router.get("/verify-token", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const isValid = verifyToken(token);
  res.status(200).json({ valid: !!isValid });
});

router.post("/google/auth", async (req, res) => {
  try {
    const result = await googleAuth(req.body);
    res.status(result.status).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Google Authentication Error",
      code: 500,
      error: err.message,
    });
  }
});

router.get("/auth/github", githubRedirect);
router.get("/auth/github/link", githubLinkRedirect);
router.delete("/auth/github/disconnect", githubDisconnect);
router.get("/auth/github/callback", githubCallback);

export default router;
