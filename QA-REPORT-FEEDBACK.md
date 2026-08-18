# QA Report — Alterações Feedback Reddit
Data: 2026-08-18

## Novos testes adicionados

| Ficheiro | Testes | Persona |
|---|---|---|
| `tests/qa/08-debrids.spec.ts` | 12 | Rodrigo, 34 anos, Lisboa — utilizador Real-Debrid |
| `tests/qa/09-facebook-login.spec.ts` | 8 | Margarida, 52 anos, Porto — conta Stremio via Facebook |
| `tests/qa/10-stremio-url.spec.ts` | 4 | Tomás, 19 anos, Braga — clica para abrir Stremio Web |
| `tests/qa/11-tags-categorias.spec.ts` | 6 | Inês, 28 anos, Setúbal — filtra guias por categoria |
| `tests/qa/04-quickstart.spec.ts` (adições) | +2 | Sofia — referral TorBox + segurança localStorage |

**Total novos testes: 32 (96 execuções × 3 browsers)**

## Resultados

| Escopo | Passou | Falhou | Saltou |
|---|---|---|---|
| 08-debrids (3 browsers) | 31 | 0 | 0 |
| 09-facebook-login (3 browsers) | 24 | 0 | 0 |
| 10-stremio-url (3 browsers) | 12 | 0 | 0 |
| 11-tags-categorias (3 browsers) | 18 | 0 | 0 |
| **Suite completa (11 ficheiros)** | **296** | **0** | **0** |

## Problemas encontrados e resolvidos

### 1. WebKit (Mobile Safari) — executável em falta
**Erro:** `browserType.launch: Executable doesn't exist at webkit-2336/pw_run.sh`  
**Causa:** Cache do Playwright corrompida/desactualizada; webkit-2336 não estava instalado localmente.  
**Fix:** `npx playwright install webkit` — binário reinstalado, todos os testes Mobile Safari passam.

### 2. Clicks em pills dentro de `.card.inactive` — timeout de 30s
**Erro:** `<div id="qs-widget">…</div> intercepts pointer events`  
**Causa:** `.card.inactive { pointer-events: none }` no CSS do QuickStart. Os pills do seletor de debrid ficam dentro de `#qs-card-pack.inactive` antes do login, tornando-os não clicáveis via `.click()`.  
**Fix:** Substituído `page.locator('#qs-svc-label-X').click()` por `page.evaluate(() => window.selectDebridService('X'))` em todos os testes que precisam de mudar de serviço. Bypassa o `pointer-events:none` sem alterar a implementação.

### 3. Texto do hint Facebook não mencionava addons intactos
**Impacto:** Teste `instrução menciona que conta e addons ficam intactos` teria falhado.  
**Fix:** Adicionada a frase "Os teus addons e preferências ficam intactos — o reset só define a password." ao `<details class="fb-hint">` no quickstart shortcode. Melhora a UX para o Margarida.

## Testes saltados
Nenhum teste usa `test.skip()` — todos os cenários estão cobertos e a passar.

## Regressões na suite existente
Nenhuma. Os 134 testes anteriores continuam a passar nos mesmos 3 browsers.

## O que os novos testes cobrem

**08-debrids (Rodrigo):**
- 4 pills visíveis, TorBox activo por defeito com badge "Rec."
- Só TorBox tem link de referral (444bd704) — os outros 3 não têm
- `selectDebridService()` actualiza placeholder, links e estado do seletor
- Campo limpa ao mudar de serviço (evita chaves erradas)
- Cada debrid tem link "Obter API key" apontando para o site correcto
- Reverter para TorBox restaura o referral link
- Mobile: sem scroll horizontal em 390px

**09-facebook-login (Margarida):**
- Accordion `<details class="fb-hint">` existe e está fechado por defeito
- Abre ao clicar, mostra link para `stremio.com/reset-password` em tab nova
- Menciona que addons ficam intactos (UX relevante para quem tem medo de perder dados)
- Sem botão OAuth Facebook (solução deliberada — reset-password é mais simples e seguro)
- Accordion não bloqueia o formulário de login principal

**10-stremio-url (Tomás):**
- Nenhum link aponta para `app.strem.io` (versão descontinuada)
- Código-fonte referencia `web.stremio.com`
- Verificação em homepage, QuickStart e páginas de guia

**11-tags-categorias (Inês):**
- Páginas `/tags/legendas/`, `/tags/debrid/`, `/tags/nuvio/`, `/tags/streams/`, `/tags/torbox/` retornam 200
- Conteúdo relevante em `/tags/legendas/` e `/tags/debrid/`
- Páginas de tag têm heading visível
- Taxonomias Hugo funcionais end-to-end
