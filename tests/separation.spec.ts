import { expect, test } from '@playwright/test';
import pages from '../apps/web/page-metadata.json' with { type: 'json' };

test('portfolio has no docs links or reader routes', async ({ page, request }) => {
  for (const route of ['/docs/', '/docs/customize/']) {
    expect((await request.get(route)).status()).toBe(404);
  }
  for (const route of Object.keys(pages)) {
    await page.goto(route);
    await expect(page.locator('a[href*="/docs/"], a[href*="4322"], a[data-stats-target="docs"], [data-analytics-related-origin]')).toHaveCount(0);
  }
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open menu' });
  if (await toggle.isVisible()) {
    await toggle.click();
    await expect(page.getByRole('dialog').getByRole('link')).toHaveText(['Home', 'Work', 'Code', 'About']);
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
  }
});

test('navigation without JavaScript exposes the retained portfolio routes', async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: info.project.use.viewport });
  const page = await context.newPage();
  try {
    await page.goto('/');
    const nav = page.locator('.desktop-nav');
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link')).toHaveText(['Home', 'Work', 'Code', 'About']);
    await expect(page.locator('a[href*="/docs/"], a[href*="4322"]')).toHaveCount(0);
    await page.screenshot({ path: info.outputPath('no-js-navigation.png'), fullPage: true });
    await nav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about\/$/);
  } finally { await context.close(); }
});
