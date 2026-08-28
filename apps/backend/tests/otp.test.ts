import { describe, it, expect } from "vitest";
import { generateOTP } from "../src/utils/otp.js";

describe("generateOTP", () => {
  const OTP_SPACE = 900_000; // randomInt(100000, 999999)

  it("should generate a 6-digit string", () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(Number(otp)).toBeGreaterThanOrEqual(100000);
    expect(Number(otp)).toBeLessThanOrEqual(999999);
  });

  it("should always produce valid 6-digit codes in bulk", () => {
    const otps = Array.from({ length: 1000 }, () => generateOTP());
    for (const otp of otps) {
      expect(otp).toMatch(/^\d{6}$/);
    }
  });

  // Independent random draws collide occasionally (birthday paradox) — that is
  // correct behavior for an OTP, so assert the distribution is healthy instead
  // of exact uniqueness. Expected distinct values for n=1000 draws from a
  // 900k space is ~999.4; anything below 990 would indicate a broken RNG.
  it("should be well-distributed (near-zero collisions)", () => {
    const draws = 1000;
    const otps = new Set(Array.from({ length: draws }, () => generateOTP()));
    expect(otps.size).toBeGreaterThanOrEqual(draws * 0.99);
  });
});
