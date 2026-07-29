import { Router } from "express"
import { getIceServers, getLiveKitToken } from "../controllers/webrtc.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router: Router = Router()

router.get("/ice", authMiddleware, getIceServers)
router.get("/token", authMiddleware, getLiveKitToken)

export default router
