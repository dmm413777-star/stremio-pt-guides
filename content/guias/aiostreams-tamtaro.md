---
title: "AIOStreams + Template Tam-Taro (SEL)"
date: 2025-01-01
description: "Configura o AIOStreams com o template SEL do Tam-Taro para um setup à prova de falhas, com modo P2P e suporte a Debrid."
tags: ["aiostreams", "tamtaro", "sel", "p2p", "debrid", "stremio"]
categorias: ["setup", "avançado"]
weight: 20
---

> **Créditos:** Templates SEL criados por **[Tam-Taro](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)** ([Ko-fi](https://ko-fi.com/tamtaro)). Guia adaptado em português pela comunidade.

---

## O que é e por que usar?

O **AIOStreams** agrega dezenas de addons num só. Em vez de depender apenas do Torrentio ou do Real Debrid, consulta simultaneamente o Comet, MediaFusion, Peerflix, STorz e muitos outros.

Com o **template SEL do Tam-Taro**, os filtros e ordenação são configurados automaticamente — sem teres de perceber cada opção. E o mais importante: tem um **modo P2P de fallback** que funciona mesmo quando o Debrid falha.

---

## Passo 1 — Escolher uma instância

Usa uma versão **Nightly** para teres as funcionalidades mais recentes:

- [Viren's Nightly](https://aiostreams.viren070.me/stremio/configure)
- [Kuu's Nightly](https://aiostreams-nightly.206111.xyz/stremio/configure)
- [Yeb's Nightly](https://aiostreams-nightly.fortheweak.cloud/stremio/configure)

> Garante que a instância que escolhes tem o addon Torrentio a funcionar. Se não tiver, muda para outra.

---

## Passo 2 — Importar o Template SEL

Na página inicial do AIOStreams, vai à secção **Featured Templates** e seleciona **"Tamtaro Complete SEL Setup"**.

<!-- SCREENSHOT: Página inicial do AIOStreams com a secção "Featured Templates" visível e o template "Tamtaro Complete SEL Setup" destacado -->

Em alternativa, importa diretamente via URL (no botão de importar templates):

```
https://raw.githubusercontent.com/Tam-Taro/SEL-Filtering-and-Sorting/refs/heads/main/Tamtaro-All-Templates-for-AIOStreams.json
```

> **Template atual:** v3.0.4. Há dois disponíveis:
> - **Complete SEL Setup** — configuração completa (addons + filtros + formatter). Recomendado para quem começa.
> - **Partial SEL Setup** — importa apenas filtros/formatter, mantendo os teus addons atuais.

---

## Passo 3 — Assistente de Configuração

Após importar, o AIOStreams abre um assistente. Seleciona **"Tamtaro Complete SEL Setup"** e percorre as opções:

<!-- SCREENSHOT: Assistente (wizard) do AIOStreams após importar o template, com as opções de configuração visíveis -->

### Modo Debrid (recomendado)

Seleciona o teu serviço de Debrid e cola a respetiva API Key. O assistente adapta-se automaticamente.

<!-- SCREENSHOT: Passo do assistente onde se seleciona o serviço Debrid e se insere a API Key -->

**Recomendação:** O **[TorBox](/guias/torbox)** é a opção mais económica e permite partilhar sem bloqueios por IP.

### Modo P2P (fallback quando o Debrid falha)

Se **não selecionares** nenhum serviço de Debrid, o template ativa automaticamente o **Setup P2P**, com: Meteor, Comet, StremThru, TorzS, MediaFusion, Torrentio, TorrentsDB, Peerflix, Sootio, Nuvio Streams, Nuvio Anime, WebStreamr.

### Ambos em simultâneo

Quer Debrid ativo **e** fallback P2P? Instala a instância duas vezes: uma com Debrid, outra sem.

---

## Passo 4 — Credenciais TMDB e TVDB

São **obrigatórias** para o matching correto de títulos e episódios:

<!-- SCREENSHOT: Passo do assistente onde se pedem as credenciais TMDB e TVDB -->

- **TMDB API Key** → ver [guia TMDB](/guias/tmdb)
- **TVDB API Key** → cria conta em [thetvdb.com](https://thetvdb.com) e gera a key nas definições

Deixa as restantes opções nos valores padrão para o setup testado e recomendado pelo Tam-Taro.

> **Dica Pro:** Se quiseres manter os teus addons atuais e só adicionar os filtros SEL, usa o *Complete SEL Setup* e marca **"No Addons"** durante o assistente.

---

## Passo 5 — Guardar e Instalar

1. Clica em **Load Template**.
2. Na página principal do AIOStreams, clica em **Save**.
3. Clica em **Install** — o Stremio abre e adiciona o addon automaticamente.

<!-- SCREENSHOT: Página principal do AIOStreams com os botões Save e Install visíveis após configuração completa -->

---

## Por que isto resolve o problema de falhas?

Este setup elimina pontos únicos de falha:

- Se o **Torrentio** cair → AIOStreams puxa streams do Comet ou MediaFusion automaticamente.
- Se o **Debrid** cair → o modo P2P garante resultados via redes torrent tradicionais.

---

## ⚠️ Aviso de Segurança (P2P)

Usar P2P direto sem Debrid expõe o teu IP na rede torrent. Em Portugal o impacto prático tem sido reduzido, mas uma **VPN** é sempre a recomendação técnica correta.

---

## Links

- [GitHub do Tam-Taro (SEL)](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)
- [Ko-fi do Tam-Taro](https://ko-fi.com/tamtaro)
- [Lista de instâncias AIOStreams](https://status.dinsden.top/status/stremio-addons)
- [Guia AIOMetadata](/guias/aiometadata) — para catálogos organizados
