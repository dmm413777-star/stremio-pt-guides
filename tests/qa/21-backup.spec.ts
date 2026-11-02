import { test, expect } from '@playwright/test';

// Passo A.1 da ronda 3: backup só em memória perde-se ao fechar o separador —
// confirma que as 4 ferramentas que escrevem na conta oferecem download real
// + aviso de segurança + reposição a partir de ficheiro.

async function mockStremioApi(page: any) {
  let existingAddons = [
    { transportUrl: 'https://aiometadata.elfhosted.com/x/manifest.json', transportName: 'http', flags: {}, manifest: { id: 'aio-metadata', name: 'AIOMetadata PT', version: '1.0', resources: ['catalog', 'meta'], types: [], catalogs: [] } },
  ];
  await page.route('**/api.strem.io/api/login', (route: any) => route.fulfill({ json: { result: { authKey: 'TEST' } } }));
  await page.route('**/api.strem.io/api/addonCollectionGet', (route: any) => route.fulfill({ json: { result: { addons: existingAddons } } }));
  await page.route('**/api.strem.io/api/addonCollectionSet', async (route: any) => {
    existingAddons = route.request().postDataJSON().addons;
    await route.fulfill({ json: { result: {} } });
  });
  // Cinemeta PT faz uma pré-condição: verifica se o manifest do AIOMetadata responde.
  await page.route('**/aiometadata.elfhosted.com/x/manifest.json', (route: any) =>
    route.fulfill({ json: { id: 'aio-metadata', name: 'AIOMetadata PT', version: '1.0', resources: ['catalog', 'meta'], types: [], catalogs: [] } }));
  return { getAddons: () => existingAddons };
}

async function login(page: any, prefix: string) {
  await page.fill(`#${prefix}-inp-email`, 'teste@example.com');
  await page.fill(`#${prefix}-inp-pass`, 'password');
  await page.click(`#${prefix}-btn-login`);
}

test.describe('Backup descarregável — AccountBackup (lógica pura)', () => {

  test('readBackupFile aceita {addons:[...]} e devolve a lista', async ({ page }) => {
    await page.goto('/organizador/');
    const result = await page.evaluate(async () => {
      const payload = JSON.stringify({ exportedAt: 'x', addons: [{ manifest: { id: 'a' } }] });
      const file = new File([payload], 'b.json', { type: 'application/json' });
      return (window as any).AccountBackup.readBackupFile(file);
    });
    expect(result).toEqual([{ manifest: { id: 'a' } }]);
  });

  test('readBackupFile aceita um array simples (sem invólucro)', async ({ page }) => {
    await page.goto('/organizador/');
    const result = await page.evaluate(async () => {
      const file = new File([JSON.stringify([{ manifest: { id: 'a' } }])], 'b.json', { type: 'application/json' });
      return (window as any).AccountBackup.readBackupFile(file);
    });
    expect(result).toEqual([{ manifest: { id: 'a' } }]);
  });

  test('readBackupFile rejeita JSON inválido', async ({ page }) => {
    await page.goto('/organizador/');
    const err = await page.evaluate(async () => {
      const file = new File(['{not json'], 'b.json', { type: 'application/json' });
      try { await (window as any).AccountBackup.readBackupFile(file); return null; }
      catch (e: any) { return e.message; }
    });
    expect(err).toBeTruthy();
  });

  test('readBackupFile rejeita ficheiro sem lista de addons', async ({ page }) => {
    await page.goto('/organizador/');
    const err = await page.evaluate(async () => {
      const file = new File([JSON.stringify({ foo: 'bar' })], 'b.json', { type: 'application/json' });
      try { await (window as any).AccountBackup.readBackupFile(file); return null; }
      catch (e: any) { return e.message; }
    });
    expect(err).toBeTruthy();
  });

  test('widgetHtml inclui o aviso de segurança sobre chaves', async ({ page }) => {
    await page.goto('/organizador/');
    const html = await page.evaluate(() => (window as any).AccountBackup.widgetHtml('x'));
    expect(html).toMatch(/chaves/i);
    expect(html).toMatch(/não o partilhes/i);
  });

});

test.describe('Widget de backup presente nas 4 ferramentas após login', () => {

  test('QuickStart tem o botão de backup', async ({ page }) => {
    await mockStremioApi(page);
    await page.goto('/');
    await login(page, 'qs');
    await expect(page.locator('#qs-login-status')).toContainText('Conta verificada', { timeout: 10000 });
    await expect(page.locator('#qs-bak-btn-download')).toBeVisible();
  });

  test('Cinemeta PT tem o botão de backup', async ({ page }) => {
    await mockStremioApi(page);
    await page.goto('/cinemeta-pt/');
    await login(page, 'cm');
    await expect(page.locator('#cm-login-status')).not.toHaveText('', { timeout: 10000 });
    await expect(page.locator('#cm-bak-btn-download')).toBeVisible();
  });

  test('Instalar Addon por URL tem o botão de backup', async ({ page }) => {
    await mockStremioApi(page);
    await page.route('**/cotonetnet-cotonet.hf.space/manifest.json', (route: any) =>
      route.fulfill({ json: { id: 'org.cotonet.addon', name: 'Cotonet', version: '1.0', resources: [], types: [], catalogs: [] } }));
    await page.goto('/instalar-addon/?url=https%3A%2F%2Fcotonetnet-cotonet.hf.space%2Fmanifest.json');
    await page.click('#ia-btn-verify');
    await expect(page.locator('#ia-verify-status')).toContainText('válido', { timeout: 10000 });
    await login(page, 'ia');
    await expect(page.locator('#ia-login-status')).toContainText('Conta verificada', { timeout: 10000 });
    await expect(page.locator('#ia-bak-btn-download')).toBeVisible();
  });

  test('Organizador tem o botão de backup', async ({ page }) => {
    await mockStremioApi(page);
    await page.goto('/organizador/');
    await login(page, 'og');
    await expect(page.locator('#og-login-status')).toContainText('Conta verificada', { timeout: 10000 });
    await expect(page.locator('#og-bak-btn-download')).toBeVisible();
  });

});

test.describe('Reposição a partir de ficheiro — fluxo completo (Organizador)', () => {

  test('repor de um ficheiro de backup substitui a colecção na conta', async ({ page }) => {
    const api = await mockStremioApi(page);
    await page.goto('/organizador/');
    await login(page, 'og');
    await expect(page.locator('#og-login-status')).toContainText('Conta verificada', { timeout: 10000 });

    await page.evaluate(() => { (window as any).confirm = () => true; });

    // O input de reposição vive dentro de um <details> recolhido por defeito
    await page.click('#og-widget details summary');

    const payload = JSON.stringify({ exportedAt: 'x', addons: [
      { transportUrl: 'https://restaurado.example.com/manifest.json', transportName: 'http', flags: {}, manifest: { id: 'restaurado', name: 'Addon Restaurado' } },
    ] });
    await page.setInputFiles('#og-bak-inp-restore', { name: 'backup.json', mimeType: 'application/json', buffer: Buffer.from(payload) });
    await page.click('#og-bak-btn-restore');
    await expect(page.locator('#og-bak-restore-status')).toContainText('Reposto', { timeout: 10000 });

    expect(api.getAddons().map((a: any) => a.manifest.id)).toEqual(['restaurado']);
  });

});
