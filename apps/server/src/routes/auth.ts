import express from "express";
import {
  FORBIDDEN,
  INVALIDTOKEN,
  TOKENEXPIRED,
  UNAUTHORIED,
} from "../constants/status";
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from "../utils/token";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (username === "admin" && password === "admin") {
    const refreshToken = createRefreshToken(username);
    const accessToken = createAccessToken(username, refreshToken);
    res.setHeader("Authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", refreshToken, {
      // httpOnly: true,
      // secure: true,
    });
    res.json({ accessToken, refreshToken });
    return;
  }
  res.status(UNAUTHORIED).json({ message: "Invalid credentials" });
});

router.post("/refresh", (req, res) => {
  const accessToken = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken)
    return res.status(UNAUTHORIED).json("You are not authenticated!");
  try {
    verifyToken(refreshToken, "RefreshToken", "");
  } catch (e: any) {
    res.removeHeader("Authorization");
    if (e?.name === "TokenExpiredError") {
      res.status(TOKENEXPIRED).json({ message: "refresh token expired" });
    } else {
      res.status(FORBIDDEN).json({ message: e?.message });
    }
    return;
  }

  try {
    //TODO: DB Fetch Data
    const username = "admin";

    const newAccessToken = createAccessToken(username, refreshToken);
    res.setHeader("Authorization", `Bearer ${newAccessToken}`);
    res.json({ accessToken: newAccessToken, refreshToken });
  } catch (e: any) {
    console.log(e);
    res.removeHeader("Authorization");
    if (e?.name === "TokenExpiredError") {
      res.status(TOKENEXPIRED).json({ message: e?.message });
    } else {
      res.status(INVALIDTOKEN).json({ message: e?.message });
    }
    return;
  }
});

export default router;
