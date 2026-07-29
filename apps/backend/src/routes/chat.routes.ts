import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter, uploadLimiter } from "../middlewares/rateLimit.js";
import {
  getChatMessages,
  getChats,
  getChat,
  startChat,
  editMessage,
  deleteMessage,
  togglePinMessage,
  uploadFile,
} from "../controllers/chat.controller.js";

const router: Router = Router();

router.get("/", authMiddleware, apiLimiter, getChats)
router.get("/:chatPublicId", authMiddleware, apiLimiter, getChat)
router.post("/start", authMiddleware, apiLimiter, startChat)

router.get(
  "/:chatPublicId/messages",
  authMiddleware,
  apiLimiter,
  getChatMessages
)

router.post(
  "/:chatPublicId/upload",
  authMiddleware,
  uploadLimiter,
  uploadFile
)

router.patch("/messages/:id", authMiddleware, apiLimiter, editMessage)
router.patch("/messages/:id/pin", authMiddleware, apiLimiter, togglePinMessage)

router.delete("/messages/:id", authMiddleware, apiLimiter, deleteMessage)

export default router;
