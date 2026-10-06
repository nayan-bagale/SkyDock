import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import messages from '../constants/messages';
import { TOKENEXPIRED, UNAUTHORIED } from '../constants/status';
import { decodeToken, verifyToken } from '../utils/token';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  const accessToken = req.headers.authorization?.split(' ')[1] ?? '';

  if (refreshToken) {
    try {
      verifyToken(refreshToken, 'RefreshToken');
    } catch {
      res.clearCookie('refreshToken');
      return res.status(UNAUTHORIED).json({ message: messages.INVALID_REFRESH_TOKEN });
    }

    if (!accessToken) {
      return res.status(TOKENEXPIRED).json({ message: messages.ACCESS_TOKEN_NOT_FOUND });
    }
  } else if (!accessToken) {
    return res.status(UNAUTHORIED).json({ message: messages.UNAUTHORIED });
  }

  try {
    verifyToken(accessToken, 'AccessToken');
  } catch {
    return res.status(TOKENEXPIRED).json({ message: messages.ACCESS_TOKEN_EXPIRED });
  }

  req.userInfo = (decodeToken(accessToken) as JwtPayload).user;

  next();
}

export default authMiddleware;
