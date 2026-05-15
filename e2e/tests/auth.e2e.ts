import { test, expect } from '@playwright/test';

test('@auth — register + redirect /', async ({ page }) => {
  await page.goto('/register');
  const unique = `u_${Date.now()}`;
  await page.getByPlaceholder('Username').fill(unique);
  await page.getByPlaceholder('Email').fill(`${unique}@e.com`);
  await page.getByPlaceholder('Password').fill('pw12345678');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page).toHaveURL('/');
});
