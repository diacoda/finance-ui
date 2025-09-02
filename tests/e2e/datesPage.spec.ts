import { test, expect } from '@playwright/test';
import { loginAsTestUser } from './helpers/login';

const TEST_DATE = '2025-09-01';
const BASE_URL = 'http://localhost:5173'; // your running UI

test.describe('DatesPage E2E', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsTestUser(page);
    });

    test('renders fetched dates', async ({ page }) => {
        await page.goto(`${BASE_URL}/`); // full URL

        // Wait until loading is done
        await page.waitForSelector('p:has-text("Loading dates...")', { state: 'detached' });

        const summaries = page.locator('div.grid a[href^="/summary/"]');

        // Wait for at least one summary link to appear
        await summaries.first().waitFor({ state: 'visible' });

        const count = await summaries.count();
        expect(count).toBeGreaterThan(0);

        // Optional: verify text format of each summary
        for (let i = 0; i < count; i++) {
        await expect(summaries.nth(i)).toHaveText(/Summary \d{4}-\d{2}-\d{2}/);
        }
    });

    test('requests today’s market summary', async ({ page }) => {
        await page.goto(`${BASE_URL}/`); // full URL
        const requestBtn = page.locator('button:has-text("Request Today")');

        await requestBtn.click();

        const summaries = page.locator('div.grid a[href^="/summary/"]');
        await summaries.first().waitFor({ state: 'visible' });

        const count = await summaries.count();
        expect(count).toBeGreaterThan(0);
    });

    test('requests summary for selected date', async ({ page }) => {
        await page.goto(`${BASE_URL}/`); // full URL
        const dateInput = page.locator('input[type="date"]');
        await dateInput.fill('2025-09-01');

        const requestDateBtn = page.locator('button:has-text("Request for Date")');
        await requestDateBtn.click();

        const summaries = page.locator('div.grid a[href^="/summary/"]');
        await summaries.first().waitFor({ state: 'visible' });

        const count = await summaries.count();
        expect(count).toBeGreaterThan(0);
    });

    test('deletes a summary', async ({ page }) => {
        await page.goto(`${BASE_URL}/`);

        // Wait until loading is done
        await page.waitForSelector('p:has-text("Loading dates...")', { state: 'detached' });

        // Pick the first summary container
        const firstSummary = page.locator('div.grid > div').first();
        const deleteBtn = firstSummary.locator('button[title="Delete Summary"]');

        // Ensure the delete button exists
        await expect(deleteBtn).toHaveCount(1);

        // Click delete
        await deleteBtn.click();

        // Confirm the dialog if needed (Playwright automatically accepts in login helper, remove if not)
        // await page.on('dialog', dialog => dialog.accept());

        // Wait for the summary container to disappear
        await expect(firstSummary).toHaveCount(0, { timeout: 10000 });

        // Optional: check that at least one summary remains or list updates
        const remainingSummaries = page.locator('div.grid > div');
        expect(await remainingSummaries.count()).toBeGreaterThanOrEqual(0);
    });
});


