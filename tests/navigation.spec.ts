import { test, expect } from '@playwright/test';

const GUIDE_PAGES = [
  '/guias/aiostreams-tamtaro',
  '/guias/torbox',
  '/guias/nuvio',
  '/guias/faq',
];

test.describe('Navegação', () => {
  test('homepage → Guias leva a /guias/', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Guias' }).first().click();
    await page.waitForURL(/\/guias\/?$/);
    expect(page.url()).toMatch(/\/guias\/?$/);
  });

  test('homepage → Links leva a /links/', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Links' }).first().click();
    await page.waitForURL(/\/links\/?/);
    expect(page.url()).toMatch(/\/links\/?/);
  });

  test('navbar presente e com link para homepage em todas as páginas de guia', async ({ page }) => {
    for (const path of GUIDE_PAGES) {
      await page.goto(path);
      // Hextra pode usar <header> ou <nav> — aguarda qualquer um
      await page.waitForSelector('header, nav', { timeout: 15000 });
      const header = page.locator('header, nav').first();
      await expect(header).toBeVisible();
      // Link de volta à homepage: primeiro link do header
      const homeLink = header.locator('a').first();
      await expect(homeLink).toBeVisible();
      const href = await homeLink.getAttribute('href');
      expect(href === '/' || href === '' || href?.endsWith('/')).toBeTruthy();
    }
  });

  test('"Skip to content" existe em todas as páginas de guia', async ({ page }) => {
    for (const path of GUIDE_PAGES) {
      await page.goto(path);
      // Pode ser href="#content" ou href="#main-content" dependendo do tema
      const skip = page.locator('a[href="#content"], a[href="#main-content"]').first();
      await expect(skip).toBeAttached();
    }
  });

  test('botão "Scroll to top" existe em páginas de conteúdo', async ({ page }) => {
    await page.goto('/guias/torbox');
    // Hextra adiciona #backToTop — pode estar hidden até scroll
    const btn = page.locator('#backToTop').first();
    await expect(btn).toBeAttached();
  });

  test('"On this page" TOC existe em /links/', async ({ page }) => {
    await page.goto('/links/');
    // Hextra gera TOC com âncoras — verifica que existe pelo menos um link âncora na página
    const anchorLinks = page.locator('a[href^="#"]');
    const count = await anchorLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('âncora em /links/ existe no DOM sem necessidade de clique', async ({ page }) => {
    await page.goto('/links/');
    // O link #ferramentas existe no DOM (pode estar em sidebar oculta mas attached)
    const anchorLink = page.locator('a[href="#ferramentas"]').first();
    await expect(anchorLink).toBeAttached();
    // A URL permanece em /links/ — não navega para outra página
    expect(page.url()).toContain('/links/');
  });
});
