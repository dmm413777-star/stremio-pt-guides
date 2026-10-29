import { test, expect } from '@playwright/test';

// Persona: utilizador que quer instalar o pack PT numa conta Nuvio em vez de Stremio

test.describe('Toggle Stremio/Nuvio — instalação na plataforma escolhida', () => {

  test('QuickStart tem toggle de plataforma Stremio/Nuvio', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#qs-platform-stremio')).toBeAttached();
    await expect(page.locator('#qs-platform-nuvio')).toBeAttached();
  });

  test('Stremio está seleccionado por defeito', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#qs-platform-stremio')).toHaveClass(/active/);
    await expect(page.locator('#qs-login-title')).toHaveText('Login Stremio');
  });

  test('clicar em Nuvio muda o título e info-box', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => (window as any).qsSetPlatform('nuvio'));
    await expect(page.locator('#qs-platform-nuvio')).toHaveClass(/active/);
    await expect(page.locator('#qs-login-title')).toHaveText('Login Nuvio');
    const html = await page.content();
    expect(html).toContain('api.nuvio.tv');
  });

  test('hint de Facebook fica oculto em modo Nuvio', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => (window as any).qsSetPlatform('nuvio'));
    await expect(page.locator('#qs-fb-hint')).toBeHidden();
  });

  test('voltar a Stremio restaura o título original', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => (window as any).qsSetPlatform('nuvio'));
    await page.evaluate(() => (window as any).qsSetPlatform('stremio'));
    await expect(page.locator('#qs-login-title')).toHaveText('Login Stremio');
    await expect(page.locator('#qs-fb-hint')).toBeVisible();
  });

  test('código-fonte referencia api.nuvio.tv e sync_push_addons (RPC Nuvio)', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).toContain('api.nuvio.tv');
    expect(html).toContain('sync_push_addons');
    expect(html).toContain('sync_pull_profiles');
  });

});
