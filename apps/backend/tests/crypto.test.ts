import { describe, it, expect } from "vitest";
import { encryptMessage, decryptMessage } from "../src/utils/crypto.js";

describe("encrypt/decryptMessage", () => {
  it("should round-trip a message", () => {
    const original = "Hello, World!";
    const encrypted = encryptMessage(original);
    expect(encrypted).not.toBe(original);
    expect(decryptMessage(encrypted)).toBe(original);
  });

  it("should return empty string as-is", () => {
    expect(decryptMessage("")).toBe("");
    expect(encryptMessage("")).toBe("");
  });

  it("should handle legacy unencrypted messages", () => {
    expect(decryptMessage("no-colons-here")).toBe("no-colons-here");
  });

  it("should produce different ciphertext for same plaintext", () => {
    const msg = "test message";
    const enc1 = encryptMessage(msg);
    const enc2 = encryptMessage(msg);
    expect(enc1).not.toBe(enc2);
    expect(decryptMessage(enc1)).toBe(msg);
    expect(decryptMessage(enc2)).toBe(msg);
  });
});
