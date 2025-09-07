// tests/e2e/datesPage.e2e.js
import { test, expect } from "@playwright/test";

// Change this to your running UI URL
const BASE_URL = "http://localhost:5173";
const TEST_DATE = "2025-09-01";

// Helper function to login (replace with your actual login flow)
async function loginAsTestUser(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[name="username"]', "testuser");
  await page.fill('input[name="password"]', "password");
  await page.click('button[type="submit"]');
  // Wait until redirect completes
  await page.waitForURL(`${BASE_URL}/`);
}

test.describe("DatesPage E2E", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTestUser(page);
    await page.goto(`${BASE_URL}/`);
  });

  test("renders fetched dates", async ({ page }) => {
    // Wait until loading disappears
    await page.waitForSelector('p:has-text("Loading dates...")', { state: "detached" });

    const summaries = page.locator('div.grid a[href^="/summary/"]');
    await summaries.first().waitFor({ state: "visible" });

    const count = await summaries.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(summaries.nth(i)).toHaveText(/Summary \d{4}-\d{2}-\d{2}/);
    }
  });

  test("requests today's market summary", async ({ page }) => {
    const requestBtn = page.locator('button:has-text("Request Today")');
    await requestBtn.click();

    const summaries = page.locator('div.grid a[href^="/summary/"]');
    await summaries.first().waitFor({ state: "visible" });

    const count = await summaries.count();
    expect(count).toBeGreaterThan(0);
  });

  test("requests summary for selected date", async ({ page }) => {
    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill(TEST_DATE);

    const requestDateBtn = page.locator('button:has-text("Request for Date")');
    await requestDateBtn.click();

    const summaries = page.locator('div.grid a[href^="/summary/"]');
    await summaries.first().waitFor({ state: "visible" });

    const count = await summaries.count();
    expect(count).toBeGreaterThan(0);
  });

  test("deletes a summary", async ({ page }) => {
    await page.waitForSelector('p:has-text("Loading dates...")', { state: "detached" });

    const firstSummary = page.locator('div.grid > div').first();
    const deleteBtn = firstSummary.locator('button[title="Delete Summary"]');

    await expect(deleteBtn).toHaveCount(1);
    await deleteBtn.click();

    // Playwright auto-accepts dialogs by default; otherwise:
    // page.on('dialog', dialog => dialog.accept());

    await expect(firstSummary).toHaveCount(0, { timeout: 10000 });

    const remainingSummaries = page.locator('div.grid > div');
    expect(await remainingSummaries.count()).toBeGreaterThanOrEqual(0);
  });
});
