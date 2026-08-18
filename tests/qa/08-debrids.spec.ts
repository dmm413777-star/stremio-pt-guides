import { test, expect } from '@playwright/test';

const QS_URL = '/tools/quickstart/';

// As pills do seletor de debrid estão dentro de #qs-card-pack.inactive que tem
// pointer-events:none — usamos page.evaluate() para invocar selectDebridService()
// directamente em vez de .click(), que ficaria bloqueado pelo overlay.
async function selectDebrid(page: any, svc: string) {
  await page.evaluate((s: string) => { (window as any).selectDebridService(s); }, svc);
}

test.describe('Rodrigo — utilizador Real-Debrid a explorar opções', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(QS_URL);
  });

  test('seletor de debrids tem 4 pills', async ({ page }) => {
    const pills = page.locator('.qs-svc-pill');
    await expect(pills).toHaveCount(4);
  });

  test('TorBox está activo por defeito', async ({ page }) => {
    const activePill = page.locator('.qs-svc-pill.active');
    await expect(activePill).toBeVisible();
    const text = await activePill.textContent();
    expect(text).toContain('TorBox');
  });

  test('TorBox tem badge "Rec." visível', async ({ page }) => {
    const torboxLabel = page.locator('#qs-svc-label-torbox');
    await expect(torboxLabel).toBeVisible();
    const html = await torboxLabel.innerHTML();
    expect(html).toMatch(/Rec\./);
  });

  test('só TorBox tem link de referral', async ({ page }) => {
    const referralLinks = page.locator('a[href*="referral=444bd704"]');
    await expect(referralLinks.first()).toBeVisible();
    const count = await referralLinks.count();
    expect(count).toBe(1);
  });

  test('Real-Debrid — placeholder actualiza ao seleccionar', async ({ page }) => {
    await selectDebrid(page, 'realdebrid');
    const placeholder = await page.locator('#qs-debrid-key').getAttribute('placeholder') ?? '';
    expect(placeholder).toMatch(/[Rr]eal.?[Dd]ebrid/);
  });

  test('AllDebrid — placeholder actualiza ao seleccionar', async ({ page }) => {
    await selectDebrid(page, 'alldebrid');
    const placeholder = await page.locator('#qs-debrid-key').getAttribute('placeholder') ?? '';
    expect(placeholder).toMatch(/[Aa]ll.?[Dd]ebrid/);
  });

  test('Premiumize — placeholder actualiza ao seleccionar', async ({ page }) => {
    await selectDebrid(page, 'premiumize');
    const placeholder = await page.locator('#qs-debrid-key').getAttribute('placeholder') ?? '';
    expect(placeholder).toMatch(/[Pp]remiumize/);
  });

  test('Real-Debrid, AllDebrid e Premiumize não têm link de referral', async ({ page }) => {
    for (const svc of ['realdebrid', 'alldebrid', 'premiumize']) {
      await selectDebrid(page, svc);
      const count = await page.locator('a[href*="referral"]').count();
      expect(count, `${svc} não devia ter referral link`).toBe(0);
    }
  });

  test('campo limpa ao mudar de serviço', async ({ page }) => {
    await selectDebrid(page, 'realdebrid');
    await page.locator('#qs-debrid-key').fill('FAKE_RD_KEY_TEST');
    await selectDebrid(page, 'torbox');
    const value = await page.locator('#qs-debrid-key').inputValue();
    expect(value, 'Campo não limpou ao mudar de debrid').toBe('');
  });

  test('cada debrid tem link "Obter" com href válido', async ({ page }) => {
    const debrids: Array<{ svc: string; pattern: RegExp }> = [
      { svc: 'realdebrid',  pattern: /real-debrid\.com/ },
      { svc: 'alldebrid',   pattern: /alldebrid\.com/ },
      { svc: 'premiumize',  pattern: /premiumize\.me/ },
    ];

    for (const { svc, pattern } of debrids) {
      await selectDebrid(page, svc);
      const link = page.locator('#qs-debrid-links a[target="_blank"]').first();
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href') ?? '';
      expect(href, `${svc} sem link de API key válido`).toMatch(pattern);
    }
  });

  test('ao voltar para TorBox, link de referral volta a aparecer', async ({ page }) => {
    await selectDebrid(page, 'realdebrid');
    expect(await page.locator('a[href*="referral"]').count()).toBe(0);
    await selectDebrid(page, 'torbox');
    expect(await page.locator('a[href*="referral=444bd704"]').count()).toBe(1);
  });

  test('mobile — pills não causam scroll horizontal em 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(QS_URL);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(405);
  });

});
