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

test.describe('isCinemeta — identificação só por transportUrl (nunca por manifest.id)', () => {
  // O "Cinemeta PT" (Toast Translator) reporta de propósito o mesmo manifest.id
  // (com.linvo.cinemeta) do Cinemeta oficial, sem ser o addon oficial. Todas as
  // operações têm de distinguir os dois só pelo host do transportUrl.

  const collection = [
    { manifest: { id: 'com.linvo.cinemeta', name: 'Cinemeta' }, transportUrl: 'https://v3-cinemeta.strem.io/manifest.json' },
    { manifest: { id: 'com.linvo.cinemeta', name: 'Cinemeta 🇵🇹 | ElfHosted' }, transportUrl: 'https://toast-translator.elfhosted.com/x/manifest.json' },
  ];

  test('StremioAccountAPI.isCinemeta só identifica o host oficial', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    const result = await page.evaluate((col) => {
      const api = (window as any).StremioAccountAPI;
      return col.map((a: any) => api.isCinemeta(a));
    }, collection);
    expect(result).toEqual([true, false]);
  });

  test('NuvioAccountAPI.isCinemeta só identifica o host oficial', async ({ page }) => {
    await page.goto('/cinemeta-pt/');
    const result = await page.evaluate((col) => {
      const api = (window as any).NuvioAccountAPI;
      return col.map((a: any) => api.isCinemeta(a));
    }, collection);
    expect(result).toEqual([true, false]);
  });

  test('Diagnóstico não marca o Toast "Cinemeta PT" como duplicado', async ({ page }) => {
    await page.goto('/diagnostico/');
    const issues = await page.evaluate(async (col) => {
      (window as any).fetch = async () => ({ ok: true, json: async () => ({}) });
      return (window as any).AccountDiagnostico.analyzeAddons(col, { concurrency: 1 });
    }, collection);
    expect(issues.find((i: any) => i.type === 'duplicado')).toBeFalsy();
  });

  test('Diagnóstico detecta o Cinemeta oficial sem tratamento, não o Toast wrapper', async ({ page }) => {
    await page.goto('/diagnostico/');
    const issues = await page.evaluate(async (col) => {
      (window as any).fetch = async () => ({ ok: true, json: async () => ({}) });
      return (window as any).AccountDiagnostico.analyzeAddons(col, { concurrency: 1 });
    }, collection);
    const cinemetaIssue = issues.find((i: any) => i.type === 'cinemeta');
    expect(cinemetaIssue).toBeTruthy();
    expect(cinemetaIssue.addonIndexes).toEqual([0]); // só o índice do oficial, não o Toast
  });
});
