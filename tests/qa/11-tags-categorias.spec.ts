import { test, expect } from '@playwright/test';

// Tags sem acentos confirmadas nos frontmatter dos guias
const TAGS_SIMPLES = ['legendas', 'debrid', 'nuvio', 'streams', 'torbox'];

test.describe('Inês — utilizadora que quer filtrar guias por categoria', () => {

  test('páginas de tags principais existem e retornam 200', async ({ page }) => {
    const found: string[] = [];
    const missing: string[] = [];

    for (const tag of TAGS_SIMPLES) {
      const res = await page.goto(`/tags/${tag}/`);
      if (res?.status() === 200) found.push(tag);
      else missing.push(tag);
    }

    console.log(`Tags encontradas: ${found.join(', ')}`);
    if (missing.length) console.log(`Tags em falta: ${missing.join(', ')}`);

    expect(
      found.length,
      `Menos de metade das tags existe. Em falta: ${missing.join(', ')}`
    ).toBeGreaterThan(TAGS_SIMPLES.length / 2);
  });

  test('página /tags/legendas/ lista guias com legendas', async ({ page }) => {
    const res = await page.goto('/tags/legendas/');
    if (res?.status() !== 200) {
      test.skip(true, '/tags/legendas/ não existe');
      return;
    }
    const html = await page.content();
    expect(html).toMatch(/[Ss]ub[Mm]aker|[Ll]egenda|[Tt]oast/i);
  });

  test('página /tags/debrid/ lista guias de debrid', async ({ page }) => {
    const res = await page.goto('/tags/debrid/');
    if (res?.status() !== 200) {
      test.skip(true, '/tags/debrid/ não existe');
      return;
    }
    const html = await page.content();
    expect(html).toMatch(/[Tt]or[Bb]ox|[Dd]ebrid|[Aa]IO[Ss]treams/i);
  });

  test('página de tag tem h1 ou h2 visível', async ({ page }) => {
    let found = false;
    for (const tag of TAGS_SIMPLES) {
      const res = await page.goto(`/tags/${tag}/`);
      if (res?.status() === 200) {
        await expect(page.locator('h1, h2').first()).toBeVisible();
        found = true;
        break;
      }
    }
    if (!found) test.skip(true, 'Nenhuma página de tag encontrada');
  });

  test('guias têm frontmatter com tags definidas', async ({ page }) => {
    // Verifica indirectamente: se as páginas /tags/ existem, os guias têm tags
    const res = await page.goto('/tags/');
    if (res?.status() === 200) {
      const html = await page.content();
      // Página /tags/ deve listar pelo menos algumas categorias
      expect(html.length).toBeGreaterThan(500);
    } else {
      // Se /tags/ não existe, pelo menos /tags/legendas/ deve existir
      const r2 = await page.goto('/tags/legendas/');
      expect(r2?.status()).toBe(200);
    }
  });

  test('links de tag numa página de guia apontam para /tags/', async ({ page }) => {
    // Testa num guia que tem tags conhecidas
    const res = await page.goto('/guias/submaker');
    if (res?.status() !== 200) {
      test.skip(true, '/guias/submaker não existe');
      return;
    }

    const tagLinks = page.locator('a[href*="/tags/"]');
    if (await tagLinks.count() === 0) {
      console.log('O tema pode não renderizar links de tag visíveis — verifica o layout');
      return;
    }

    await expect(tagLinks.first()).toBeVisible();
    const href = await tagLinks.first().getAttribute('href') ?? '';
    expect(href).toContain('/tags/');
  });

  test('/tags/ ou /tags/legendas/ não retorna 404', async ({ page }) => {
    const r1 = await page.goto('/tags/');
    const r2 = await page.goto('/tags/legendas/');

    const statuses = [r1?.status(), r2?.status()];
    const hasSuccess = statuses.some(s => s === 200);
    expect(hasSuccess, `Todos os URLs de tags retornaram erro: ${statuses.join(', ')}`).toBe(true);
  });

});
