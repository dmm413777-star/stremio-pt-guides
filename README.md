# Stremio PT Guides

Guias de Stremio e Nuvio em português — simples, diretos e atualizados pela comunidade.

## Estrutura do Projeto

```
content/
  guias/
    aiostreams-tamtaro.md   ← AIOStreams + Template SEL do Tam-Taro
    aiometadata.md          ← Catálogos com AIOMetadata
    nuvio.md                ← Guia de início do Nuvio
    torbox.md               ← TorBox (debrid alternativo)
    legendas-pt.md          ← SubMaker, Toast Translator, TugaKids
    tmdb.md                 ← Como criar API Key TMDB
  links.md                  ← Links e recursos úteis
```

## Setup Local

### Pré-requisitos
- [Hugo Extended](https://gohugo.io/installation/) v0.120+
- Git

### Instalar o tema PaperMod

```bash
git init
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

### Correr localmente

```bash
hugo server -D
```

Abre `http://localhost:1313` no browser.

### Build para produção

```bash
hugo --minify
```

Os ficheiros estáticos ficam em `public/`.

## Deploy (GitHub Pages)

1. Cria um repositório no GitHub.
2. Push do código para o branch `main`.
3. Vai a **Settings → Pages** e define a source como **GitHub Actions**.
4. O workflow `.github/workflows/hugo.yml` faz o deploy automaticamente a cada push.

## Contribuir

Encontraste algo desatualizado? Abre um **Issue** ou submete um **Pull Request**.

Por favor mantém os guias:
- Em português de Portugal
- Com créditos aos autores originais quando aplicável
- Atualizados face às versões mais recentes das ferramentas

## Créditos

- Templates AIOStreams/AIOMetadata: **[Tam-Taro](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)**
- Referência de design e estrutura: **[Duck Guides](https://duckkota.gitlab.io/guides/)**
- Comunidade: **[r/PiratariaTuga](https://www.reddit.com/r/PiratariaTuga/)**
