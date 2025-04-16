import { LoginResponse } from "@skydock/types/Auth";
import jwt from "jsonwebtoken";
import { jwtOptions } from "../config/cookiesAndJwt";
import "../config/dotenv";

export const createRefreshToken = (user: LoginResponse) => {
  return jwt.sign(
    { user },
    process.env.REFRESH_TOKEN_SECRET!,
    jwtOptions.refreshToken
  );
};
export const createAccessToken = (
  user: LoginResponse,
  refreshToken: string
) => {
  return jwt.sign(
    { user },
    `${process.env.ACCESS_TOKEN_SECRET!} ${refreshToken}`,
    jwtOptions.accessToken
  );
};

export const createEmailVerificationToken = (user: LoginResponse) => {
  return jwt.sign(
    { user },
    process.env.EMAIL_VERIFICATION_TOKEN_SECRET!,
    jwtOptions.emailVerification
  );
};

export const verifyToken = (
  token: string,
  type: "AccessToken" | "RefreshToken" | "EmailVerification",
  refreshToken?: string
) => {
  const tokenType = {
    RefreshToken: "REFRESH_TOKEN_SECRET",
    AccessToken: "ACCESS_TOKEN_SECRET",
    EmailVerification: "EMAIL_VERIFICATION_TOKEN_SECRET",
  };
  const SECRET = refreshToken
    ? `${process.env[tokenType[type]]!} ${refreshToken}`
    : process.env[tokenType[type]]!;
  return jwt.verify(token, SECRET);
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};
