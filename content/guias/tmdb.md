---
title: "TMDB API Key — Como Criar"
date: 2025-01-01
description: "Como criar gratuitamente a tua API Key do TheMovieDB (TMDB), necessária para o AIOStreams, AIOMetadata, Toast Translator e outros addons."
tags: ["tmdb", "api-key", "metadata", "stremio"]
categorias: ["api-keys"]
weight: 10
tempo: "5 min"
---

O TMDB (TheMovieDB) é a base de dados de filmes e séries que o AIOStreams usa para identificar correctamente títulos e episódios. A chave é gratuita e necessária para vários addons: AIOStreams, AIOMetadata, Toast Translator, entre outros.

**Tempo estimado: 5 min**

{{< callout type="warning" >}}
**Antes de começares:** Precisas de criar uma conta gratuita no TMDB. O e-mail de confirmação chega em segundos.
{{< /callout >}}

---

## Passo a Passo

1. Abre [themoviedb.org](https://www.themoviedb.org/) e cria uma conta (ou faz login).
2. Clica no ícone de perfil (canto superior direito) → **Settings**.
3. No menu lateral esquerdo, clica em **API**.
4. Clica em **"Create"** (ou *"click here"*) → Seleciona **Developer**.
5. Aceita os termos de serviço.
6. Preenche o formulário de pedido:

| Campo | O que preencher |
|---|---|
| **Type of Use** | `Personal` |
| **Application URL** | `http://google.com` *(o site obriga a ter um URL)* |
| **Application Summary** | `Using for personal metadata on Stremio addon` |
| **Application Name** | Qualquer nome, ex: `Stremio Personal` |
| **Address / Phone** | Dados genéricos (não são verificados) |

7. Submete o formulário.
8. Na página de API, copia a chave **"API Key (v3 auth)"**.

---

## Onde Usar

- **AIOStreams / AIOMetadata:** Cola no campo TMDB API Key durante a configuração.
- **Toast Translator:** Cola no campo TMDB API Key na página de configuração.

---

## Próximo passo

Com a TMDB API Key criada, continua para:

→ [AIOStreams + Template SEL](/guias/aiostreams-tamtaro) — se ainda não configuraste o AIOStreams  
→ [AIOMetadata — Catálogos Organizados](/guias/aiometadata) — se já tens o AIOStreams e queres organizar os catálogos

---

## Links

- [TheMovieDB](https://www.themoviedb.org/)
- [Página de API do TMDB (após login)](https://www.themoviedb.org/settings/api)
