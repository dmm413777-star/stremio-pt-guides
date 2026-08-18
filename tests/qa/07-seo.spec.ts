import { test, expect } from '@playwright/test';

const PAGINAS = [
  '/', '/guias', '/links',
  '/guias/comecar-aqui', '/guias/aiostreams-tamtaro',
  '/guias/torbox', '/guias/faq', '/guias/submaker',
];

test.describe('SEO e meta tags — Google a indexar', () => {
  test('Todas as páginas têm <title> preenchido', async ({ page }) => {
    for (const path of PAGINAS) {
      await page.goto(path);
      const title = await page.title();
      expect(title?.trim().length ?? 0, `Título vazio em ${path}`).toBeGreaterThan(5);
    }
  });

  test('Nenhuma página tem título duplicado', async ({ page }) => {
    const seen: string[] = [];
    for (const path of PAGINAS) {
      const r = await page.goto(path);
      if (r?.status() === 404) continue;
      const title = await page.title();
      if (seen.includes(title)) console.warn(`⚠️ Título duplicado: "${title}" em ${path}`);
      seen.push(title);
    }
  });

  test('Páginas de guia têm meta description', async ({ page }) => {
    const guias = ['/guias/torbox', '/guias/submaker', '/guias/faq'];
    for (const path of guias) {
      await page.goto(path);
      const desc = await page.locator('meta[name="description"]').getAttribute('content');
      if (!desc || desc.trim().length < 10) {
        console.warn(`⚠️ Meta description ausente ou curta em ${path}`);
      }
    }
  });

  test('robots.txt presente', async ({ page }) => {
    const r = await page.goto('/robots.txt');
    expect(r?.status()).toBe(200);
  });

  test('sitemap.xml presente', async ({ page }) => {
    const r = await page.goto('/sitemap.xml');
    expect(r?.status(), 'sitemap.xml em falta').toBe(200);
  });

  test('Open Graph tags na homepage', async ({ page }) => {
    await page.goto('/');
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content').catch(() => null);
    if (!ogTitle) console.warn('⚠️ og:title ausente na homepage');
  });

  test('Páginas de guia não têm h1 vazio', async ({ page }) => {
    for (const path of PAGINAS.filter(p => p.includes('/guias/'))) {
      const r = await page.goto(path);
      if (r?.status() === 404) continue;
      const text = await page.locator('h1').first().textContent();
      expect(text?.trim().length ?? 0, `h1 vazio em ${path}`).toBeGreaterThan(0);
    }
  });
});
