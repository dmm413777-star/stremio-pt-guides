import { test, expect } from '@playwright/test';

// Persona: utilizador com problemas na conta que quer pedir ajuda no subreddit
// sem expor chaves/URLs privados sem querer

test.describe('Diagnóstico da conta — página e UI', () => {

  test('página /diagnostico/ carrega', async ({ page }) => {
    const r = await page.goto('/diagnostico/');
    expect(r?.status()).toBe(200);
  });

  test('tem toggle de plataforma e campos de login', async ({ page }) => {
    await page.goto('/diagnostico/');
    await expect(page.locator('#dg-platform-stremio')).toBeAttached();
    await expect(page.locator('#dg-platform-nuvio')).toBeAttached();
    await expect(page.locator('#dg-inp-email')).toBeVisible();
    await expect(page.locator('#dg-inp-pass')).toBeVisible();
  });

  test('texto deixa claro que só lê, nunca escreve', async ({ page }) => {
    await page.goto('/diagnostico/');
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/só lê/i);
  });

  test('link para Diagnóstico presente na homepage', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href*="diagnostico"]');
    expect(await link.count()).toBeGreaterThanOrEqual(1);
  });

  test('sem scroll horizontal no mobile', async ({ page }) => {
    await page.goto('/diagnostico/');
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const vpWidth = page.viewportSize()?.width ?? 390;
    expect(bodyWidth).toBeLessThanOrEqual(vpWidth + 15);
  });

});

test.describe('sanitizeReport — nunca expõe dados sensíveis', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/diagnostico/');
  });

  test('chave TorBox no path do addon nunca aparece no relatório', async ({ page }) => {
    const report = await page.evaluate(() => {
      const addons = [{
        manifest: { id: 'org.torrentio', name: 'Torrentio', version: '1.0.0' },
        transportUrl: 'https://torrentio.strem.fun/torbox=sk-live-abc123SECRETKEY456/manifest.json',
      }];
      return (window as any).AccountDiagnostico.sanitizeReport(addons, []);
    });
    expect(report).not.toContain('sk-live-abc123SECRETKEY456');
    expect(report).not.toContain('torbox=');
    expect(report).toContain('Torrentio');
  });

  test('config AIOStreams encriptada no path nunca aparece no relatório', async ({ page }) => {
    const report = await page.evaluate(() => {
      const addons = [{
        manifest: { id: 'aiostreams', name: 'AIOStreams PT', version: '2.0.0' },
        transportUrl: 'https://aiostreamsfortheweebs.midnightignite.me/stremio/114b7e39-4fa/eyJpIjoiL0tmUVlXakV2T1grWEQrVWtCRUh1UT09IiwiZSI6ImNZUGdpWEZpNXowL3pjaWJGUUJmL1NvUm53S1Yray93S1JYSFpUY3g0M0k9In0/manifest.json',
      }];
      return (window as any).AccountDiagnostico.sanitizeReport(addons, []);
    });
    expect(report).not.toContain('eyJpIjoi');
    expect(report).not.toContain('114b7e39-4fa');
    expect(report).toContain('aiostreamsfortheweebs.midnightignite.me');
  });

  test('domínio self-hosted/pessoal aparece como "instância privada", nunca o host real', async ({ page }) => {
    const report = await page.evaluate(() => {
      const addons = [{
        manifest: { id: 'meu.addon', name: 'O Meu Addon Caseiro', version: '1.0.0' },
        transportUrl: 'https://joao-silva-2024.duckdns.org/manifest.json',
      }];
      return (window as any).AccountDiagnostico.sanitizeReport(addons, []);
    });
    expect(report).not.toContain('joao-silva-2024');
    expect(report).not.toContain('duckdns.org');
    expect(report).toContain('instância privada');
  });

  test('nunca contém authKey, password, email ou ID de perfil', async ({ page }) => {
    const report = await page.evaluate(() => {
      const addons = [{
        manifest: { id: 'x', name: 'X', version: '1.0' },
        transportUrl: 'https://aiometadata.elfhosted.com/manifest.json',
      }];
      // Simula issues que poderiam (erradamente) incluir dados sensíveis
      const issues = [{ severity: 'erro', message: 'X não respondeu — pode ser bloqueio do teu operador, não necessariamente um problema do addon.' }];
      return (window as any).AccountDiagnostico.sanitizeReport(addons, issues);
    });
    expect(report).not.toMatch(/@[\w.-]+\.\w+/); // nenhum email
    expect(report).not.toMatch(/authKey|access_token/i);
  });

  test('host de instância pública conhecida aparece normalmente', async ({ page }) => {
    const report = await page.evaluate(() => {
      const addons = [{
        manifest: { id: 'aio-metadata', name: 'AIOMetadata PT', version: '3.8.3' },
        transportUrl: 'https://aiometadata.elfhosted.com/stremio/abc-def-123/manifest.json',
      }];
      return (window as any).AccountDiagnostico.sanitizeReport(addons, []);
    });
    expect(report).toContain('aiometadata.elfhosted.com');
    expect(report).not.toContain('abc-def-123');
  });

});

test.describe('analyzeAddons — detecção de problemas', () => {

  // Nestes testes mocka-se fetch para não depender de rede real nem esperar timeouts —
  // o foco é a lógica de detecção, não a verificação de manifests ao vivo.
  test('detecta addons duplicados pelo mesmo manifest.id como aviso', async ({ page }) => {
    await page.goto('/diagnostico/');
    const issues = await page.evaluate(async () => {
      (window as any).fetch = async () => ({ ok: true, json: async () => ({}) });
      const addons = [
        { manifest: { id: 'com.linvo.cinemeta', name: 'Cinemeta' }, transportUrl: 'https://v3-cinemeta.strem.io/manifest.json' },
        { manifest: { id: 'com.linvo.cinemeta', name: 'Cinemeta PT' }, transportUrl: 'https://toast-translator.elfhosted.com/x/manifest.json' },
      ];
      return (window as any).AccountDiagnostico.analyzeAddons(addons, { concurrency: 1 });
    });
    const dup = issues.find((i: any) => i.type === 'duplicado');
    expect(dup).toBeTruthy();
    expect(dup.severity).toBe('aviso');
  });

  test('detecta Cinemeta presente sem tratamento', async ({ page }) => {
    await page.goto('/diagnostico/');
    const issues = await page.evaluate(async () => {
      (window as any).fetch = async () => ({ ok: true, json: async () => ({}) });
      const addons = [{ manifest: { id: 'com.linvo.cinemeta', name: 'Cinemeta' }, transportUrl: 'https://v3-cinemeta.strem.io/manifest.json' }];
      return (window as any).AccountDiagnostico.analyzeAddons(addons, { concurrency: 1 });
    });
    const cinemeta = issues.find((i: any) => i.type === 'cinemeta');
    expect(cinemeta).toBeTruthy();
    expect(cinemeta.link).toBe('/cinemeta-pt/');
  });

  test('conta limpa sem duplicados não gera falsos positivos de duplicado', async ({ page }) => {
    await page.goto('/diagnostico/');
    const issues = await page.evaluate(async () => {
      (window as any).fetch = async () => ({ ok: true, json: async () => ({}) });
      const addons = [
        { manifest: { id: 'a', name: 'A' }, transportUrl: 'https://a.example.com/manifest.json' },
        { manifest: { id: 'b', name: 'B' }, transportUrl: 'https://b.example.com/manifest.json' },
      ];
      return (window as any).AccountDiagnostico.analyzeAddons(addons, { concurrency: 1 });
    });
    expect(issues.find((i: any) => i.type === 'duplicado')).toBeFalsy();
  });

});
