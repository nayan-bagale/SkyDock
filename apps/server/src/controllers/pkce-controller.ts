import {
  LoginResponse,
  PKCEExchangeBody,
  PKCELoginBody,
  PKCERefreshBody,
  PKCESessionBody,
} from "@skydock/types/Auth";
import { emailValidation } from "@skydock/validation";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config/db";
import { ACCESS_TOKEN_EXPIRES_IN_SECONDS } from "../constants";
import messages from "../constants/messages";
import {
  BADREQUEST,
  INTERNALERROR,
  OK,
  UNAUTHORIED,
} from "../constants/status";
import logger from "../logger";
import pkceService from "../services/pkce";
import {
  createAccessToken,
  createRefreshToken,
  decodeToken,
  verifyToken,
} from "../utils/token";

class PkceController {
  private static instance: PkceController;

  public static getInstance(): PkceController {
    if (!PkceController.instance) {
      PkceController.instance = new PkceController();
    }
    return PkceController.instance;
  }

  /**
   * PKCE step 1: validate email/password (same rules as POST /auth/login), then issue a
   * short-lived authorization code bound to the client's S256 code_challenge.
   * Does not set cookies; public clients complete login via POST /pkce/exchange.
   */
  async authorize(req: Request, res: Response) {
    const { email, password, code_challenge, code_challenge_method } =
      req.body as PKCELoginBody;

    if (!email || !password || !code_challenge) {
      return res
        .status(UNAUTHORIED)
        .json({ message: "All fields are required" });
    }

    if (!pkceService.assertChallengeMethod(code_challenge_method)) {
      return res
        .status(BADREQUEST)
        .json({ message: "code_challenge_method must be S256" });
    }

    if (!emailValidation(email).valid) {
      return res
        .status(UNAUTHORIED)
        .json({ message: emailValidation(email).message });
    }

    let user;

    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (e) {
      logger.error("Error while checking email existence", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    if (!user) {
      return res.status(UNAUTHORIED).json({ message: "Email does not exist" });
    }

    if (!user.verified) {
      return res
        .status(UNAUTHORIED)
        .json({ message: "Account is not activated", verifyEmail: true });
    }

    if (!user.password) {
      return res
        .status(UNAUTHORIED)
        .json({ message: "Please sign in with google" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(UNAUTHORIED).json({ message: "Invalid password" });
    }

    try {
      const { code, expiresIn } = await pkceService.createAuthorizationCode({
        userId: user.id,
        codeChallenge: code_challenge,
      });

      return res.status(OK).json({ code, expires_in: expiresIn });
    } catch (e) {
      logger.error("Error while creating authorization code", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  /**
   * Issue a one-time code for the browser session already authenticated by auth middleware.
   * Used when the website login page hands the user back to the desktop app.
   */
  async session(req: Request, res: Response) {
    const { code_challenge, code_challenge_method } = req.body as PKCESessionBody;
    const userId = req.userInfo?.id;

    if (!userId) {
      return res.status(UNAUTHORIED).json({ message: messages.UNAUTHORIED });
    }

    if (!code_challenge) {
      return res.status(BADREQUEST).json({ message: "code_challenge is required" });
    }

    if (!pkceService.assertChallengeMethod(code_challenge_method)) {
      return res
        .status(BADREQUEST)
        .json({ message: "code_challenge_method must be S256" });
    }

    try {
      const { code, expiresIn } = await pkceService.createAuthorizationCode({
        userId,
        codeChallenge: code_challenge,
      });

      return res.status(OK).json({ code, expires_in: expiresIn });
    } catch (e) {
      logger.error("Error while creating authorization code from session", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  /**
   * PKCE step 2: exchange one-time code + code_verifier for access and refresh JWTs.
   * redirect_uri is only enforced when the stored code row has a redirectUri (future OAuth flow).
   */
  async exchange(req: Request, res: Response) {
    const { code, code_verifier, redirect_uri } = req.body as PKCEExchangeBody;

    if (!code || !code_verifier) {
      return res
        .status(BADREQUEST)
        .json({ message: "code and code_verifier are required" });
    }

    const consumed = await pkceService.consumeAuthorizationCode(
      code,
      code_verifier,
      redirect_uri,
    );

    if (!consumed) {
      return res
        .status(UNAUTHORIED)
        .json({ message: "Invalid or expired authorization code" });
    }

    const userResObj: LoginResponse = { id: consumed.userId };
    const refreshToken = createRefreshToken(userResObj);
    const accessToken = createAccessToken(userResObj, refreshToken);

    return res.status(OK).json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    });
  }

  /**
   * Issue a new access JWT for PKCE clients that store refresh_token locally (not the cookie
   * on GET /auth/refresh). The refresh token string is not rotated.
   */
  async refresh(req: Request, res: Response) {
    const { refresh_token } = req.body as PKCERefreshBody;

    if (!refresh_token) {
      return res
        .status(BADREQUEST)
        .json({ message: "refresh_token is required" });
    }

    try {
      verifyToken(refresh_token, "RefreshToken", "");
    } catch {
      return res
        .status(UNAUTHORIED)
        .json({ message: messages.INVALID_REFRESH_TOKEN });
    }

    try {
      const decoded = decodeToken(refresh_token) as JwtPayload;
      const user = decoded.user as LoginResponse;
      const accessToken = createAccessToken(user, refresh_token);

      return res.status(OK).json({
        access_token: accessToken,
        refresh_token: refresh_token,
        token_type: "Bearer",
        expires_in: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      });
    } catch (e) {
      logger.error("Error while refreshing PKCE token", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }
}

export default PkceController.getInstance();
