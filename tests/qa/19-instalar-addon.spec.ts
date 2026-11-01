import { test, expect } from '@playwright/test';

test.describe('Instalar Addon por URL — página e validação', () => {

  test('página /instalar-addon/ carrega', async ({ page }) => {
    const r = await page.goto('/instalar-addon/');
    expect(r?.status()).toBe(200);
  });

  test('pré-preenche o URL a partir de ?url=', async ({ page }) => {
    await page.goto('/instalar-addon/?url=https%3A%2F%2Fexemplo.com%2Fmanifest.json');
    await expect(page.locator('#ia-inp-url')).toHaveValue('https://exemplo.com/manifest.json');
  });

  test('sem scroll horizontal no mobile', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vpWidth = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(vpWidth + 15);
  });

  test('toggle de plataforma Stremio/Nuvio presente', async ({ page }) => {
    await page.goto('/instalar-addon/');
    await expect(page.locator('#ia-platform-stremio')).toBeAttached();
    await expect(page.locator('#ia-platform-nuvio')).toBeAttached();
  });

});

test.describe('normalizeManifestUrl — validação do URL', () => {

  test('aceita https://.../manifest.json', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.normalizeManifestUrl('https://x.com/manifest.json'));
    expect(r.ok).toBe(true);
    expect(r.url).toBe('https://x.com/manifest.json');
  });

  test('converte stremio:// para https://', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.normalizeManifestUrl('stremio://x.com/manifest.json'));
    expect(r.ok).toBe(true);
    expect(r.url).toBe('https://x.com/manifest.json');
  });

  test('recusa http:// simples', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.normalizeManifestUrl('http://x.com/manifest.json'));
    expect(r.ok).toBe(false);
  });

  test('recusa esquemas arbitrários (file://, javascript:)', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r1 = await page.evaluate(() => (window as any).AddonInstaller.normalizeManifestUrl('file:///etc/passwd'));
    const r2 = await page.evaluate(() => (window as any).AddonInstaller.normalizeManifestUrl('javascript:alert(1)'));
    expect(r1.ok).toBe(false);
    expect(r2.ok).toBe(false);
  });

  test('recusa campo vazio', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.normalizeManifestUrl(''));
    expect(r.ok).toBe(false);
  });

});

test.describe('validateManifest — rejeita manifests inválidos', () => {

  test('aceita manifest com id/version/name/resources', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.validateManifest({ id: 'x', version: '1.0', name: 'X', resources: [] }));
    expect(r.ok).toBe(true);
  });

  test('rejeita manifest sem id', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.validateManifest({ version: '1.0', name: 'X', resources: [] }));
    expect(r.ok).toBe(false);
  });

  test('rejeita manifest sem resources', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.validateManifest({ id: 'x', version: '1.0', name: 'X' }));
    expect(r.ok).toBe(false);
  });

  test('rejeita null/não-objecto', async ({ page }) => {
    await page.goto('/instalar-addon/');
    const r = await page.evaluate(() => (window as any).AddonInstaller.validateManifest(null));
    expect(r.ok).toBe(false);
  });

});

test.describe('Botões "Instalar na minha conta" nos guias', () => {

  test('guia Cotonet tem o botão com URL correcto', async ({ page }) => {
    await page.goto('/guias/cotonet/');
    const link = page.locator('a[href*="/instalar-addon/?url="]');
    expect(await link.count()).toBeGreaterThanOrEqual(1);
    const href = await link.first().getAttribute('href');
    expect(decodeURIComponent(href || '')).toContain('cotonetnet-cotonet.hf.space/manifest.json');
  });

  test('guia Conteúdo PT tem botões para Animação PT-PT e PTGDrive', async ({ page }) => {
    await page.goto('/guias/conteudo-pt/');
    const links = page.locator('a[href*="/instalar-addon/?url="]');
    expect(await links.count()).toBeGreaterThanOrEqual(2);
  });

});
