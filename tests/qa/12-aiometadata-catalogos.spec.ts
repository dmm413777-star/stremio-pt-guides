import { test, expect } from '@playwright/test';

// Persona: Filipe, 41 anos, Braga — quer HBO Max, Paramount+ e Apple TV+ nos catálogos

test.describe('Filipe — catalólogo AIOMetadata completo (Tam-Taro template)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── Config: 60 catálogos Tam-Taro + 12 JustWatch streaming = 72 ─────────────

  test('buildAIOMetadataConfig tem pelo menos 60 catálogos (base Tam-Taro)', async ({ page }) => {
    await page.goto('/');
    const count = await page.evaluate(() => {
      // @ts-ignore
      if (typeof buildAIOMetadataConfig === 'undefined') return -1;
      // @ts-ignore
      return buildAIOMetadataConfig().catalogs.length;
    });
    // Se a função não é global (dentro de IIFE) testar pelo HTML
    if (count === -1) {
      const html = await page.content();
      // Contar entradas de catálogo na função buildAIOMetadataConfig
      const matches = html.match(/id:'mdblist\.|id:'tmdb\.|id:'tvdb\.|id:'streaming\./g) || [];
      expect(matches.length, 'Catálogos no buildAIOMetadataConfig').toBeGreaterThanOrEqual(60);
    } else {
      expect(count).toBeGreaterThanOrEqual(60);
    }
  });

  test('Hulu Latest está na config (mdblist.88327 + mdblist.88326)', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('mdblist.88327');
    expect(html).toContain('mdblist.88326');
    expect(html).toContain('Hulu Latest');
  });

  test('Paramount+ Latest está na config (mdblist.86761 + mdblist.86762)', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('mdblist.86761');
    expect(html).toContain('mdblist.86762');
    expect(html).toContain('Paramount+');
  });

  test('HBO Max Latest está na config (mdblist.89649 + mdblist.89647)', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('mdblist.89649');
    expect(html).toContain('mdblist.89647');
    expect(html).toContain('HBO Max');
  });

  test('Netflix, Disney+, Amazon Prime, Apple TV+ Latest têm showInHome:true', async ({ page }) => {
    const html = await page.content();
    // Verificar que os IDs correctos existem com showInHome:true
    const idsTruePattern = [
      'mdblist.86751', // Netflix Latest series
      'mdblist.88328', // Netflix Latest movie
      'mdblist.86758', // Disney+ Latest series
      'mdblist.86759', // Disney+ Latest movie
      'mdblist.86753', // Amazon Prime Latest series
      'mdblist.86755', // Amazon Prime Latest movie
      'mdblist.88319', // Apple TV+ Latest series
      'mdblist.88317', // Apple TV+ Latest movie
    ];
    for (const id of idsTruePattern) {
      expect(html, `${id} devia estar na config`).toContain(id);
    }
    // Verificar que não há nenhum destes IDs com showInHome:false
    expect(html).not.toMatch(/mdblist\.(86751|88328|86758|86759|86753|86755|88319|88317)[^}]+showInHome:false/);
  });

  test('Max (HBO) e SkyShowtime aparecem nas plataformas de streaming', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('streaming.hbm');
    expect(html).toContain('streaming.sst');
  });

  // ── Anti-regressão: sem "max descriptor size" ────────────────────────────────

  test('qsSetAddons helper existe e guarda sem manifests', async ({ page }) => {
    const html = await page.content();
    // Verificar que o helper qsSetAddons existe
    expect(html).toContain('qsSetAddons');
    // Verificar que NÃO há calls directos a addonCollectionSet fora do helper
    // (deve haver exactamente 1 — dentro do helper)
    const matches = html.match(/addonCollectionSet/g) || [];
    expect(matches.length, 'Só 1 addonCollectionSet (dentro do helper)').toBe(1);
  });

  test('urlOrigin helper existe para deduplicação sem manifest', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('urlOrigin');
  });

  test('AIOMetadata inserido no início (unshift) — catálogos no topo do Stremio', async ({ page }) => {
    const html = await page.content();
    // Verificar padrão: { transportUrl: aioMetaUrl, transportName: 'http', flags: {} }, ...workingAddons
    expect(html).toMatch(/transportUrl: aioMetaUrl.*transportName: 'http'.*flags: \{\} \}.*\.\.\.workingAddons/s);
  });

  // ── Guia AIOMetadata actualizado ────────────────────────────────────────────

  test('guia /guias/aiometadata/ menciona Max (HBO)', async ({ page }) => {
    await page.goto('/guias/aiometadata/');
    const body = await page.locator('body').textContent() ?? '';
    expect(body).toMatch(/Max|HBO/);
  });

  test('guia /guias/aiometadata/ menciona SkyShowtime ou Paramount+', async ({ page }) => {
    await page.goto('/guias/aiometadata/');
    const body = await page.locator('body').textContent() ?? '';
    expect(body).toMatch(/SkyShowtime|Paramount/);
  });

  test('guia /guias/aiometadata/ menciona Apple TV+', async ({ page }) => {
    await page.goto('/guias/aiometadata/');
    const body = await page.locator('body').textContent() ?? '';
    expect(body).toMatch(/Apple TV\+|Apple TV/);
  });

});
