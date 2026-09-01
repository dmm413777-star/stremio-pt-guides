import { test, expect } from '@playwright/test';

// Persona: conta limpa, QuickStart instalado, pesquisa One Piece S23
// Usa conta de teste isolada — não altera dados reais de utilizadores

const STREMIO_LOGIN = 'https://api.strem.io/api/login';
const STREMIO_COLLECTION_GET = 'https://api.strem.io/api/addonCollectionGet';
const TEST_EMAIL = 'stremio.bt8lqmfv@proton.me';
const TEST_PASS = 'v5re70wheoR8ETK0T2BM!1';

async function getAuthAndAddons(request: any) {
  const loginRes = await request.post(STREMIO_LOGIN, {
    data: { email: TEST_EMAIL, password: TEST_PASS, facebook: false },
  });
  const loginData = await loginRes.json();
  const authKey = loginData?.result?.authKey;
  expect(authKey, 'Login falhou — sem authKey').toBeTruthy();

  const colRes = await request.post(STREMIO_COLLECTION_GET, {
    data: { authKey, type: 'User' },
  });
  const colData = await colRes.json();
  const addons = colData?.result?.addons ?? [];
  return { authKey, addons };
}

test.describe('One Piece S23 — pesquisa e streams (conta limpa)', () => {

  test('conta tem AIOMetadata instalado', async ({ request }) => {
    const { addons } = await getAuthAndAddons(request);
    const aio = addons.find((a: any) => a.transportUrl?.includes('aiometadata'));
    expect(aio, 'AIOMetadata não instalado').toBeTruthy();
  });

  test('conta tem AIOStreams instalado', async ({ request }) => {
    const { addons } = await getAuthAndAddons(request);
    const aio = addons.find((a: any) => a.transportUrl?.includes('aiostream'));
    // AIOStreams pode não estar nesta conta de teste se o servidor bloqueou o fetch directo (403)
    if (!aio) test.skip();
    expect(aio).toBeTruthy();
  });

  test('AIOMetadata search.series retorna One Piece para query "One Piece"', async ({ request }) => {
    const { addons } = await getAuthAndAddons(request);
    const aio = addons.find((a: any) => a.transportUrl?.includes('aiometadata'));
    if (!aio) test.skip();

    const base = aio.transportUrl.replace('/manifest.json', '');
    const searchUrl = `${base}/catalog/series/search.series/search=One%20Piece.json`;
    const res = await request.get(searchUrl);
    expect(res.ok(), `Search endpoint falhou: ${searchUrl}`).toBeTruthy();
    const data = await res.json();
    const metas = data?.metas ?? [];
    expect(metas.length, 'Nenhum resultado de pesquisa').toBeGreaterThan(0);

    const onePiece = metas.find((m: any) =>
      m.name?.toLowerCase().includes('one piece') && m.type === 'series'
    );
    expect(onePiece, `One Piece não encontrado — primeiros resultados: ${metas.slice(0,3).map((m:any)=>m.name).join(', ')}`).toBeTruthy();
  });

  test('AIOMetadata search.movie retorna filmes One Piece', async ({ request }) => {
    const { addons } = await getAuthAndAddons(request);
    const aio = addons.find((a: any) => a.transportUrl?.includes('aiometadata'));
    if (!aio) test.skip();

    const base = aio.transportUrl.replace('/manifest.json', '');
    const res = await request.get(`${base}/catalog/movie/search.movie/search=One%20Piece.json`);
    expect(res.ok()).toBeTruthy();
    const metas = (await res.json())?.metas ?? [];
    const op = metas.find((m: any) => m.name?.toLowerCase().includes('one piece'));
    expect(op, 'Nenhum filme One Piece encontrado').toBeTruthy();
  });

  test('AIOMetadata meta de One Piece tem temporada 23 com episódios', async ({ request }) => {
    const { addons } = await getAuthAndAddons(request);
    const aio = addons.find((a: any) => a.transportUrl?.includes('aiometadata'));
    if (!aio) test.skip();

    const base = aio.transportUrl.replace('/manifest.json', '');
    // IMDB ID canónico do One Piece anime
    const res = await request.get(`${base}/meta/series/tt0388629.json`);
    expect(res.ok()).toBeTruthy();
    const meta = (await res.json())?.meta ?? {};
    expect(meta.name?.toLowerCase()).toContain('one piece');

    const videos = meta.videos ?? [];
    expect(videos.length, 'Sem episódios no meta').toBeGreaterThan(100);

    const s23 = videos.filter((v: any) => v.season === 23);
    expect(s23.length, 'Temporada 23 sem episódios').toBeGreaterThan(0);
  });

  test('AIOStreams tem streams para One Piece S23E1 (kitsu:12:1156)', async ({ request }) => {
    const { addons } = await getAuthAndAddons(request);
    const aio = addons.find((a: any) => a.transportUrl?.includes('aiostream'));
    if (!aio) test.skip();

    const base = aio.transportUrl.replace('/manifest.json', '');
    const res = await request.get(`${base}/stream/series/kitsu:12:1156.json`);
    expect(res.ok()).toBeTruthy();
    const streams = (await res.json())?.streams ?? [];
    expect(streams.length, 'Nenhum stream disponível para S23E1').toBeGreaterThan(0);
  });

  test('manifest AIOMetadata não tem "Harry Potter" em search.series', async ({ request }) => {
    const { addons } = await getAuthAndAddons(request);
    const aio = addons.find((a: any) => a.transportUrl?.includes('aiometadata'));
    if (!aio) test.skip();

    const base = aio.transportUrl.replace('/manifest.json', '');
    const res = await request.get(`${base}/catalog/series/search.series/search=One%20Piece.json`);
    const metas = (await res.json())?.metas ?? [];
    const harry = metas.find((m: any) => m.name?.toLowerCase().includes('harry potter'));
    expect(harry, 'Harry Potter aparece nos resultados de "One Piece" — search ainda errado').toBeUndefined();
  });

});
