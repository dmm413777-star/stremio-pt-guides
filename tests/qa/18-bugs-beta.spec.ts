import { test, expect, Page } from '@playwright/test';

// Verificação dos 4 "bugs da beta" listados em docs/decisoes-duck-tools.md.
// #1 e #2 têm testes de regressão reais; #3 e #4 ficam fechados com justificação.

async function mockStremioApi(page: Page, opts: { kidsFails: boolean }) {
  let existingAddons: any[] = [];

  await page.route('**/api.strem.io/api/login', route =>
    route.fulfill({ json: { result: { authKey: 'TEST_AUTHKEY' } } }));

  await page.route('**/api.strem.io/api/addonCollectionGet', route =>
    route.fulfill({ json: { result: { addons: existingAddons } } }));

  await page.route('**/api.strem.io/api/addonCollectionSet', async route => {
    const body = route.request().postDataJSON();
    existingAddons = body.addons;
    await route.fulfill({ json: { result: {} } });
  });

  await page.route('**/tvs-de-portugal.fly.dev/kids/manifest.json', route => {
    if (opts.kidsFails) {
      route.fulfill({ status: 503, body: 'offline' });
    } else {
      route.fulfill({ json: { id: 'com.tugakids.stremio', name: 'CotonetKids', version: '1.0.0', resources: [], types: [], catalogs: [] } });
    }
  });

  // Toast Translator: o Worker devolve o URL já com a chave, e o manifest responde
  await page.route(/aiostreams-pt-proxy\.mire-freckle\.workers\.dev/, route =>
    route.fulfill({ json: { success: true, manifestUrl: 'https://toast-translator.elfhosted.com/teste/manifest.json' } }));

  await page.route('**/toast-translator.elfhosted.com/**', route =>
    route.fulfill({ json: { id: 'toast.translator', name: 'Toast Translator', version: '1.0.0', resources: [], types: [], catalogs: [] } }));
}

// Os dois addons do pack que não precisam de chaves nem de contas: o CotonetKids
// (instala-se só com fetch do manifest + addonCollectionSet) e o Toast Translator
// (que pede o URL ao Worker, mockado acima). Evita os fluxos do AIOStreams,
// AIOMetadata e SubMaker, que dependem de serviços externos não mockados aqui.
async function loginAndSelectKidsAndToast(page: Page) {
  await page.goto('/');
  await page.fill('#qs-inp-email', 'teste@example.com');
  await page.fill('#qs-inp-pass', 'password123');
  await page.click('#qs-btn-login');
  await expect(page.locator('#qs-login-status')).toContainText('Conta verificada', { timeout: 10000 });

  // O passo 2 fica com pointer-events:none até ao login, e os checkboxes reais
  // são display:none (caixa visual é um <div> irmão) — marca-se/desmarca-se via
  // JS directamente, disparando 'change' para o listener do item reagir, tal
  // como os outros testes desta suite já fazem para este widget.
  const set = (ids: string[], checked: boolean) => page.evaluate(({ ids, checked }) => {
    ids.forEach(id => {
      const el = document.getElementById('qs-chk-' + id) as HTMLInputElement;
      if (el && el.checked !== checked) {
        el.checked = checked;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }, { ids, checked });
  await set(['aiostreams', 'aiometadata', 'submaker'], false);
  // O Toast vem desmarcado por defeito
  await set(['toast'], true);
  for (const id of ['cotonetkids', 'toast']) {
    await expect(page.locator('#qs-chk-' + id)).toBeChecked();
  }
}

test.describe('Bug beta #1 — "Tentar Falhados" só reenvia os que falharam', () => {

  test('instalação parcial: só o addon que falha fica com erro, o outro conclui', async ({ page }) => {
    await mockStremioApi(page, { kidsFails: true });
    await loginAndSelectKidsAndToast(page);

    await page.click('#qs-btn-install');
    await expect(page.locator('#qs-install-badge')).toContainText('Parcial', { timeout: 15000 });

    const rows = page.locator('.progress-item');
    await expect(rows.filter({ hasText: 'Toast Translator' })).toHaveClass(/done/);
    await expect(rows.filter({ hasText: 'CotonetKids' })).toHaveClass(/err/);
  });

  test('"Tentar Falhados" marca só o addon falhado, desmarca os concluídos', async ({ page }) => {
    await mockStremioApi(page, { kidsFails: true });
    await loginAndSelectKidsAndToast(page);

    await page.click('#qs-btn-install');
    await expect(page.locator('#qs-install-badge')).toContainText('Parcial', { timeout: 15000 });

    await page.click('text=↺ Tentar falhados');

    await expect(page.locator('#qs-chk-cotonetkids')).toBeChecked();
    await expect(page.locator('#qs-chk-toast')).not.toBeChecked();
  });

  test('regressão: reinstalar após "Tentar Falhados" só pede o manifest do addon que falhou', async ({ page }) => {
    await mockStremioApi(page, { kidsFails: true });
    await loginAndSelectKidsAndToast(page);

    await page.click('#qs-btn-install');
    await expect(page.locator('#qs-install-badge')).toContainText('Parcial', { timeout: 15000 });
    await page.click('text=↺ Tentar falhados');

    // A partir daqui, só o CotonetKids está seleccionado — contamos os pedidos
    // feitos durante o 2º "Instalar Agora". Se o bug reportado ("reinstala
    // tudo") existisse, veríamos pedidos ao Toast Translator também.
    const requestedUrls: string[] = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('tvs-de-portugal') || url.includes('toast-translator') || url.includes('aiostreams-pt-proxy')) {
        requestedUrls.push(url);
      }
    });

    await mockStremioApi(page, { kidsFails: false }); // desta vez o CotonetKids responde
    await page.click('#qs-btn-install');
    await expect(page.locator('#qs-install-badge')).toContainText('Concluído', { timeout: 15000 });

    expect(requestedUrls.some(u => u.includes('tvs-de-portugal'))).toBe(true);
    expect(requestedUrls.some(u => u.includes('toast-translator') || u.includes('aiostreams-pt-proxy'))).toBe(false);
  });

});

test.describe('Bug beta #2 — contaminação de sessão entre contas/plataformas', () => {

  test('trocar de conta Stremio não arrasta estado de debrid da conta anterior', async ({ page }) => {
    await mockStremioApi(page, { kidsFails: false });
    await page.goto('/');

    // Conta A: TorBox com uma chave
    await page.fill('#qs-inp-email', 'contaA@example.com');
    await page.fill('#qs-inp-pass', 'passwordA');
    await page.click('#qs-btn-login');
    await expect(page.locator('#qs-login-status')).toContainText('Conta verificada', { timeout: 10000 });
    await page.click('#qs-mode-debrid');
    await page.fill('#qs-debrid-key', 'CHAVE_SECRETA_CONTA_A');
    await expect(page.locator('#qs-debrid-key')).toHaveValue('CHAVE_SECRETA_CONTA_A');

    // Recarrega a página (equivalente a "terminar sessão") e entra com a conta B
    await page.reload();
    await page.fill('#qs-inp-email', 'contaB@example.com');
    await page.fill('#qs-inp-pass', 'passwordB');
    await page.click('#qs-btn-login');
    await expect(page.locator('#qs-login-status')).toContainText('Conta verificada', { timeout: 10000 });

    // A chave da conta A nunca deve reaparecer no campo da conta B
    await expect(page.locator('#qs-debrid-key')).toHaveValue('');
    const storage = await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage));
    expect(storage).not.toContain('CHAVE_SECRETA_CONTA_A');
  });

  test('trocar de Stremio para Nuvio no mesmo separador não arrasta authKey/email anterior', async ({ page }) => {
    await mockStremioApi(page, { kidsFails: false });
    await page.goto('/');

    await page.fill('#qs-inp-email', 'stremio-user@example.com');
    await page.fill('#qs-inp-pass', 'passwordX');
    await page.click('#qs-btn-login');
    await expect(page.locator('#qs-login-status')).toContainText('Conta verificada', { timeout: 10000 });

    // Troca para Nuvio sem recarregar a página
    await page.evaluate(() => (window as any).qsSetPlatform('nuvio'));

    // Os campos de login devem ter sido limpos pelo próprio qsSetPlatform
    await expect(page.locator('#qs-inp-email')).toHaveValue('');
    await expect(page.locator('#qs-inp-pass')).toHaveValue('');
    await expect(page.locator('#qs-login-status')).toHaveText('');

    // O pill de conta da sessão Stremio anterior não deve continuar visível
    // como se já estivesse autenticado em Nuvio
    const pillVisible = await page.locator('#qs-account-pill').isVisible();
    if (pillVisible) {
      const pillText = await page.locator('#qs-account-pill').textContent();
      expect(pillText).not.toContain('stremio-user@example.com');
    }
  });

});

test.describe('Bugs beta #3 e #4 — fechados', () => {

  test('#3 fechado: QuickStart não tem importação manual de JSON (resolvido via ?template= no AIOStreams)', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toMatch(/importar.{0,20}json/i);
  });

  test('#4 fechado: nenhum link aponta para app.strem.io (v4 legada)', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).not.toContain('app.strem.io');
    expect(html).toContain('web.stremio.com');
  });

});
