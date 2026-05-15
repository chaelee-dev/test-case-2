import { test, expect } from '@playwright/test';

test('@articles — list + open detail', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'conduit' })).toBeVisible();
  const firstArticleTitle = page.locator('.article-preview h1').first();
  await expect(firstArticleTitle).toBeVisible();
  const titleText = await firstArticleTitle.textContent();
  await firstArticleTitle.click();
  await expect(page).toHaveURL(/\/article\//);
  await expect(page.getByRole('heading', { name: titleText ?? '' })).toBeVisible();
});
