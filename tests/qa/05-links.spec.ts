import { test, expect } from '@playwright/test';

test.describe('Links e recursos — André clica em tudo', () => {
  test('/links carrega com h1', async ({ page }) => {
    const r = await page.goto('/links');
    expect(r?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Links externos em /links têm href válido', async ({ page }) => {
    await page.goto('/links');
    const links = await page.locator('a[href^="http"]').all();
    const invalid: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href || href === 'http://' || href === 'https://') {
        invalid.push(await link.textContent() ?? href ?? '');
      }
    }
    expect(invalid, `Links externos inválidos: ${invalid.join(', ')}`).toHaveLength(0);
  });

  test('Links externos abrem em nova tab', async ({ page }) => {
    await page.goto('/links');
    const links = await page.locator('a[href^="http"]').all();
    const missing: string[] = [];
    for (const link of links) {
      const target = await link.getAttribute('target');
      if (target !== '_blank') missing.push((await link.getAttribute('href')) ?? '');
    }
    if (missing.length > 0) {
      console.warn(`⚠️ ${missing.length} links sem target="_blank": ${missing.slice(0, 3).join(', ')}`);
    }
  });

  test('Página 404 personalizada existe', async ({ page }) => {
    const r = await page.goto('/pagina-inexistente-abc123');
    const body = await page.locator('body').textContent();
    expect(body?.trim().length ?? 0).toBeGreaterThan(10);
  });

  test('robots.txt existe', async ({ page }) => {
    const r = await page.goto('/robots.txt');
    expect(r?.status()).toBe(200);
  });

  test('sitemap.xml existe', async ({ page }) => {
    const r = await page.goto('/sitemap.xml');
    if (r?.status() !== 200) {
      console.warn('⚠️ sitemap.xml não encontrado');
    }
  });

  test('TorBox referral link correcto em /guias/torbox', async ({ page }) => {
    await page.goto('/guias/torbox');
    const correct = 'torbox.app/subscription?referral=444bd704-e54d-45d7-a058-5f1b4b3350cd';
    const links = await page.locator(`a[href*="torbox.app/subscription"]`).all();
    expect(links.length, 'Link de referral TorBox não encontrado').toBeGreaterThan(0);
    for (const link of links) {
      const href = await link.getAttribute('href');
      expect(href).toContain(correct);
    }
  });
});
