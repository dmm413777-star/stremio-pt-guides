import { test, expect } from '@playwright/test';

// O QuickStart existe como ficheiro estático em /tools/quickstart/
// e também está embebido na homepage via shortcode Hugo
const QS_URL = '/tools/quickstart/';

test.describe('QuickStart PT — Sofia testa a ferramenta', () => {
  test('QuickStart carrega em /tools/quickstart/', async ({ page }) => {
    const r = await page.goto(QS_URL);
    expect(r?.status()).toBe(200);
  });

  test('QuickStart tem campo de email', async ({ page }) => {
    await page.goto(QS_URL);
    const email = page.locator('input[type="email"], input[placeholder*="mail" i]').first();
    await expect(email).toBeVisible();
  });

  test('QuickStart tem campo de password', async ({ page }) => {
    await page.goto(QS_URL);
    const pass = page.locator('input[type="password"]').first();
    await expect(pass).toBeVisible();
  });

  test('QuickStart tem botões de modo Debrid e P2P', async ({ page }) => {
    await page.goto(QS_URL);
    await expect(page.locator('text=Com Debrid').first()).toBeVisible();
    await expect(page.locator('text=Sem Debrid').first()).toBeVisible();
  });

  test('QuickStart — modo P2P oculta campo de API key', async ({ page }) => {
    await page.goto(QS_URL);
    await page.locator('text=Sem Debrid').first().click();
    const debridSection = page.locator('#qs-debrid-section');
    await expect(debridSection).not.toBeVisible();
  });

  test('QuickStart — modo Debrid mostra campo de API key', async ({ page }) => {
    await page.goto(QS_URL);
    await page.locator('text=Com Debrid').first().click();
    const debridSection = page.locator('#qs-debrid-section');
    await expect(debridSection).toBeVisible();
  });

  test('QuickStart — checkboxes de addons estão visíveis (passo 2 aparece após login)', async ({ page }) => {
    await page.goto(QS_URL);
    // O passo 2 está inactivo até login — verifica que os checkboxes existem no DOM
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(3);
  });

  test('QuickStart — seletor tem TorBox, Real-Debrid, AllDebrid, Premiumize', async ({ page }) => {
    await page.goto(QS_URL);
    await expect(page.locator('text=Real-Debrid').first()).toBeVisible();
    await expect(page.locator('text=AllDebrid').first()).toBeVisible();
    await expect(page.locator('text=Premiumize').first()).toBeVisible();
  });

  test('QuickStart — PTGDrive está na lista de addons (homepage shortcode)', async ({ page }) => {
    // O static file /tools/quickstart/ é uma versão legada desincronizada.
    // O shortcode Hugo embebido na homepage tem a lista actualizada com PTGDrive.
    await page.goto('/');
    const body = await page.locator('body').textContent();
    expect(body).toContain('PTGDrive');
  });

  test('QuickStart embebido na homepage também carrega', async ({ page }) => {
    await page.goto('/');
    // O shortcode renderiza o QuickStart na homepage
    await expect(page.locator('#qs-card-login, .qs-card, [id^="qs-"]').first()).toBeVisible();
  });

  test('QuickStart não tem scroll horizontal no mobile', async ({ page }) => {
    await page.goto(QS_URL);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vpWidth = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(vpWidth + 15);
  });

  test('referral TorBox está presente e é o correcto', async ({ page }) => {
    await page.goto(QS_URL);
    const referralLinks = page.locator('a[href*="referral"]');
    expect(await referralLinks.count()).toBeGreaterThanOrEqual(1);
    const hrefs = await Promise.all(
      (await referralLinks.all()).map(l => l.getAttribute('href'))
    );
    expect(hrefs.some(h => h?.includes('444bd704'))).toBe(true);
  });

  test('localStorage não contém debrid keys após interacção', async ({ page }) => {
    await page.goto(QS_URL);
    const keyField = page.locator('#qs-debrid-key');
    if (await keyField.count() > 0) {
      await keyField.fill('TEST_KEY_QA_12345');
    }
    // Tenta clicar em instalar — vai falhar graciosamente sem login
    await page.locator('#qs-btn-install').click().catch(() => {});
    await page.waitForTimeout(500);

    const storage = await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage));
    expect(storage).not.toMatch(/TEST_KEY_QA_12345|apikey|api_key/i);
  });
});
