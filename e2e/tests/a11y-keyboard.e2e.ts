import { test, expect } from '@playwright/test';

test('@a11y — Tab으로 NavBar 순회', async ({ page }) => {
  await page.goto('/');
  // 첫 Tab: navbar-brand
  await page.keyboard.press('Tab');
  const focusedOnBrand = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    return el?.classList.contains('navbar-brand') ?? false;
  });
  expect(focusedOnBrand).toBe(true);

  // 다음 Tab: Home
  await page.keyboard.press('Tab');
  const focusedText = await page.evaluate(() => document.activeElement?.textContent ?? '');
  expect(focusedText).toMatch(/Home/);
});
