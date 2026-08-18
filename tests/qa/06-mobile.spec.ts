import { test, expect } from '@playwright/test';

// Estes testes correm nos 3 projectos: Desktop Chrome, Mobile Safari, Mobile Chrome
test.describe('Responsividade mobile — Beatriz e Carlos no telemóvel', () => {
  test('Homepage sem scroll horizontal', async ({ page }) => {
    await page.goto('/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vp = page.viewportSize()?.width ?? 390;
    expect(bodyWidth, `Scroll horizontal: body=${bodyWidth}px, viewport=${vp}px`)
      .toBeLessThanOrEqual(vp + 10);
  });

  test('Página de guia sem scroll horizontal', async ({ page }) => {
    await page.goto('/guias/faq');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vp = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(vp + 15);
  });

  test('QuickStart sem scroll horizontal', async ({ page }) => {
    await page.goto('/tools/quickstart/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vp = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(vp + 15);
  });

  test('Font-size base >= 14px', async ({ page }) => {
    await page.goto('/');
    const size = await page.evaluate(() =>
      parseFloat(getComputedStyle(document.body).fontSize)
    );
    expect(size, `Font-size demasiado pequeno: ${size}px`).toBeGreaterThanOrEqual(14);
  });

  test('Imagens têm max-width 100% (não saem do ecrã)', async ({ page }) => {
    await page.goto('/guias/aiostreams-tamtaro');
    const overflow = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const vw = window.innerWidth;
      return imgs.filter(img => img.getBoundingClientRect().right > vw + 5).map(img => img.src);
    });
    expect(overflow, `Imagens fora do ecrã: ${overflow.join(', ')}`).toHaveLength(0);
  });
});
