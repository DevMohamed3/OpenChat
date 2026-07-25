import { describe, it, expect } from "vitest";
import { registerBodySchema, loginBodySchema } from "../src/validations/auth.validation.js";
import { createGroupBodySchema, updateZoneBodySchema } from "../src/validations/zones.validation.js";

describe("Auth validation", () => {
  it("register: accepts valid data", () => {
    expect(registerBodySchema.safeParse({
      name: "John", username: "john", email: "j@x.com", password: "Strong1Pass"
    }).success).toBe(true);
  });

  it("register: rejects weak password", () => {
    expect(registerBodySchema.safeParse({
      name: "John", username: "john", email: "j@x.com", password: "ab"
    }).success).toBe(false);
  });

  it("register: rejects extra fields", () => {
    expect(registerBodySchema.safeParse({
      name: "John", username: "john", email: "j@x.com", password: "Strong1", admin: true
    }).success).toBe(false);
  });

  it("login: accepts valid data", () => {
    expect(loginBodySchema.safeParse({
      email: "j@x.com", password: "anything"
    }).success).toBe(true);
  });
});

describe("Zone validation", () => {
  it("createGroup: rejects extra fields", () => {
    expect(createGroupBodySchema.safeParse({
      name: "Group", injected: true
    }).success).toBe(false);
  });

  it("updateZone: rejects extra fields", () => {
    expect(updateZoneBodySchema.safeParse({
      name: "Zone", injected: true
    }).success).toBe(false);
  });
});
