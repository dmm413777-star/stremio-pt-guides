import { test, expect } from '@playwright/test';

test.describe('Homepage — João chega ao site pela primeira vez', () => {
  test('Página carrega com título correcto', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Stremio|Nuvio|Denuncia/i);
  });

  test('Navbar está presente', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });

  test('Existe heading visível acima da dobra', async ({ page }) => {
    await page.goto('/');
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(3);
  });

  test('Banner "Primeira vez aqui?" está presente', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('text=Primeira vez aqui');
    await expect(banner).toBeVisible();
  });

  test('Card "Guia Completo" aponta para comecar-aqui', async ({ page }) => {
    await page.goto('/');
    // Dois elementos com este texto existem (card + heading interno) — usa o primeiro
    const card = page.locator('a:has-text("Guia Completo")').first();
    await expect(card).toBeVisible();
    const href = await card.getAttribute('href');
    expect(href).toMatch(/comecar-aqui/);
  });

  test('Nenhuma imagem quebrada na homepage', async ({ page }) => {
    const broken: string[] = [];
    page.on('response', r => {
      if (r.request().resourceType() === 'image' && !r.ok()) broken.push(r.url());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(broken, `Imagens quebradas: ${broken.join(', ')}`).toHaveLength(0);
  });

  test('Nenhum recurso retorna 404', async ({ page }) => {
    const failed: string[] = [];
    page.on('response', r => { if (r.status() === 404) failed.push(r.url()); });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(failed, `Recursos em falta:\n${failed.join('\n')}`).toHaveLength(0);
  });
});
