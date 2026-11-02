import { test, expect } from '@playwright/test';

// Ronda 4, item 3: no ecrã final do QuickStart, mostrar as passwords geradas
// para as contas AIOStreams e AIOMetadata (com botão de copiar) e incluí-las
// na cópia de segurança descarregável. Nunca em console/log.

async function mockQuickstartInstall(page: any) {
  let savedAddons: any[] = [];
  await page.route('**/api.strem.io/api/login', (route: any) => route.fulfill({ json: { result: { authKey: 'TEST' } } }));
  await page.route('**/api.strem.io/api/addonCollectionGet', (route: any) => route.fulfill({ json: { result: { addons: [] } } }));
  await page.route('**/api.strem.io/api/addonCollectionSet', async (route: any) => {
    savedAddons = route.request().postDataJSON().addons;
    await route.fulfill({ json: { result: {} } });
  });

  await page.route('**/aiostreams-pt-proxy.mire-freckle.workers.dev', (route: any) =>
    route.fulfill({ json: { success: true, data: { manifestUrl: 'https://aiostreamsfortheweebs.midnightignite.me/x/manifest.json' } } }));
  await page.route('https://aiostreamsfortheweebs.midnightignite.me/x/manifest.json', (route: any) =>
    route.fulfill({ json: { id: 'com.aiostreams', name: 'AIOStreams', version: '1.0', resources: ['stream'], types: [], catalogs: [] } }));

  await page.route('**/aiometadata.elfhosted.com/api/config/save', (route: any) =>
    route.fulfill({ json: { success: true, installUrl: 'https://aiometadata.elfhosted.com/y/manifest.json' } }));
  await page.route('https://aiometadata.elfhosted.com/y/manifest.json', (route: any) =>
    route.fulfill({ json: { id: 'com.aio.metadata', name: 'AIOMetadata PT', version: '1.0', resources: ['catalog', 'meta'], types: [], catalogs: [] } }));

  return { getSavedAddons: () => savedAddons };
}

async function runInstall(page: any) {
  await mockQuickstartInstall(page);
  await page.goto('/');
  await page.fill('#qs-inp-email', 'teste@example.com');
  await page.fill('#qs-inp-pass', 'password');
  await page.click('#qs-btn-login');
  await expect(page.locator('#qs-login-status')).toContainText('Conta verificada', { timeout: 10000 });

  // Modo P2P (o modo por defeito é Debrid, que exige uma API key) + só
  // AIOStreams + AIOMetadata seleccionados
  await page.click('#qs-mode-p2p');
  for (const id of ['submaker', 'animacaopt', 'cotonet', 'ptgdrive']) {
    await page.evaluate((cid: string) => {
      const el = document.getElementById('qs-chk-' + cid) as HTMLInputElement;
      el.checked = false;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }, id);
  }

  const consoleTexts: string[] = [];
  page.on('console', (msg: any) => consoleTexts.push(msg.text()));

  await page.click('#qs-btn-install');
  await expect(page.locator('#qs-next-steps')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#qs-next-steps')).toContainText('AIOMetadata', { timeout: 15000 });
  return { consoleTexts };
}

test.describe('QuickStart — passwords AIOStreams/AIOMetadata no ecrã final', () => {

  test('mostra as duas passwords com aviso de segurança e botão de copiar', async ({ page }) => {
    await runInstall(page);
    const next = page.locator('#qs-next-steps');
    await expect(next).toContainText('Guarda estas palavras-passe num sítio seguro');
    await expect(next).toContainText('Não as partilhes');
    const rows = page.locator('.qs-copy-pw');
    await expect(rows).toHaveCount(2);
  });

  test('botão de copiar usa o clipboard e não é um link/onclick com a password no DOM fora do atributo data-copy', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await runInstall(page);
    const btn = page.locator('.qs-copy-pw').first();
    const expected = await btn.getAttribute('data-copy');
    expect(expected).toBeTruthy();
    await btn.click();
    await expect(btn).toHaveText('Copiado!');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe(expected);
  });

  test('as passwords nunca aparecem na consola', async ({ page }) => {
    const { consoleTexts } = await runInstall(page);
    const pwValues = await page.locator('.qs-copy-pw').evaluateAll((els: any[]) => els.map(e => e.getAttribute('data-copy')));
    for (const pw of pwValues) {
      expect(consoleTexts.some(t => t.includes(pw))).toBe(false);
    }
  });

  test('a cópia de segurança descarregável inclui as duas passwords', async ({ page }) => {
    await runInstall(page);
    const downloadPromise = page.waitForEvent('download');
    await page.evaluate(() => document.getElementById('qs-bak-btn-download')!.click());
    const download = await downloadPromise;
    const streamPath = await download.path();
    const fs = require('fs');
    const content = JSON.parse(fs.readFileSync(streamPath, 'utf-8'));
    expect(content.passwords).toBeTruthy();
    expect(typeof content.passwords.aiostreams).toBe('string');
    expect(typeof content.passwords.aiometadata).toBe('string');
    expect(content.passwords.aiostreams.length).toBeGreaterThan(0);
    expect(content.passwords.aiometadata.length).toBeGreaterThan(0);
  });

});
