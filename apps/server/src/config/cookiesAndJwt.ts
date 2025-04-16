import { CookieOptions } from "express";
import { SignOptions } from "jsonwebtoken";

export const jwtOptions: {
  accessToken: SignOptions;
  refreshToken: SignOptions;
  emailVerification: SignOptions;
} = {
  accessToken: {
    expiresIn: "15m",
  },
  refreshToken: {
    expiresIn: "7d",
  },
  emailVerification: {
    expiresIn: "1d",
  },
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  secure: true,
  sameSite: "none",
};
