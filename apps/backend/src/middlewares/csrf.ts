import { Request, Response, NextFunction } from "express"
import { isAllowedOrigin } from "../config/origin.js"

export function csrfGuard(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next()
  }

  const origin = req.headers.origin || extractOriginFromReferer(req.headers.referer)

  if (!origin) {
    return res.status(403).json({ message: "CSRF validation failed: missing origin" })
  }

  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({ message: "CSRF validation failed: origin not allowed" })
  }

  next()
}

function extractOriginFromReferer(referer?: string): string | undefined {
  if (!referer) return undefined
  try {
    const url = new URL(referer)
    return url.origin
  } catch {
    return undefined
  }
}
