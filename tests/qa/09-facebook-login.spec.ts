import { test, expect } from '@playwright/test';

const QS_URL = '/tools/quickstart/';

test.describe('Margarida — utilizadora com conta Facebook sem password Stremio', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(QS_URL);
  });

  test('existe indicação para utilizadores com conta Facebook', async ({ page }) => {
    const html = await page.content();
    expect(html).toMatch(/[Ff]acebook/);
  });

  test('aviso Facebook é um accordion fechado por defeito', async ({ page }) => {
    const details = page.locator('details.fb-hint');
    await expect(details).toBeVisible();
    const isOpen = await details.getAttribute('open');
    expect(isOpen).toBeNull();
  });

  test('Margarida clica no accordion e vê as instruções', async ({ page }) => {
    const summary = page.locator('details.fb-hint summary');
    await expect(summary).toBeVisible();
    await summary.click();

    const details = page.locator('details.fb-hint');
    const content = await details.textContent() ?? '';
    expect(content).toMatch(/reset.password|stremio\.com\/reset/i);
  });

  test('link reset-password abre em tab nova', async ({ page }) => {
    // Abre o accordion para tornar o link acessível
    await page.locator('details.fb-hint summary').click();

    const link = page.locator('a[href*="reset-password"]').first();
    await expect(link).toBeVisible();

    const href = await link.getAttribute('href') ?? '';
    expect(href).toContain('stremio.com/reset-password');

    const target = await link.getAttribute('target');
    expect(target).toBe('_blank');
  });

  test('não existe botão de login directo com Facebook (sem OAuth)', async ({ page }) => {
    const fbBtn = page.locator(
      'button:has-text("Facebook"), a:has-text("Login com Facebook"), [class*="facebook-btn"]'
    );
    expect(await fbBtn.count()).toBe(0);
  });

  test('instrução menciona que conta e addons ficam intactos', async ({ page }) => {
    await page.locator('details.fb-hint summary').click();
    const content = await page.locator('details.fb-hint').textContent() ?? '';
    expect(content).toMatch(/intactos?/i);
  });

  test('accordion não bloqueia o formulário de login principal', async ({ page }) => {
    const emailField = page.locator('#qs-inp-email');
    const passField  = page.locator('#qs-inp-pass');
    await expect(emailField).toBeVisible();
    await expect(passField).toBeVisible();
  });

  test('accordion está na card de login, não na de instalação', async ({ page }) => {
    const loginCard = page.locator('#qs-card-login');
    const hint = loginCard.locator('details.fb-hint');
    await expect(hint).toBeVisible();
  });

});
