import { test, expect } from '@playwright/test';

test('@xss — <script> payload는 실행되지 않는다', async ({ page }) => {
  let alertCalled = false;
  page.on('dialog', async (dialog) => {
    alertCalled = true;
    await dialog.dismiss();
  });

  // 가입 → 글 작성 (body에 XSS payload)
  await page.goto('/register');
  const unique = `xss_${Date.now()}`;
  await page.getByPlaceholder('Username').fill(unique);
  await page.getByPlaceholder('Email').fill(`${unique}@e.com`);
  await page.getByPlaceholder('Password').fill('pw12345678');
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(page).toHaveURL('/');

  await page.goto('/editor');
  await page.getByPlaceholder('Article Title').fill(`XSS test ${Date.now()}`);
  await page.getByPlaceholder("What's this article about?").fill('xss');
  await page.getByPlaceholder(/markdown/).fill('<script>alert(1)</script>');
  await page.getByRole('button', { name: 'Publish Article' }).click();
  await expect(page).toHaveURL(/\/article\//);

  // alert가 실행되었다면 dialog 이벤트가 트리거됨
  await page.waitForTimeout(500);
  expect(alertCalled).toBe(false);
});
