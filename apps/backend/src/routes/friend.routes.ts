import { Router } from "express";
import { friendController } from "../controllers/friend.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireVerified } from "../middlewares/requireVerified.js";
import { searchLimiter, apiLimiter } from "../middlewares/rateLimit.js";

const router: Router = Router();

// Protected routes
router.get("/search", authMiddleware, searchLimiter, friendController.searchUser);
router.get("/pending", authMiddleware, apiLimiter, friendController.pending);
router.get("/requests", authMiddleware, apiLimiter, friendController.getRequests);
router.get("/list", authMiddleware, apiLimiter, friendController.getFriends);
router.get("/blocked", authMiddleware, apiLimiter, friendController.getBlockedUsers);
router.post("/request/", authMiddleware, requireVerified, apiLimiter, friendController.sendRequest);
router.post("/accept/:id", authMiddleware, apiLimiter, friendController.acceptRequest);
router.post("/block/:userId", authMiddleware, apiLimiter, friendController.blockUser);
router.delete("/:userId", authMiddleware, apiLimiter, friendController.removeFriend);
router.delete("/block/:userId", authMiddleware, apiLimiter, friendController.unblockUser);
router.delete("/reject/:id", authMiddleware, apiLimiter, friendController.rejectRequest);

export default router;
