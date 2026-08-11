import { test, expect } from '@playwright/test';

const GUIDE_URLS = [
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

test.describe('Links e páginas', () => {
  for (const url of GUIDE_URLS) {
    test(`${url} retorna 200`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);
      const h1 = page.locator('h1').first();
      await expect(h1).not.toBeEmpty();
    });
  }

  test('âncoras de /links/ existem no DOM', async ({ page }) => {
    await page.goto('/links/');
    // Hugo gera IDs nos headings — verifica os headings principais
    const expectedHeadings = ['Ferramentas', 'Addons Essenciais', 'Serviços de Debrid', 'Apps', 'Comunidade PT'];
    for (const heading of expectedHeadings) {
      const el = page.getByRole('heading', { name: heading });
      await expect(el).toBeAttached();
    }
  });

  test('links externos em /links/ têm href https:// válido', async ({ page }) => {
    await page.goto('/links/');
    const externalLinks = page.locator('main a[href^="https://"]');
    const count = await externalLinks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const href = await externalLinks.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^https:\/\/.+/);
      expect(href).not.toBe('https://');
    }
  });

  test('página inexistente devolve 404 com mensagem visível', async ({ page }) => {
    // Netlify serve a sua própria página 404 — verifica que tem mensagem e não está em branco
    const response = await page.goto('/guias/pagina-que-nao-existe');
    expect(response?.status()).toBe(404);
    const bodyText = await page.locator('body').innerText();
    // A página Netlify 404 diz "404 — This page could not be found."
    expect(bodyText.trim().length).toBeGreaterThan(5);
    expect(bodyText).toMatch(/404/);
  });
});
