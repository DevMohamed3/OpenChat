import jwt from "jsonwebtoken";

export function createTestToken(userId: number = 1): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
}

export function createTestCookie(userId: number = 1): string {
  return `token=${createTestToken(userId)}`;
}
