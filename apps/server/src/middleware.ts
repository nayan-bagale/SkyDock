import { NextFunction, Request, Response } from "express";
import "./config/dotenv";
import { FORBIDDEN, TOKENEXPIRED, UNAUTHORIED } from "./constants/status";
import { verifyToken } from "./utils/token";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const accessToken = req.headers["authorization"];
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.status(UNAUTHORIED).json({ message: "Unauthorized" });
  }
  try {
    verifyToken(refreshToken, "RefreshToken", "");
  } catch (e: any) {
    res.removeHeader("Authorization");
    if (e?.name === "TokenExpiredError") {
      res.status(TOKENEXPIRED).json({ message: "refresh token expired" });
    } else {
      res.status(FORBIDDEN).json({ message: e?.message });
    }
  }

  const Atoken: any = accessToken.split(" ")[1];

  try {
    verifyToken(Atoken, "AccessToken", refreshToken);
  } catch (e: any) {
    res.removeHeader("Authorization");
    if (e?.name === "TokenExpiredError") {
      res.status(TOKENEXPIRED).json({ message: e?.message });
    } else {
      res.status(FORBIDDEN).json({ message: e?.message });
    }
  }

  next();
}
