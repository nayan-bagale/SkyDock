import { LoginBody, RegisterBody } from "@repo/types/Auth";
import express from "express";
import messages from "../constants/messages";
import { INTERNALERROR, OK, UNAUTHORIED } from "../constants/status";
import {
  createAccessToken,
  createRefreshToken,
  decodeToken,
  verifyToken,
} from "../utils/token";

import { emailValidation, passwordValidation } from "@repo/validation";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { SALT } from "../constants/constants";
import { prisma } from "../db/db";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { lastName, firstName, email, password } = req.body as RegisterBody;
  if (!lastName || !firstName || !email || !password)
    return res.status(UNAUTHORIED).json({ message: "All fields are required" });

  if (!emailValidation(email).valid) {
    return res
      .status(UNAUTHORIED)
      .json({ message: emailValidation(email).message });
  }

  const isEmailExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  console.log(isEmailExist);

  if (isEmailExist) {
    return res.status(UNAUTHORIED).json({ message: "Email already exist" });
  }

  if (!passwordValidation(password).valid) {
    return res
      .status(UNAUTHORIED)
      .json({ message: passwordValidation(password).message });
  }

  const hashedPassword = await bcrypt.hash(password, SALT);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      },
    });
  } catch (e: any) {
    console.log(e);
    return res
      .status(INTERNALERROR)
      .json({ message: messages.INTERNAL_SERVER_ERROR });
  }

  res.status(OK).json({ message: messages.USER_CREATED });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body as LoginBody;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return res.status(UNAUTHORIED).json({ message: "Email does not exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(UNAUTHORIED).json({ message: "Invalid password" });
  }

  const refreshToken = createRefreshToken({
    email: user.email,
    name: user.name,
    id: user.id,
  });
  const accessToken = createAccessToken(
    { email: user.email, name: user.name, id: user.id },
    refreshToken
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: true,
  });

  res
    .status(OK)
    .json({
      accessToken,
      user: { email: user.email, name: user.name, id: user.id },
    });
});

router.get("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.status(OK).json({ message: messages.LOGOUT });
});

router.get("/refresh", (req, res) => {
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
    console.log(e);
    res.clearCookie("refreshToken");
    return res
      .status(INTERNALERROR)
      .json({ message: messages.INTERNAL_SERVER_ERROR });
  }
});

export default router;
