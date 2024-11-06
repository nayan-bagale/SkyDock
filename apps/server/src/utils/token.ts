import { LoginResponse } from "@repo/types/Auth";
import jwt from "jsonwebtoken";
import "../config/dotenv";

export const createRefreshToken = (user: LoginResponse) => {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
export const createAccessToken = (
  user: LoginResponse,
  refreshToken: string
) => {
  return jwt.sign(
    { user },
    `${process.env.ACCESS_TOKEN_SECRET!} ${refreshToken}`,
    {
      expiresIn: "15m",
    }
  );
};

export const verifyToken = (
  token: string,
  type: "AccessToken" | "RefreshToken",
  refreshToken: string
) => {
  const tokenType = {
    RefreshToken: "REFRESH_TOKEN_SECRET",
    AccessToken: "ACCESS_TOKEN_SECRET",
  };
  const SECRET = refreshToken
    ? `${process.env[tokenType[type]]!} ${refreshToken}`
    : process.env[tokenType[type]]!;
  return jwt.verify(token, SECRET);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
