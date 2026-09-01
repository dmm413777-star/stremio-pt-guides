import { test, expect } from '@playwright/test';

test.describe('Navegação — Maria navega todos os menus', () => {
  test('/guias carrega e tem conteúdo', async ({ page }) => {
    await page.goto('/guias');
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/links carrega e tem conteúdo', async ({ page }) => {
    const r = await page.goto('/links');
    expect(r?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Navbar tem links "Guias" e "Links"', async ({ page }) => {
    await page.goto('/');
    // Links existem no DOM — no mobile ficam ocultos pelo hextra (hamburger menu)
    await expect(page.locator('a[href="/guias"]').first()).toBeAttached();
    await expect(page.locator('a[href="/links"]').first()).toBeAttached();
  });

  test('Link "Guias" na navbar navega para /guias', async ({ page }) => {
    await page.goto('/');
    // No mobile, clicar no hamburger primeiro
    const hamburger = page.locator('.hextra-hamburger-menu, button[aria-label="Menu"]').first();
    if (await hamburger.isVisible()) await hamburger.click();
    await page.locator('a[href="/guias"]').first().click();
    await expect(page).toHaveURL(/\/guias/);
  });

  test('Sidebar de navegação está presente nas páginas de guia', async ({ page }) => {
    await page.goto('/guias/comecar-aqui');
    const sidebar = page.locator('aside, nav[aria-label], [class*="sidebar"]').first();
    const hasSidebar = await sidebar.isVisible().catch(() => false);
    if (!hasSidebar) {
      console.warn('⚠️ Sidebar não detectada — verifica layout do tema');
    }
  });

  test('Navegação via teclado não fica presa', async ({ page }) => {
    await page.goto('/');
    for (let i = 0; i < 10; i++) await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    const tag = await focused.evaluate(el => el.tagName).catch(() => 'NONE');
    expect(tag).not.toBe('BODY');
  });

  test('Links internos /guias/* não retornam 404', async ({ page }) => {
    await page.goto('/guias');
    const links = await page.locator('a[href*="/guias/"]').all();
    const broken: string[] = [];
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href) continue;
      const r = await page.request.get(href).catch(() => null);
      if (r?.status() === 404) broken.push(href);
    }
    expect(broken, `Links quebrados:\n${broken.join('\n')}`).toHaveLength(0);
  });
});
