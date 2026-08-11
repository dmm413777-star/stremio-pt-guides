---
title: "Toast Translator — Sinopses em Português e Ratings nos Posters"
date: 2025-01-01
description: "Como configurar o Toast Translator com RPDB para ter sinopses e títulos em Português de Portugal, e notas do IMDb/Rotten Tomatoes nas capas dos filmes."
tags: ["toast", "rpdb", "sinopses", "português", "tmdb", "stremio"]
categorias: ["localização", "metadata"]
weight: 57
tempo: "5 min"
---

O **Toast Translator** traduz títulos e sinopses para **Português de Portugal** diretamente no Stremio. Combinado com o **RPDB**, adiciona ainda as notas do IMDb e Rotten Tomatoes nas capas dos filmes.

**Tempo estimado: 5 min**

> **Antes de começares:** Precisas da tua [TMDB API Key](/guias/tmdb). É gratuita e demora menos de 5 minutos a criar.

---

## Passo 1 — Criar a TMDB API Key

O Toast precisa da tua API Key do TMDB para aceder às traduções. É gratuita e demora menos de 5 minutos.

> Segue o [guia TMDB API Key](/guias/tmdb) e volta aqui com a chave copiada.

---

## Passo 2 — Configurar o Toast Translator

1. Abre a [Página de Configuração do Toast](https://0f693ad7dcba-toast-translator.baby-beamup.club/configure).

![Página de configuração do Toast Translator com os campos de API Key e idioma](/images/toast-configure.png)
*Página de configuração do Toast Translator — preenche a TMDB API Key, a RPDB Key e selecciona Portuguese (Portugal).*

2. **TMDB API Key:** Cola a key obtida no passo anterior.

3. **RPDB API Key:** Para teres ratings nos posters, usa a key gratuita:
   ```
   t0-free-rpdb
   ```
   Não precisas de criar conta — esta key pública funciona diretamente.

4. **Translate to:** Seleciona `Portuguese (Portugal)`.

5. Clica em **Install** — o Stremio abre e instala o addon.

---

## Resultado esperado

Após a instalação, as sinopses e títulos dos filmes e séries passam a aparecer em **Português de Portugal** no Stremio. Os posters mostram as notas do IMDb e Rotten Tomatoes sobrepostas na capa.

---

## Se algo correr mal

**Sinopses continuam em inglês** — o Toast Translator pode não estar a ter prioridade sobre o Cinemeta. Vai a Addons → reordena para o Toast aparecer acima do Cinemeta na lista.

**Notas RPDB não aparecem nos posters** — confirma que a key `t0-free-rpdb` está correctamente copiada no campo RPDB API Key (sem espaços).

---

## Próximo passo

Para ter legendas em português quando não existem no conteúdo:

→ [SubMaker — Tradução de Legendas por IA](/guias/submaker)

---

## Links

- [Toast Translator (Configuração)](https://0f693ad7dcba-toast-translator.baby-beamup.club/configure)
- [Guia TMDB API Key](/guias/tmdb)
- [RPDB — Ratings nos Posters](https://ratingposterdb.com)
