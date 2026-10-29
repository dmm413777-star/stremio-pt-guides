# Stremio PT — Contexto do Projecto para Claude Code

Site de guias de Stremio e Nuvio em português + ferramenta QuickStart PT
(instalador automático de addons, suporta contas Stremio e Nuvio).
Hospedado em GitHub Pages. Deploy automático via GitHub Actions a cada push para `main`.

Repo: `git@github.com:dmm413777-star/stremio-pt-guides.git`

---

## Stack

- **Site:** Hugo + tema **Hextra** (não PaperMod — o projecto começou com PaperMod mas migrou)
- **QuickStart:** HTML + Vanilla JS puro, embebido como Hugo shortcode em `layouts/shortcodes/quickstart.html`
- **Hosting:** GitHub Pages (grátis). Também existe um `netlify.toml` para deploy alternativo no Netlify, mas o site de produção é o GitHub Pages.

## Estrutura

```
content/guias/
  aiostreams-tamtaro.md   AIOStreams + SEL Tam-Taro (v3.0.4)
  aiometadata.md          Catálogos AIOMetadata
  nuvio.md                Nuvio (Android TV, autoplay)
  torbox.md               TorBox debrid
  submaker.md             SubMaker (legendas IA)
  toast-translator.md     Toast Translator + RPDB
  tugakids.md             TugaKids
  tmdb.md                 TMDB API Key
  migrar-para-nuvio.md    Migração Stremio → Nuvio (NuvioSync)
  clonar-perfil-nuvio.md  Clonar perfil Nuvio para família

layouts/shortcodes/
  quickstart.html         QuickStart PT — FONTE DA VERDADE, é o que corre na homepage
  guias-grid.html         Grid de cards na página /guias

static/
  images/                 Screenshots dos guias + images/apps/ (ícones Stremio/Nuvio)
  tools/quickstart/       Versão standalone ANTIGA e DESINCRONIZADA — não editar,
                           não é a versão usada; a fonte real é o shortcode acima

tests/qa/                 Suite Playwright (14 ficheiros, ~380 testes) — ver secção QA abaixo

.github/workflows/hugo.yml
hugo.toml
netlify.toml
```

**Importante:** `static/tools/quickstart/index.html` é uma versão legada que ficou
desincronizada da versão real. O QuickStart que aparece no site é o shortcode
`layouts/shortcodes/quickstart.html`, embebido na homepage. Qualquer alteração ao
QuickStart faz-se **só** nesse ficheiro.

---

## QuickStart PT — como funciona hoje

Instala um pack de addons PT numa conta **Stremio ou Nuvio**, à escolha do utilizador
(toggle no passo de login, com ícones estilo duck-tools). Suporta login com conta
existente ou gerar conta aleatória, para ambas as plataformas.

**Fluxo (3 passos):** Login (Stremio/Nuvio) → Seleccionar pack + modo Debrid/P2P → Instalação automática.

**Pack instalado:** AIOStreams (template Tam-Taro SEL), AIOMetadata PT, SubMaker,
Toast Translator, Animação PT-PT, Cotonet, PTGDrive.

### Stremio
- Login/registo via `api.strem.io` (`/api/login`, `/api/register`, `/api/addonCollectionGet`, `/api/addonCollectionSet`)
- authKey só em memória, nunca em localStorage
- **Manifests guardados em versão "slim"**: o Stremio desktop (parser Rust) rejeita
  `manifest:null`, e um manifest completo com 60+ catálogos excede o limite de tamanho
  ("max descriptor size reached"). A função `makeSlimManifest()` mantém os catalogs
  (necessários para a homepage mostrar rows) mas remove o campo `extra` de géneros
  (mantém `search`/`skip` — removê-los partia a pesquisa do Stremio)

### Nuvio
- API Supabase em `api.nuvio.tv`, publishable key pública `sb_publishable_1Clq8rlTVACkdcZuqr6_AD__xUUC_EN`
- Login: `POST /auth/v1/token?grant_type=password`. Registo: `POST /auth/v1/signup`
- Perfis e addons via RPC: `rpc/sync_pull_profiles`, `rpc/sync_push_profiles`,
  `rpc/sync_push_addons` (ver objecto `NuvioAPI` em quickstart.html)
- A tabela `addons` do Nuvio só guarda `url`/`name`/`enabled`/`sort_order` — **sem**
  limite de tamanho de manifest nem problema de `manifest:null`, por isso não precisa
  de slim manifests como o Stremio
- Implementação espelhada da ferramenta pública duck-tools
  (`duck-tools.pages.dev/quackstart`, classe `NuvioAPIProvider`)
- **Nunca criar contas Nuvio reais via automação** (API ou browser) — é um serviço de
  produção de terceiros. Só o utilizador deve gerar contas lá; testar com conta que
  o utilizador fornecer explicitamente

### AIOStreams (PRESETS_P2P / PRESETS_DEBRID em quickstart.html)
- Chama o Worker proxy `aiostreams-pt-proxy.mire-freckle.workers.dev` (CORS)
- A AIOStreams valida o manifest de **cada preset** antes de aceitar a config — se um
  preset estiver offline, a instalação inteira falha. Já aconteceu com `torrents-db`
  (torrentsdb.com devolvia 502) — foi removido da lista. Se o AIOStreams parar de
  instalar outra vez, suspeitar primeiro de um preset offline, não do código

### AIOMetadata (buildAIOMetadataConfig em quickstart.html)
- Catálogos sincronizados com a template Tam-Taro (SEL-Filtering-and-Sorting)
- Search: `ai_enabled: false` (sem chave Gemini configurada, dava resultados errados),
  `mal.search.movie`/`mal.search.series: true` (melhora pesquisa de anime)
- Os catálogos reais de pesquisa no manifest são `search.movie`/`search.series` —
  **não** `tmdb.search`/`tvdb.search` (esses devolvem trending, não pesquisa real)

---

## Testes (QA)

```bash
npx playwright test                    # suite completa (~380 testes, 3 browsers)
npx playwright test tests/qa/XX-nome.spec.ts --project="Desktop Chrome"
```

14 ficheiros em `tests/qa/`, cobrindo homepage, navegação, conteúdo dos guias,
QuickStart (UI + instalação), links, mobile, SEO, debrids, URLs Stremio, tags,
catálogos AIOMetadata, pesquisa (One Piece S23, via API directa), e o toggle Nuvio.

Corre a suite completa antes de dar qualquer alteração ao QuickStart como terminada.
Testes reais de instalação (login Stremio/Nuvio, addons a instalar) só com contas de
teste que o utilizador fornecer explicitamente — nunca criar contas por conta própria.

---

## Créditos obrigatórios

- Tam-Taro: GitHub (https://github.com/Tam-Taro/SEL-Filtering-and-Sorting) + Ko-fi (https://ko-fi.com/tamtaro)
- u/WildRabbitz: crédito no guia Nuvio
- TorBox referral link correcto (actualizar aqui sempre que mudar):
  `https://torbox.app/subscription?referral=92f7e5bb-4698-4146-aefb-d95e333c3ed6`

## Linguagem e tom (guias em `content/guias/`)

- Escrita humana, não "cheiro a AI": nada de "— " como separador, "é importante notar
  que...", listas onde prosa seria melhor, adjectivos redundantes
- Comunidade PT a falar com comunidade PT: directo, informal mas não desleixado
- Português de Portugal em todo o lado, nunca brasileiro
- Terminologia consistente entre guias (ex: "addon", não "add-on")

---

## Referências Técnicas

- Tam-Taro SEL: https://github.com/Tam-Taro/SEL-Filtering-and-Sorting
- duck-tools QuackStart (referência para fluxo Nuvio): https://duck-tools.pages.dev/quackstart/
- NuvioSync (migração/clonagem de perfis): https://nuviosync.com
- Viren070 (referência técnica Stremio): https://guides.viren070.me/stremio

---

## O que NÃO fazer

- Não criar contas reais (Stremio ou Nuvio) por automação para testar — só com contas
  que o utilizador forneça explicitamente
- Não implementar OAuth Facebook — direccionar para reset-password do Stremio
- Não guardar passwords, tokens ou authKeys em localStorage/sessionStorage — só em
  variáveis JS em memória durante a sessão
- Não usar frameworks JS (React, Vue) no QuickStart — HTML + JS puro, sem build step
- Não editar `static/tools/quickstart/` à espera que afecte o site — é legado morto
- Não traduzir para português do Brasil
- Não remover o referral TorBox nem os créditos Tam-Taro/WildRabbitz
