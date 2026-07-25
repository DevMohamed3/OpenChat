import crypto from "crypto";

process.env.JWT_SECRET = "test-jwt-secret-for-testing-only";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex");
process.env.NODE_ENV = "test";
