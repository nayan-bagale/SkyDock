import express from "express";
import messages from "../constants/messages";
import { INTERNALERROR, OK, UNAUTHORIED } from "../constants/status";
import {
  createAccessToken,
  createRefreshToken,
  verifyToken,
} from "../utils/token";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  if (username === "nvbagale@gmail.com" && password === "yadnesh") {
    const refreshToken = createRefreshToken(username);
    const accessToken = createAccessToken(username, refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
    });
    res.status(OK).json({ accessToken, user: { username } });
    return;
  }
  res.status(UNAUTHORIED).json({ message: messages.UNAUTHORIED });
});

router.get("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(OK).json({ message: messages.LOGOUT });
});

router.get("/refresh", (req, res) => {
  // ----------------- Refresh Token ----------------
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token is present in the cookie or not if not then return unauthorized
  if (!refreshToken)
    return res.status(UNAUTHORIED).json({ message: messages.UNAUTHORIED });

  // Verify the refresh token if it is valid or not if not then return unauthorized
  try {
    verifyToken(refreshToken, "RefreshToken", "");
  } catch (e: any) {
    res.clearCookie("refreshToken");
    return res
      .status(UNAUTHORIED)
      .json({ message: messages.INVALID_REFRESH_TOKEN });
  }

  // ----------------- Access Token ----------------
  // If the refresh token is valid then create a new access token and send it back to the client along with the user data
  try {
    //TODO: DB Fetch Data
    const username = "admin";

    const newAccessToken = createAccessToken(username, refreshToken);
    return res.json({ accessToken: newAccessToken, user: { username } });
  } catch (e: any) {
    console.log(e);
    res.clearCookie("refreshToken");
    return res
      .status(INTERNALERROR)
      .json({ message: messages.INTERNAL_SERVER_ERROR });
  }
});

export default router;
