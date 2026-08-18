import { test, expect } from '@playwright/test';

const GUIAS = [
  { path: '/guias/comecar-aqui',         minWords: 50 },
  { path: '/guias/aiostreams-tamtaro',   minWords: 100 },
  { path: '/guias/aiometadata',          minWords: 80 },
  { path: '/guias/aiostreams-legendas-pt', minWords: 50 },
  { path: '/guias/nuvio',                minWords: 80 },
  { path: '/guias/torbox',               minWords: 80 },
  { path: '/guias/submaker',             minWords: 50 },
  { path: '/guias/toast-translator',     minWords: 50 },
  { path: '/guias/tugakids',             minWords: 30 },
  { path: '/guias/tmdb',                 minWords: 50 },
  { path: '/guias/tvdb',                 minWords: 30 },
  { path: '/guias/mdblist',              minWords: 30 },
  { path: '/guias/faq',                  minWords: 100 },
  { path: '/guias/problemas-comuns',     minWords: 80 },
  { path: '/guias/legendas-pt',          minWords: 50 },
  { path: '/guias/conteudo-pt',          minWords: 50 },
  { path: '/guias/cotonet',              minWords: 30 },
  { path: '/guias/migrar-para-nuvio',    minWords: 50 },
  { path: '/guias/clonar-perfil-nuvio',  minWords: 30 },
  { path: '/guias/dispositivos',         minWords: 30 },
];

test.describe('Conteúdo dos Guias — Pedro lê tudo', () => {
  for (const guia of GUIAS) {
    test(`${guia.path} — carrega com conteúdo suficiente`, async ({ page }) => {
      const r = await page.goto(guia.path);
      if (r?.status() === 404) {
        console.warn(`⚠️ Guia não existe: ${guia.path}`);
        test.skip();
        return;
      }
      await expect(page.locator('h1').first()).toBeVisible();
      const main = page.locator('main, article, .content').first();
      const text = await main.textContent();
      const words = text?.trim().split(/\s+/).length ?? 0;
      expect(words, `${guia.path} tem só ${words} palavras`).toBeGreaterThanOrEqual(guia.minWords);
    });
  }

  test('comecar-aqui tem secção "O que fazer a seguir"', async ({ page }) => {
    await page.goto('/guias/comecar-aqui');
    // Procura o h2 no conteúdo principal (evita sidebar link oculto)
    const heading = page.locator('main h2, article h2').filter({ hasText: 'O que fazer a seguir' });
    await expect(heading.first()).toBeVisible();
  });

  test('Nenhum guia tem título h1 vazio', async ({ page }) => {
    for (const guia of GUIAS) {
      const r = await page.goto(guia.path);
      if (r?.status() === 404) continue;
      const text = await page.locator('h1').first().textContent();
      expect(text?.trim().length ?? 0, `h1 vazio em ${guia.path}`).toBeGreaterThan(0);
    }
  });

  test('submaker.md tem nota de compatibilidade Nuvio', async ({ page }) => {
    await page.goto('/guias/submaker');
    const body = await page.locator('main, article').first().textContent();
    expect(body?.toLowerCase()).toContain('nuvio');
  });

  test('toast-translator.md tem nota de compatibilidade Nuvio', async ({ page }) => {
    await page.goto('/guias/toast-translator');
    const body = await page.locator('main, article').first().textContent();
    expect(body?.toLowerCase()).toContain('nuvio');
  });

  test('conteudo-pt.md não menciona Pipocas TV', async ({ page }) => {
    await page.goto('/guias/conteudo-pt');
    const body = await page.locator('body').textContent();
    expect(body?.toLowerCase()).not.toContain('pipoca');
  });

  test('conteudo-pt.md menciona PTGDrive', async ({ page }) => {
    await page.goto('/guias/conteudo-pt');
    // Verifica no texto do conteúdo (evita sidebar link oculto)
    const body = await page.locator('main, article').first().textContent();
    expect(body).toContain('PTGDrive');
  });
});
