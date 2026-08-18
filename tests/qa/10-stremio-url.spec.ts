import { test, expect } from '@playwright/test';

const QS_URL = '/tools/quickstart/';

test.describe('Tomás — utilizador que clica para abrir o Stremio', () => {

  test('nenhum link no QuickStart aponta para app.strem.io (versão descontinuada)', async ({ page }) => {
    await page.goto(QS_URL);
    // Inclui o código JS inlinado — web.stremio.com está no JS como string
    const html = await page.content();
    expect(html).not.toContain('app.strem.io');
  });

  test('o código-fonte do QuickStart referencia web.stremio.com', async ({ page }) => {
    await page.goto(QS_URL);
    const html = await page.content();
    expect(html).toContain('web.stremio.com');
  });

  test('nenhuma página principal tem href para app.strem.io', async ({ page }) => {
    const badUrls: string[] = [];

    for (const path of ['/', '/tools/quickstart/']) {
      await page.goto(path);
      const links = await page.locator('a[href*="strem.io"]').all();
      for (const link of links) {
        const href = await link.getAttribute('href') ?? '';
        if (href.includes('app.strem.io')) badUrls.push(`${path}: ${href}`);
      }
    }

    expect(badUrls, `URLs descontinuados:\n${badUrls.join('\n')}`).toHaveLength(0);
  });

  test('nenhuma página de guia referencia app.strem.io em links visíveis', async ({ page }) => {
    const guias = ['/guias/aiostreams-tamtaro', '/guias/torbox', '/guias/comecar-aqui'];
    const badUrls: string[] = [];

    for (const path of guias) {
      const res = await page.goto(path);
      if (res?.status() !== 200) continue;
      const links = await page.locator('a[href*="strem.io"]').all();
      for (const link of links) {
        const href = await link.getAttribute('href') ?? '';
        if (href.includes('app.strem.io')) badUrls.push(`${path}: ${href}`);
      }
    }

    expect(badUrls, `Links descontinuados em guias:\n${badUrls.join('\n')}`).toHaveLength(0);
  });

});
