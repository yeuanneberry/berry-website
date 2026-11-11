import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('CSP permits the early controller without reader style exceptions', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const navigation = await readFile('apps/web/src/scripts/navigation.js', 'utf8');
  const hash = (text: string) => `sha256-${createHash('sha256').update(text).digest('base64')}`;
  for (const route of ['/', '/about/', '/work/softlysang/', '/code/']) {
    await page.goto(route);
    const policy = await page.locator('meta[http-equiv="content-security-policy"]').getAttribute('content');
    expect(policy).toContain(hash(navigation));
    expect(policy).not.toMatch(/'unsafe-inline'|'unsafe-eval'|'unsafe-hashes'/);
    expect(policy).toContain("script-src-attr 'none'");
    expect(policy).toContain("style-src-attr 'none'");
    expect(policy).not.toContain('cloudflareinsights.com');
  }
  expect(errors).toEqual([]);
});
