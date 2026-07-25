import { describe, it, expect } from "vitest";
import { generateOTP } from "../src/utils/otp.js";

describe("generateOTP", () => {
  it("should generate a 6-digit string", () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(Number(otp)).toBeGreaterThanOrEqual(100000);
    expect(Number(otp)).toBeLessThanOrEqual(999999);
  });

  it("should generate unique OTPs", () => {
    const otps = new Set(Array.from({ length: 100 }, () => generateOTP()));
    expect(otps.size).toBe(100);
  });
});
