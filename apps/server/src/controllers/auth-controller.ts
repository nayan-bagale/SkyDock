import { User } from "@skydock/db";
import { LoginBody, RegisterBody } from "@skydock/types/Auth";
import { emailValidation, passwordValidation } from "@skydock/validation";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { cookieOptions } from "../config/cookiesAndJwt";
import { prisma } from "../config/db";
import { SALT } from "../constants/constants";
import messages from "../constants/messages";
import {
  BADREQUEST,
  INTERNALERROR,
  NOTFOUND,
  OK,
  UNAUTHORIED,
  UNPROCESSABLE_ENTITY,
} from "../constants/status";
import logger from "../logger";
import Email from "../services/email";
import { emailVerifyUrlGenerator } from "../services/emailVerifyTokenGenerator";
import {
  createAccessToken,
  createRefreshToken,
  decodeToken,
  verifyToken,
} from "../utils/token";

import cache from "../utils/inMemoryStore";
import otpGenerate from "../utils/otp-generator";

class AuthController {
  private static instance: AuthController;

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  async register(req: Request, res: Response) {
    const { lastName, firstName, email, password } = req.body as RegisterBody;
    if (!lastName || !firstName || !email || !password)
      return res
        .status(UNAUTHORIED)
        .json({ message: "All fields are required" });

    if (!emailValidation(email).valid) {
      return res
        .status(UNAUTHORIED)
        .json({ message: emailValidation(email).message });
    }

    try {
      const isEmailExist = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (isEmailExist) {
        return res.status(UNAUTHORIED).json({ message: "Email already exist" });
      }
    } catch (e: any) {
      logger.error("Error while checking email existence", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    if (!passwordValidation(password).valid) {
      return res
        .status(UNAUTHORIED)
        .json({ message: passwordValidation(password).message });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: `${firstName} ${lastName}`,
        },
      });
      Email.sendThankYouForRegisteringEmail(
        email,
        emailVerifyUrlGenerator({
          id: user.id,
          email: user.email,
          name: user.name,
        })
      );
      return res.status(OK).json({ message: messages.USER_CREATED });
    } catch (e: any) {
      logger.error("Error while creating user", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginBody;

    if (!email || !password)
      return res
        .status(UNAUTHORIED)
        .json({ message: "All fields are required" });
    if (!emailValidation(email).valid) {
      return res
        .status(UNAUTHORIED)
        .json({ message: emailValidation(email).message });
    }

    let user;

    try {
      user = await prisma.user.findUnique({
        where: {
          email: email,
        },
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(UNAUTHORIED).json({ message: "Invalid password" });
    }

    const UserResObj = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    const refreshToken = createRefreshToken(UserResObj);
    const accessToken = createAccessToken(UserResObj, refreshToken);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(OK).json({
      accessToken,
      user: UserResObj,
    });
  }

  async refresh(req: Request, res: Response) {
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
      const decoded = decodeToken(refreshToken) as JwtPayload;
      const newAccessToken = createAccessToken(decoded.user, refreshToken);
      return res.json({ accessToken: newAccessToken, user: decoded.user });
    } catch (e: any) {
      res.clearCookie("refreshToken");
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("refreshToken");
    res.status(OK).json({ message: messages.LOGOUT });
  }

  async updateName(req: Request, res: Response) {
    const { fname, lname } = req.body;
    const userId = req.user?.id as string;
    if (!fname || !lname) {
      return res
        .status(BADREQUEST)
        .json({ message: "All fields are required" });
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: `${fname} ${lname}`,
        },
      });
      res.status(OK).json({ message: "Successfully updated name" });
    } catch (e: any) {
      logger.error("Error while updating name", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id as string;
    if (!oldPassword || !newPassword)
      return res
        .status(BADREQUEST)
        .json({ message: "All fields are required" });

    if (!passwordValidation(newPassword).valid) {
      return res
        .status(BADREQUEST)
        .json({ message: passwordValidation(newPassword).message });
    }
    let user;

    try {
      user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      logger.error("Error while checking email existence", error);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    if (!user) {
      return res.status(BADREQUEST).json({ message: "User does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(BADREQUEST).json({ message: "Invalid password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, SALT);
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
      res.status(OK).json({ message: "Successfully updated password" });
    } catch (e: any) {
      logger.error("Error while updating password", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    const token = req.query.token as string;

    if (!token) {
      return res.status(UNAUTHORIED).json({ message: "Invalid token" });
    }

    try {
      verifyToken(token, "EmailVerification");
    } catch (e: any) {
      return res
        .status(UNAUTHORIED)
        .json({ message: messages.INVALID_ACCESS_TOKEN });
    }

    const decoded = decodeToken(token) as JwtPayload;

    try {
      const isEmailVerified = await prisma.user.findUnique({
        where: {
          id: decoded.user.id,
        },
      });

      if (isEmailVerified?.verified) {
        return res
          .status(UNAUTHORIED)
          .json({ message: "Email already verified" });
      }

      await prisma.user.update({
        where: { id: decoded.user.id },
        data: { verified: true },
      });
      res.status(OK).json({ message: "Email verified successfully" });
    } catch (e: any) {
      logger.error("Error while verifying email", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }

  async sendVerificationEmail(req: Request, res: Response) {
    const email = req.query.email as string;
    if (!email) {
      return res.status(UNAUTHORIED).json({ message: "Invalid email" });
    }
    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (e: any) {
      logger.error("Error while checking email existence", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    if (!user) {
      return res.status(UNAUTHORIED).json({ message: "User does not exist" });
    }
    if (user.verified) {
      return res
        .status(UNAUTHORIED)
        .json({ message: "Email already verified" });
    }

    try {
      Email.sendThankYouForRegisteringEmail(
        email,
        emailVerifyUrlGenerator({
          id: user.id,
          email: user.email,
          name: user.name,
        })
      );
    } catch (e: any) {
      logger.error("Error while sending verification email", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    res.status(OK).json({ message: "Verification email sent" });
  }

  async sendOtpToEmail(req: Request, res: Response) {
    const email = req.query.email as string;
    if (!email) {
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: "Invalid email" });
    }

    let user: User | null;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (e: any) {
      logger.error("Error while checking email existence", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    if (!user) {
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: "Email does not exist" });
    }

    let message = "OTP sent to your email";

    if (cache.has(email)) {
      message = "OTP resent to your email";
    }

    const otp = otpGenerate();
    cache.set(email, otp);
    try {
      Email.sendPasswordResetOTP(email, otp);
    } catch (e: any) {
      logger.error("Error while sending OTP", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
    res.status(OK).json({ message });
  }

  async verifyOtpForPasswordReset(req: Request, res: Response) {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(NOTFOUND).json({ message: "Invalid email or otp" });
    }

    const CachedOTP = cache.get<string>(email);

    if (!CachedOTP) {
      return res.status(UNPROCESSABLE_ENTITY).json({ message: "OTP expired" });
    }
    if (CachedOTP !== otp) {
      return res.status(NOTFOUND).json({ message: "Invalid otp" });
    }

    cache.del(email);

    cache.set(email, true);

    res.status(OK).json({ message: "Otp verified" });
  }

  async forgotPasswordReset(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: "All fields are required" });

    if (!emailValidation(email).valid) {
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: emailValidation(email).message });
    }

    if (!cache.get(email)) {
      return res.status(BADREQUEST).json({ message: "Bad Request" });
    }

    cache.del(email);

    if (!passwordValidation(password).valid) {
      return res
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: passwordValidation(password).message });
    }

    let user;
    try {
      user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (e: any) {
      logger.error("Error while checking email existence", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }

    if (!user) {
      return res.status(NOTFOUND).json({ message: "User does not exist" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
      res.status(OK).json({ message: "Password reset successfully" });
    } catch (e: any) {
      logger.error("Error while updating password", e);
      return res
        .status(INTERNALERROR)
        .json({ message: messages.INTERNAL_SERVER_ERROR });
    }
  }
}

export default AuthController.getInstance();
