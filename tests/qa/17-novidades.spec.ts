import { test, expect } from '@playwright/test';

test.describe('Novidades — changelog', () => {

  test('página /novidades/ carrega', async ({ page }) => {
    const r = await page.goto('/novidades/');
    expect(r?.status()).toBe(200);
  });

  test('lista não está vazia e tem pelo menos uma entrada', async ({ page }) => {
    await page.goto('/novidades/');
    const entries = page.locator('.nv-entry');
    expect(await entries.count()).toBeGreaterThanOrEqual(1);
  });

  test('cada entrada tem data e título', async ({ page }) => {
    await page.goto('/novidades/');
    await expect(page.locator('.nv-date').first()).toBeVisible();
    await expect(page.locator('.nv-title').first()).toBeVisible();
  });

  test('link "Novidades" presente na navbar', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href*="/novidades"]');
    expect(await link.count()).toBeGreaterThanOrEqual(1);
  });

  test('menciona as ferramentas desta ronda (Cinemeta PT, Diagnóstico)', async ({ page }) => {
    await page.goto('/novidades/');
    const body = await page.locator('body').textContent();
    expect(body).toContain('Cinemeta PT');
    expect(body).toMatch(/Diagnóstico/);
  });

});
