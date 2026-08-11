import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('título contém "Stremio PT"', async ({ page }) => {
    await expect(page).toHaveTitle(/Stremio PT/);
  });

  test('navbar tem links Guias e Links', async ({ page }) => {
    const guias = page.getByRole('link', { name: 'Guias' }).first();
    const links = page.getByRole('link', { name: 'Links' }).first();
    await expect(guias).toBeVisible();
    await expect(links).toBeVisible();
  });

  test('brand/logo da navbar leva à homepage', async ({ page }) => {
    // Hextra usa <nav>, não <header> — o brand é o primeiro link da nav principal
    const brand = page.locator('nav a').first();
    await expect(brand).toBeVisible();
    const href = await brand.getAttribute('href');
    // Deve apontar para a raiz
    expect(href === '/' || href === '' || href?.endsWith('/')).toBeTruthy();
  });

  test('stepper "Instalar Pack PT em 3 Passos" visível', async ({ page }) => {
    await expect(page.getByText('Instalar Pack PT em 3 Passos')).toBeVisible();
  });

  test('os 3 passos do stepper existem no DOM', async ({ page }) => {
    // Os labels dos passos estão dentro do widget #qs-widget — podem estar fora do viewport
    const widget = page.locator('#qs-widget');
    await expect(widget).toBeAttached();
    const html = await widget.innerHTML();
    expect(html).toContain('Login');
    expect(html).toContain('Pack');
    // "Instalação" com acento — verifica ambas as formas
    expect(html.includes('Instala') || html.includes('Instalação')).toBeTruthy();
  });

  test('toggle de tema existe no DOM', async ({ page }) => {
    // Hextra tema toggle — pode ser button, select ou div com atributo data-theme
    const toggle = page.locator('button:has-text("Dark"), button:has-text("Light"), button:has-text("System"), [data-theme]').first();
    await expect(toggle).toBeAttached();
  });
});
