import { describe, it, expect } from "vitest";

describe("Rate limiter middleware", () => {
  it("authLimiter should be defined", async () => {
    const { authLimiter } = await import("../src/middlewares/rateLimit.js");
    expect(authLimiter).toBeDefined();
  });

  it("strictLimiter should be defined", async () => {
    const { strictLimiter } = await import("../src/middlewares/rateLimit.js");
    expect(strictLimiter).toBeDefined();
  });

  it("searchLimiter should be defined", async () => {
    const { searchLimiter } = await import("../src/middlewares/rateLimit.js");
    expect(searchLimiter).toBeDefined();
  });
});
