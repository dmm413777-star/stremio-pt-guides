---
title: "Toast Translator — Sinopses em Português e Ratings nos Posters"
date: 2025-01-01
description: "Como configurar o Toast Translator com RPDB para ter sinopses e títulos em Português de Portugal, e notas do IMDb/Rotten Tomatoes nas capas dos filmes."
tags: ["toast", "rpdb", "sinopses", "português", "tmdb", "stremio"]
categorias: ["localização", "metadata"]
weight: 57
---

O **Toast Translator** traduz títulos e sinopses para **Português de Portugal** diretamente no Stremio. Combinado com o **RPDB**, adiciona ainda as notas do IMDb e Rotten Tomatoes nas capas dos filmes.

---

## Passo 1 — Criar a TMDB API Key

O Toast precisa da tua API Key do TMDB para aceder às traduções. É gratuita e demora menos de 5 minutos.

> Segue o [guia TMDB API Key](/guias/tmdb) e volta aqui com a chave copiada.

---

## Passo 2 — Configurar o Toast Translator

1. Abre a [Página de Configuração do Toast](https://0f693ad7dcba-toast-translator.baby-beamup.club/configure).

<!-- SCREENSHOT: Página de configuração do Toast Translator mostrando os campos disponíveis -->

2. **TMDB API Key:** Cola a key obtida no passo anterior.

<!-- SCREENSHOT: Campo TMDB API Key preenchido na página do Toast Translator -->

3. **RPDB API Key:** Para teres ratings nos posters, usa a key gratuita:
   ```
   t0-free-rpdb
   ```
   Não precisas de criar conta — esta key pública funciona diretamente.

4. **Translate to:** Seleciona `Portuguese (Portugal)`.

<!-- SCREENSHOT: Dropdown "Translate to" com "Portuguese (Portugal)" selecionado -->

5. Clica em **Install** — o Stremio abre e instala o addon.

---

## Resultado esperado

Após a instalação, as sinopses e títulos dos filmes e séries passam a aparecer em **Português de Portugal** no Stremio. Os posters mostram as notas do IMDb e Rotten Tomatoes sobrepostas na capa.

<!-- SCREENSHOT: Comparação de um filme no Stremio antes e depois do Toast Translator — sinopse em inglês vs. português, e poster com rating RPDB visível -->

---

## Links

- [Toast Translator (Configuração)](https://0f693ad7dcba-toast-translator.baby-beamup.club/configure)
- [Guia TMDB API Key](/guias/tmdb)
- [RPDB — Ratings nos Posters](https://ratingposterdb.com)
