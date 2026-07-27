import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { googleLogin } from "../controllers/googleAuth.controller.js";
import { authLimiter, strictLimiter } from "../middlewares/rateLimit.js";

const router: Router = Router();

// Login
router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
router.post("/google", authLimiter, googleLogin)

router.post("/resend-email", authMiddleware, strictLimiter, AuthController.resendEmailOTP);
router.post("/verify-email", authMiddleware, strictLimiter, AuthController.verifyEmail);

// Password reset (no auth required)
router.post("/forgot-password", strictLimiter, AuthController.forgotPassword);
router.post("/reset-password", strictLimiter, AuthController.resetPassword);

// Protected
router.get("/me", authMiddleware, AuthController.me)

// Logout
router.post("/logout", authMiddleware, AuthController.logout)

export default router;
