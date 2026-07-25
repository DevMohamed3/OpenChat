import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/ZeroZone/i);
});

test("auth page loads", async ({ page }) => {
  await page.goto("/auth");
  await page.waitForLoadState("networkidle");
  const content = await page.content();
  expect(content.length).toBeGreaterThan(0);
});

test("health endpoint returns OK", async ({ request }) => {
  const response = await request.get("http://localhost:4000/health");
  expect(response.ok()).toBeTruthy();
});
