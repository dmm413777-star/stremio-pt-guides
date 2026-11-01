import { test, expect } from '@playwright/test';

// Persona: utilizador que já tem o pack PT instalado e quer tirar o Cinemeta do caminho

test.describe('Cinemeta PT — página e UI', () => {

  test('página /cinemeta-pt/ carrega', async ({ page }) => {
    const r = await page.goto('/cinemeta-pt/');
    expect(r?.status()).toBe(200);
  });

  test('tem toggle de plataforma Stremio/Nuvio', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    await expect(page.locator('#cm-platform-stremio')).toBeAttached();
    await expect(page.locator('#cm-platform-nuvio')).toBeAttached();
  });

  test('Stremio seleccionado por defeito, 3 opções de patch visíveis', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    await expect(page.locator('#cm-platform-stremio')).toHaveClass(/active/);
    await expect(page.locator('#cm-opt-search')).toBeAttached();
    await expect(page.locator('#cm-opt-home')).toBeAttached();
    await expect(page.locator('#cm-opt-meta')).toBeAttached();
    // pesquisa e home ligadas por defeito, metadados desligada
    await expect(page.locator('#cm-opt-search')).toBeChecked();
    await expect(page.locator('#cm-opt-home')).toBeChecked();
    await expect(page.locator('#cm-opt-meta')).not.toBeChecked();
  });

  test('clicar em Nuvio mostra opções Nuvio e esconde opções Stremio', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    await page.evaluate(() => (window as any).cmSetPlatform('nuvio'));
    await expect(page.locator('#cm-nuvio-options')).toBeVisible();
    await expect(page.locator('#cm-stremio-options')).toBeHidden();
  });

  test('créditos ao Duck Tools presentes', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    const html = await page.content();
    expect(html).toContain('Duck Tools');
    expect(html.toLowerCase()).toContain('duck-tools.pages.dev');
  });

  test('aviso de "avançado" no checkbox de remover metadados', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/avançado/i);
  });

  test('módulo partilhado expõe funções do Cinemeta Patcher', async ({ page, request }) => {
    await page.goto('/cinemeta-pt/');
    const stremioJs = await (await request.get('/js/conta/stremio-api.js')).text();
    expect(stremioJs).toContain('patchCinemeta');
    expect(stremioJs).toContain('resetCinemeta');
    expect(stremioJs).toContain('v3-cinemeta.strem.io');

    const nuvioJs = await (await request.get('/js/conta/nuvio-api.js')).text();
    expect(nuvioJs).toContain('deleteCinemeta');
    expect(nuvioJs).toContain('installCinemeta');
  });

  test('sem scroll horizontal no mobile', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vpWidth = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(vpWidth + 15);
  });

  test('link para Cinemeta PT presente na homepage', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href*="cinemeta-pt"]');
    expect(await link.count()).toBeGreaterThanOrEqual(1);
  });

});
