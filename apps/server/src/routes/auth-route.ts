import express from "express";

import authController from "../controllers/auth-controller";
import authMiddleware from "../middleware/auth-middleware";
import rateLimitMiddleware from "../middleware/rate-limit-middleware";

const router = express.Router();

router.post(
  "/register",
  rateLimitMiddleware.signupLimiter,
  authController.register
);

router.post("/login", rateLimitMiddleware.loginLimiter, authController.login);

router.get(
  "/logout",
  rateLimitMiddleware.defaultLimiter,
  authController.logout
);

router.get(
  "/refresh",
  rateLimitMiddleware.defaultLimiter,
  authController.refresh
);

// ------------------ Verify Email ------------------
router.get(
  "/verify-email",
  rateLimitMiddleware.defaultLimiter,
  authController.verifyEmail
);

router.get(
  "/send-verification-email",
  rateLimitMiddleware.sendVerificationEmailLimiter,
  authController.sendVerificationEmail
);

// ------------------ Forgot Password ------------------

router.get(
  "/send-otp",
  rateLimitMiddleware.sendOTPLimiter,
  authController.sendOtpToEmail
);

router.post(
  "/verify-otp",
  rateLimitMiddleware.verifyOTPLimiter,
  authController.verifyOtpForPasswordReset
);

router.post(
  "/reset-password",
  rateLimitMiddleware.resetPasswordLimiter,
  authController.forgotPasswordReset
);

// ------------------ Update User ------------------

router.patch("/update/name", authMiddleware, authController.updateName);

router.put("/update/password", authMiddleware, authController.changePassword);

export default router;
