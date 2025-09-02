import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',   // <-- only look here
    timeout: 30_000,
    retries: 1,
    use: {
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on-first-retry',
    },
});
