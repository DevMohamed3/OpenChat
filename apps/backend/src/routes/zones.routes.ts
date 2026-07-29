import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { apiLimiter, uploadLimiter } from "../middlewares/rateLimit.js";
import {
  addUserToGroup,
  createGroup,
  createChannel,
  createZoneInvite,
  deleteZone,
  getZoneChannels,
  getZoneInvite,
  getZoneMembers,
  getZoneVoicePresence,
  getZones,
  joinZoneInvite,
  leaveZone,
  removeUserFromGroup,
  updateZone,
  updateZoneMemberRole,
} from "../controllers/zones.controller.js";
import { uploadFile } from "../controllers/chat.controller.js";

const router: Router = Router();

router.get("/", authMiddleware, apiLimiter, getZones);
router.get("/invites/:code", authMiddleware, apiLimiter, getZoneInvite);
router.get("/:chatPublicId/members", authMiddleware, apiLimiter, getZoneMembers);
router.get("/:chatPublicId/channels", authMiddleware, apiLimiter, getZoneChannels);
router.get("/:chatPublicId/voice-presence", authMiddleware, apiLimiter, getZoneVoicePresence);
router.post("/:chatPublicId/upload", authMiddleware, uploadLimiter, uploadFile);
router.post("/", authMiddleware, apiLimiter, createGroup);
router.post("/invites/:code/join", authMiddleware, apiLimiter, joinZoneInvite);
router.post("/:chatPublicId/channels", authMiddleware, apiLimiter, createChannel);
router.post("/:chatPublicId/invites", authMiddleware, apiLimiter, createZoneInvite);
router.post("/:chatPublicId/members", authMiddleware, apiLimiter, addUserToGroup);
router.post("/:chatPublicId/leave", authMiddleware, apiLimiter, leaveZone);
router.patch("/:chatPublicId", authMiddleware, apiLimiter, ...updateZone);
router.patch("/:chatPublicId/members/:userId/role", authMiddleware, apiLimiter, updateZoneMemberRole);
router.delete("/:chatPublicId/members/:userId", authMiddleware, apiLimiter, removeUserFromGroup);
router.delete("/:chatPublicId", authMiddleware, apiLimiter, deleteZone);


export default router
