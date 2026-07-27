import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { uploadsDir } from "../config/uploads.js";

const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const MAGIC_BYTES: Record<string, Buffer[]> = {
  "image/jpeg": [Buffer.from([0xff, 0xd8, 0xff])],
  "image/png": [Buffer.from([0x89, 0x50, 0x4e, 0x47])],
  "image/gif": [Buffer.from("GIF87a"), Buffer.from("GIF89a")],
  "image/webp": [Buffer.from("RIFF")],
};

function validateFileBuffer(buffer: Buffer, mimetype: string): boolean {
  const expectedSignatures = MAGIC_BYTES[mimetype];
  if (!expectedSignatures) return false;
  return expectedSignatures.some((sig) => buffer.subarray(0, sig.length).equals(sig));
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!ALLOWED_MIMES.has(file.mimetype)) {
      cb(new Error("Only images allowed"));
      return;
    }
    cb(null, true);
  },
});

export function validateFileMagicBytes(
  req: any,
  res: any,
  next: any
) {
  const file = req.file;
  if (!file) return next();

  const buffer = Buffer.alloc(16);
  const fd = fs.openSync(file.path, "r");
  fs.readSync(fd, buffer, 0, 16, 0);
  fs.closeSync(fd);

  if (!validateFileBuffer(buffer, file.mimetype)) {
    fs.unlinkSync(file.path);
    req.file = undefined;
    return res.status(400).json({ message: "Invalid file content" });
  }

  next();
}
