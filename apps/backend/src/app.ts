import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import zonesRoutes from "./routes/zones.routes.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import friendRoutes from "./routes/friend.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
import { isAllowedOrigin } from "./config/origin.js";
import webrtcRoutes from "./routes/webrtc.routes.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const app: Express = express();

app.set("trust proxy", 1);


app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.options(/.*/, cors({
  origin(origin, callback) {
    if (!origin || isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use((_req, res, next) => {
  res.setHeader(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups"
  );
  next();
});

app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// API routes

app.get('/health', (_req, res) => {
  res.status(200).send('Server is working')
})

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/friends", friendRoutes);
app.use("/chats", chatRoutes);
app.use("/zones", zonesRoutes)

app.use("/uploads", authMiddleware, express.static(uploadsDir))
app.use("/webrtc", webrtcRoutes)

// Error handler to catch all unhandled errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local') {
    console.error('[ERROR] Unhandled error:', err)
    console.error('[ERROR] Stack:', err?.stack)
  } else {
    console.error('[ERROR]', err?.message || 'Unknown error')
  }
  res.status(500).json({
    message: err?.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'local' ? { stack: err?.stack } : {})
  })
})
