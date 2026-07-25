import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const CSRF_SECRET = crypto.randomBytes(32).toString("hex");

export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(token)
    .digest("hex");
  return `${token}.${signature}`;
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const token =
    req.cookies?.["csrf-token"] ||
    req.headers["x-csrf-token"] as string;

  if (!token) {
    return res.status(403).json({ message: "CSRF token missing" });
  }

  const [tokenPart, signature] = token.split(".");
  if (!tokenPart || !signature) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  const expectedSig = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(tokenPart)
    .digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return res.status(403).json({ message: "Invalid CSRF token" });
  }

  next();
}

export function issueCsrfToken(req: Request, res: Response) {
  const token = generateCsrfToken();
  res.cookie("csrf-token", token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.json({ csrfToken: token });
}
