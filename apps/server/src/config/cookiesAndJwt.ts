import { CookieOptions } from "express";
import { SignOptions } from "jsonwebtoken";
import { TimeInMs } from "../constants";

export const jwtOptions: {
  accessToken: SignOptions;
  refreshToken: SignOptions;
  emailVerification: SignOptions;
} = {
  accessToken: {
    expiresIn: "5m",
  },
  refreshToken: {
    expiresIn: "1d",
  },
  emailVerification: {
    expiresIn: "1d",
  },
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: TimeInMs.ONE_DAY,
  secure: true,
  sameSite: "none",
};
