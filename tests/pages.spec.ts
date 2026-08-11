import { test, expect } from '@playwright/test';

const GUIDE_PAGES = [
  '/guias/aiostreams-tamtaro',
  '/guias/aiometadata',
  '/guias/nuvio',
  '/guias/torbox',
  '/guias/submaker',
  '/guias/toast-translator',
  '/guias/tugakids',
  '/guias/tmdb',
  '/guias/faq',
  '/guias/cotonet',
  '/guias/conteudo-pt',
];

test.describe('Conteúdo das páginas de guia', () => {
  for (const path of GUIDE_PAGES) {
    test.describe(path, () => {
      test('h1 existe e não está vazio', async ({ page }) => {
        await page.goto(path);
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();
        const text = await h1.innerText();
        expect(text.trim().length).toBeGreaterThan(0);
      });

      test('navbar/header presente', async ({ page }) => {
        await page.goto(path);
        const nav = page.locator('header, nav').first();
        await expect(nav).toBeVisible();
      });

      test('tem link de retorno para /guias/ ou /', async ({ page }) => {
        await page.goto(path);
        const backLinks = page.locator('a[href="/"], a[href="/guias/"], a[href$="/guias/"], nav a[href="/"]');
        const count = await backLinks.count();
        expect(count).toBeGreaterThan(0);
      });

      test('title contém "Stremio PT"', async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveTitle(/Stremio PT/);
      });

      test('pelo menos 100 palavras de conteúdo visível', async ({ page }) => {
        await page.goto(path);
        const main = page.locator('main, article, .content').first();
        const text = await main.innerText();
        const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        expect(wordCount).toBeGreaterThanOrEqual(100);
      });

      test('links internos para /guias/* não retornam 404', async ({ page }) => {
        await page.goto(path);
        const internalLinks = page.locator('main a[href*="/guias/"]');
        const count = await internalLinks.count();
        for (let i = 0; i < count; i++) {
          const href = await internalLinks.nth(i).getAttribute('href');
          if (!href || href.includes('#')) continue;
          const url = href.startsWith('http') ? href : `https://denunciastremio.netlify.app${href}`;
          const response = await page.request.get(url);
          expect(response.status(), `Link quebrado: ${href}`).not.toBe(404);
        }
      });
    });
  }
});
