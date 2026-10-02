import express from 'express';

import authController from '../controllers/auth-controller';
import pkceController from '../controllers/pkce-controller';
import authMiddleware from '../middleware/auth-middleware';
import rateLimitMiddleware from '../middleware/rate-limit-middleware';

const router = express.Router();

router.post('/register', rateLimitMiddleware.signupLimiter, authController.register);

router.post('/login', rateLimitMiddleware.loginLimiter, authController.login);

router.post('/pkce/authorize', rateLimitMiddleware.loginLimiter, pkceController.authorize);

router.post(
  '/pkce/session',
  rateLimitMiddleware.loginLimiter,
  authMiddleware,
  pkceController.session,
);

router.post('/pkce/exchange', rateLimitMiddleware.strictLimiter, pkceController.exchange);

router.post('/pkce/refresh', rateLimitMiddleware.defaultLimiter, pkceController.refresh);

router.get('/logout', rateLimitMiddleware.defaultLimiter, authController.logout);

router.get('/refresh', rateLimitMiddleware.defaultLimiter, authController.refresh);

// ------------------ Verify Email ------------------
router.get('/verify-email', rateLimitMiddleware.defaultLimiter, authController.verifyEmail);

router.get(
  '/send-verification-email',
  rateLimitMiddleware.sendVerificationEmailLimiter,
  authController.sendVerificationEmail,
);

// ------------------ Forgot Password ------------------

router.get('/send-otp', rateLimitMiddleware.sendOTPLimiter, authController.sendOtpToEmail);

router.post(
  '/verify-otp',
  rateLimitMiddleware.verifyOTPLimiter,
  authController.verifyOtpForPasswordReset,
);

router.post(
  '/reset-password',
  rateLimitMiddleware.resetPasswordLimiter,
  authController.forgotPasswordReset,
);

// ------------------ OAuth ------------------
router.get('/google', rateLimitMiddleware.defaultLimiter, authController.OAuthGoogle);

router.get(
  '/google/callback',
  rateLimitMiddleware.defaultLimiter,
  authController.OAuthGoogleCallback,
);

// ------------------ Update User ------------------

router.patch('/update/name', authMiddleware, authController.updateName);

router.put('/update/password', authMiddleware, authController.changePassword);

router.put('/set/password', authMiddleware, authController.setPassword);

// ------------------ Get User ------------------
router.get('/user-info', authMiddleware, authController.getUser);

export default router;
