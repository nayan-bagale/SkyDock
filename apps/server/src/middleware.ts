import { NextFunction, Request, Response } from "express";
import "./config/dotenv";
import messages from "./constants/messages";
import { TOKENEXPIRED, UNAUTHORIED } from "./constants/status";
import { verifyToken } from "./utils/token";

export function middleware(req: Request, res: Response, next: NextFunction) {
  // ----------------- Refresh Token ----------------
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token is present in the cookie or not if not then return unauthorized
  if (!refreshToken) {
    return res.status(UNAUTHORIED).json({ message: messages.UNAUTHORIED });
  }

  // Verify the refresh token if it is valid or not if not then return unauthorized
  try {
    verifyToken(refreshToken, "RefreshToken", "");
  } catch (e: any) {
    res.clearCookie("refreshToken");
    return res
      .status(UNAUTHORIED)
      .json({ message: messages.INVALID_REFRESH_TOKEN });
  }

  // ----------------- Access Token -----------------
  const accessToken = req.headers.authorization;

  // Check if access token is present in the headers or not if not then return access token not found
  if (!accessToken) {
    return res
      .status(TOKENEXPIRED)
      .json({ message: messages.ACCESS_TOKEN_NOT_FOUND });
  }

  // Verify the access token if it is valid or not if not then return invalid token
  try {
    const Atoken: string = accessToken?.split(" ")[1] ?? "";
    verifyToken(Atoken, "AccessToken", refreshToken);
  } catch (e: any) {
    return res
      .status(TOKENEXPIRED)
      .json({ message: messages.ACCESS_TOKEN_EXPIRED });
  }
  next();
}
