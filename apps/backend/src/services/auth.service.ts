import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRandomNumericId } from "../utils/generateRandomNumericId.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTPEmail } from "../utils/email.js";

export class AuthService {
  static async register(
    name: string,
    username: string,
    email: string,
    password: string
  ) {
    const hashed = await bcrypt.hash(password, 10);

    const MAX_ID_RETRIES = 10;
    let publicNumericId: string;
    let attempts = 0;

    do {
      publicNumericId = generateRandomNumericId(16);
      attempts++;

      const exists = await prisma.user.findUnique({ where: { publicNumericId } });
      if (!exists) break;

      if (attempts >= MAX_ID_RETRIES) {
        throw new Error(`Failed to generate unique publicNumericId after ${MAX_ID_RETRIES} attempts`);
      }
    } while (true);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashed,
        publicNumericId,
        emailVerified: false,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        emailVerified: true,
      },
    });

    const code = generateOTP();

    await prisma.emailOTP.deleteMany({
      where: { email },
    });

    await prisma.emailOTP.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOTPEmail(email, code);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: false,
      },
      token,
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      token,
    };
  }
}
