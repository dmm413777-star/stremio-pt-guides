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

  test('Netflix, Disney+, Amazon Prime Latest continuam na config (fora da home desde a ronda 4)', async ({ page }) => {
    const html = await page.content();
    // Ronda 4, item 5: estes catálogos mdblist.* "Latest" ficaram fora da home
    // (showInHome:false) porque o streaming.* equivalente já cobre a mesma
    // plataforma na home — mas continuam disponíveis no Discover.
    const idsStillPresent = [
      'mdblist.86751', // Netflix Latest series
      'mdblist.88328', // Netflix Latest movie
      'mdblist.86758', // Disney+ Latest series
      'mdblist.86759', // Disney+ Latest movie
      'mdblist.86753', // Amazon Prime Latest series
      'mdblist.86755', // Amazon Prime Latest movie
    ];
    for (const id of idsStillPresent) {
      expect(html, `${id} devia continuar na config`).toContain(id);
    }
  });

  test('Netflix, Disney+, Prime Video, Max, SkyShowtime (tmdb.discover streaming PT) têm showInHome:true na home', async ({ page }) => {
    // Ronda "beta" item 3: os catálogos streaming.* nativos do AIOMetadata têm
    // país fixo (nunca PT) no código do próprio addon — substituídos por
    // catálogos tmdb.discover.* com watch_region:'PT'. Ver quickstart.html.
    const html = await page.content();
    for (const slug of ['streaming_netflix_8', 'streaming_disney_337', 'streaming_prime_9', 'streaming_max_1899', 'streaming_skyshowtime_1773']) {
      // cada slug aparece 2x (movie+series); confirmar que nenhuma das duas está showInHome:false
      const re = new RegExp(`id:'tmdb\\.discover\\.(movie|series)\\.${slug}'[^}]*showInHome:false`);
      expect(html, `${slug} não devia ter showInHome:false`).not.toMatch(re);
      expect(html).toContain(slug);
    }
  });

  test('catálogos de streaming PT usam watch_region:\'PT\'', async ({ page }) => {
    const html = await page.content();
    for (const slug of ['streaming_netflix_8', 'streaming_disney_337', 'streaming_prime_9', 'streaming_max_1899', 'streaming_skyshowtime_1773', 'streaming_appletv_350']) {
      const re = new RegExp(`id:'tmdb\\.discover\\.movie\\.${slug}'[\\s\\S]{0,500}watch_region:'PT'`);
      expect(html, `${slug} devia usar watch_region:'PT'`).toMatch(re);
    }
  });

  test('Apple TV+ (streaming PT) fica fora da home mas continua no Discover', async ({ page }) => {
    const html = await page.content();
    const re = new RegExp(`id:'tmdb\\.discover\\.(movie|series)\\.streaming_appletv_350'[^}]*showInHome:true`);
    expect(html, 'Apple TV+ não devia ter showInHome:true').not.toMatch(re);
    expect(html).toContain('streaming_appletv_350');
  });

  test('home da AIOMetadata reduzida a ~20 catálogos (ronda 4, item 5)', async ({ page }) => {
    const html = await page.content();
    const trueCount = (html.match(/showInHome:true/g) || []).length;
    expect(trueCount).toBeLessThanOrEqual(20);
    expect(trueCount).toBeGreaterThan(0);
  });

  test('Hulu Latest fica desligado (enabled:false) — não disponível em Portugal', async ({ page }) => {
    const html = await page.content();
    expect(html).toMatch(/id:'mdblist\.88327'[^}]*enabled:false/);
    expect(html).toMatch(/id:'mdblist\.88326'[^}]*enabled:false/);
  });

  test('Max (HBO) e SkyShowtime aparecem nas plataformas de streaming', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('streaming_max_1899');
    expect(html).toContain('streaming_skyshowtime_1773');
  });

  // ── Anti-regressão: sem "max descriptor size" ────────────────────────────────

  test('qsSetAddons helper existe e guarda sem manifests', async ({ page, request }) => {
    const html = await page.content();
    // Verificar que o helper qsSetAddons existe e delega na API partilhada
    expect(html).toContain('qsSetAddons');
    expect(html).toContain('StremioAPI.setAddons');
    // addonCollectionSet vive só no módulo partilhado (static/js/conta/stremio-api.js),
    // não deve haver nenhuma chamada directa inline no shortcode
    expect(html).not.toContain('addonCollectionSet');
    const jsRes = await request.get('/js/conta/stremio-api.js');
    const js = await jsRes.text();
    // Só 1 chamada real (fetch) — ignora menções em comentários
    const callMatches = js.match(/fetch\(`\$\{STREMIO_API\}\/addonCollectionSet`/g) || [];
    expect(callMatches.length, 'Só 1 chamada fetch a addonCollectionSet no módulo partilhado').toBe(1);
  });

  test('urlOrigin helper existe para deduplicação sem manifest', async ({ page }) => {
    const html = await page.content();
    expect(html).toContain('urlOrigin');
  });

  test('AIOMetadata inserido no início (unshift) — catálogos no topo do Stremio', async ({ page }) => {
    const html = await page.content();
    // Verificar padrão: { transportUrl: aioMetaUrl, ..., manifest }, ...workingAddons (unshift para posição 0)
    expect(html).toMatch(/transportUrl: aioMetaUrl.*\}.*\.\.\.(workingAddons)/s);
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
