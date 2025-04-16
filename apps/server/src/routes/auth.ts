import express from "express";

import authController from "../controllers/auth-controller";
import { middleware } from "../middleware";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.get("/refresh", authController.refresh);

router.get("/verify-email", authController.verifyEmail);

router.get("/send-verification-email", authController.sendVerificationEmail);

// ------------------ Update User ------------------

router.patch("/update/name", middleware, authController.updateName);

router.put("/update/password", middleware, authController.changePassword);

export default router;
