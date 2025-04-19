import express from "express";

import authController from "../controllers/auth-controller";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/refresh", authController.refresh);

// ------------------ Verify Email ------------------
router.get("/verify-email", authController.verifyEmail);

router.get("/send-verification-email", authController.sendVerificationEmail);

// ------------------ Forgot Password ------------------

router.get("/send-otp", authController.sendOtpToEmail);

router.post("/verify-otp", authController.verifyOtpForPasswordReset);

router.post("/reset-password", authController.forgotPasswordReset);

// ------------------ Update User ------------------

router.patch("/update/name", authMiddleware, authController.updateName);

router.put("/update/password", authMiddleware, authController.changePassword);

export default router;
