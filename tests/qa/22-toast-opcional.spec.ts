import { test, expect } from '@playwright/test';

// Ronda 4, item 2: TOAST_POR_DEFEITO: DESLIGADO — medição real (ver
// docs/estudo-quickstart-pt.md) mostrou pesquisa morta e fichas idênticas às
// do AIOMetadata. O Toast passa a extra opcional, desmarcado por defeito.

test.describe('Toast Translator — opcional, desmarcado por defeito', () => {

  test('checkbox do Toast começa desmarcada; outros addons do pack começam marcados', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#qs-chk-toast')).not.toBeChecked();
    for (const id of ['aiostreams', 'aiometadata', 'submaker', 'cotonetkids']) {
      await expect(page.locator('#qs-chk-' + id)).toBeChecked();
    }
  });

  test('badge do pack mostra 4 seleccionados por defeito (5 addons, Toast fora)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#qs-pack-badge')).toHaveText('4 selecionados');
  });

  test('"Todos" marca também o Toast; "Nenhum" desmarca tudo', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => (window as any).qsSelectAll(true));
    await expect(page.locator('#qs-chk-toast')).toBeChecked();
    await page.evaluate(() => (window as any).qsSelectAll(false));
    await expect(page.locator('#qs-chk-toast')).not.toBeChecked();
  });

  test('descrição do Toast explica que é extra opcional e o que a pesquisa/fichas já cobrem', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/Extra opcional/i);
  });

  test('Diagnóstico mostra nota informativa (não erro/aviso) para quem já tem o Toast', async ({ page }) => {
    await page.goto('/diagnostico/');
    const issue = await page.evaluate(async () => {
      (window as any).fetch = async () => ({ ok: true, json: async () => ({}) });
      const addons = [{
        manifest: { id: 'org.stremio.toasttranslator', name: 'Cinemeta PT' },
        transportUrl: 'https://toast-translator.elfhosted.com/x/manifest.json',
      }];
      const issues = await (window as any).AccountDiagnostico.analyzeAddons(addons, { concurrency: 1 });
      return issues.find((i: any) => i.type === 'toast-opcional');
    });
    expect(issue).toBeTruthy();
    expect(issue.severity).toBe('info');
    expect(issue.link).toBe('/organizador/');
  });

  test('guia toast-translator.md explica que é opcional no QuickStart', async ({ page }) => {
    await page.goto('/guias/toast-translator/');
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/opcional/i);
    expect(body).toMatch(/AIOMetadata/);
  });

  test('créditos ao Toast Translator mantidos no guia', async ({ page }) => {
    await page.goto('/guias/toast-translator/');
    const body = await page.locator('body').textContent();
    expect(body).toContain('Toast Translator');
  });

});
