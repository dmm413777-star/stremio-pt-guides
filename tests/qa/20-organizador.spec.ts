import { test, expect } from '@playwright/test';

test.describe('Organizador de Addons — página e UI', () => {

  test('página /organizador/ carrega', async ({ page }) => {
    const r = await page.goto('/organizador/');
    expect(r?.status()).toBe(200);
  });

  test('toggle de plataforma presente', async ({ page }) => {
    await page.goto('/organizador/');
    await expect(page.locator('#og-platform-stremio')).toBeAttached();
    await expect(page.locator('#og-platform-nuvio')).toBeAttached();
  });

  test('menciona cópia de segurança e desfazer', async ({ page }) => {
    await page.goto('/organizador/');
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/cópia de segurança/i);
    expect(body).toMatch(/desfazer/i);
  });

  test('sem scroll horizontal no mobile', async ({ page }) => {
    await page.goto('/organizador/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vpWidth = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(vpWidth + 15);
  });

});

test.describe('AddonOrganizer — lógica pura', () => {

  test('recommendedOrder põe o AIOMetadata primeiro e o Cinemeta oficial por último', async ({ page }) => {
    await page.goto('/organizador/');
    const order = await page.evaluate(() => {
      const addons = [
        { manifest: { id: 'com.linvo.cinemeta', name: 'Cinemeta' }, transportUrl: 'https://v3-cinemeta.strem.io/manifest.json' },
        { manifest: { id: 'org.cotonet.addon', name: 'Cotonet' }, transportUrl: 'https://cotonetnet-cotonet.hf.space/manifest.json' },
        { manifest: { id: 'com.linvo.cinemeta', name: 'Cinemeta PT' }, transportUrl: 'https://toast-translator.elfhosted.com/x/manifest.json' },
        { manifest: { id: 'aio-metadata', name: 'AIOMetadata PT' }, transportUrl: 'https://aiometadata.elfhosted.com/x/manifest.json' },
      ];
      return (window as any).AddonOrganizer.recommendedOrder(addons).map((a: any) => a.manifest.name);
    });
    expect(order[0]).toBe('AIOMetadata PT');
    expect(order[order.length - 1]).toBe('Cinemeta'); // só o oficial, não o "Cinemeta PT"
  });

  test('recommendedOrder é estável para addons do mesmo grupo (mantém ordem relativa)', async ({ page }) => {
    await page.goto('/organizador/');
    const order = await page.evaluate(() => {
      const addons = [
        { manifest: { id: 'a', name: 'Catálogo A' }, transportUrl: 'https://a.example.com/manifest.json' },
        { manifest: { id: 'b', name: 'Catálogo B' }, transportUrl: 'https://b.example.com/manifest.json' },
      ];
      return (window as any).AddonOrganizer.recommendedOrder(addons).map((a: any) => a.manifest.name);
    });
    expect(order).toEqual(['Catálogo A', 'Catálogo B']);
  });

  test('moveUp/moveDown trocam posições correctamente e respeitam os limites', async ({ page }) => {
    await page.goto('/organizador/');
    const result = await page.evaluate(() => {
      const org = (window as any).AddonOrganizer;
      const list = ['a', 'b', 'c'];
      const afterUpAt0 = org.moveUp(list, 0); // já está no topo, sem alteração
      const afterDownAt0 = org.moveDown(list, 0);
      const afterUpAt2 = org.moveUp(list, 2);
      const afterDownAt2 = org.moveDown(list, 2); // já está no fundo, sem alteração
      return { afterUpAt0, afterDownAt0, afterUpAt2, afterDownAt2 };
    });
    expect(result.afterUpAt0).toEqual(['a', 'b', 'c']);
    expect(result.afterDownAt0).toEqual(['b', 'a', 'c']);
    expect(result.afterUpAt2).toEqual(['a', 'c', 'b']);
    expect(result.afterDownAt2).toEqual(['a', 'b', 'c']);
  });

  test('removeAt remove só o índice indicado', async ({ page }) => {
    await page.goto('/organizador/');
    const result = await page.evaluate(() => (window as any).AddonOrganizer.removeAt(['a', 'b', 'c'], 1));
    expect(result).toEqual(['a', 'c']);
  });

  test('isOfficialCinemeta identifica só pelo host, igual ao Stremio/NuvioAccountAPI', async ({ page }) => {
    await page.goto('/organizador/');
    const result = await page.evaluate(() => {
      const org = (window as any).AddonOrganizer;
      return [
        org.isOfficialCinemeta({ transportUrl: 'https://v3-cinemeta.strem.io/manifest.json' }),
        org.isOfficialCinemeta({ transportUrl: 'https://toast-translator.elfhosted.com/x/manifest.json', manifest: { id: 'com.linvo.cinemeta' } }),
      ];
    });
    expect(result).toEqual([true, false]);
  });

});

test.describe('Organizador — regra do backup/desfazer (mock, sem conta real)', () => {

  test('"Desfazer" fica activo e continua activo depois de gravar', async ({ page }) => {
    let existingAddons = [
      { transportUrl: 'https://a.example.com/manifest.json', transportName: 'http', flags: {}, manifest: { id: 'a', name: 'A', version: '1.0', resources: [], types: [], catalogs: [] } },
      { transportUrl: 'https://b.example.com/manifest.json', transportName: 'http', flags: {}, manifest: { id: 'b', name: 'B', version: '1.0', resources: [], types: [], catalogs: [] } },
    ];

    await page.route('**/api.strem.io/api/login', route => route.fulfill({ json: { result: { authKey: 'TEST' } } }));
    await page.route('**/api.strem.io/api/addonCollectionGet', route => route.fulfill({ json: { result: { addons: existingAddons } } }));
    await page.route('**/api.strem.io/api/addonCollectionSet', async route => {
      existingAddons = route.request().postDataJSON().addons;
      await route.fulfill({ json: { result: {} } });
    });

    await page.goto('/organizador/');
    await page.fill('#og-inp-email', 'teste@example.com');
    await page.fill('#og-inp-pass', 'password');
    await page.click('#og-btn-login');
    await expect(page.locator('#og-login-status')).toContainText('Conta verificada', { timeout: 10000 });

    // Antes de qualquer gravação, não há nada para desfazer
    await expect(page.locator('#og-btn-undo')).toBeDisabled();

    // Reordena e grava
    await page.click('.addon-row[data-i="0"] button[data-action="down"]');
    await page.click('#og-btn-save');
    await expect(page.locator('#og-save-status')).toContainText('Guardado', { timeout: 10000 });

    // Depois de gravar, "Desfazer" tem de continuar activo — é o propósito dele
    await expect(page.locator('#og-btn-undo')).toBeEnabled();

    // Desfazer repõe a ordem anterior ao "mover"
    await page.click('#og-btn-undo');
    await expect(page.locator('#og-save-status')).toContainText('Desfeito', { timeout: 10000 });
    expect(existingAddons.map((a: any) => a.manifest.id)).toEqual(['a', 'b']);
  });

});
