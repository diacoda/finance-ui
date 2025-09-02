import { Page } from '@playwright/test';

const BASE_URL = 'http://localhost:5173'; // Update to your UI URL

export const loginAsTestUser = async (page: Page, username = 'admin', password = 'password') => {
  page.on('dialog', async (dialog) => await dialog.accept());

  await page.goto(`${BASE_URL}/login`);

  // Fill login form
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);

  // Click login and wait for redirect
  await page.click('button:has-text("Sign In")');
  await page.waitForSelector('text=Market Summaries'); // Wait until DatesPage is visible
};
