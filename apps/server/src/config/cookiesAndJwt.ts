import { CookieOptions } from 'express';
import { SignOptions } from 'jsonwebtoken';
import { TimeInMs } from '../constants/index';

export const jwtOptions: {
  accessToken: SignOptions;
  refreshToken: SignOptions;
  emailVerification: SignOptions;
} = {
  accessToken: {
    expiresIn: '5m',
  },
  refreshToken: {
    expiresIn: '1d',
  },
  emailVerification: {
    expiresIn: '1d',
  },
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  maxAge: TimeInMs.ONE_DAY,
  secure: true,
  sameSite: 'none',
};

// Attributes must match those used when the cookie was set, or browsers may ignore the clear.
export const clearCookieOptions: CookieOptions = {
  httpOnly: cookieOptions.httpOnly,
  secure: cookieOptions.secure,
  sameSite: cookieOptions.sameSite,
};
