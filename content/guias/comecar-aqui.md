---
title: "Começa Aqui"
date: 2025-01-01
description: "Nunca ouviste falar de Stremio? Começa aqui. Em 5 minutos sabes o que é, o que precisas, e qual o caminho mais rápido para teres tudo a funcionar."
tags: ["início", "stremio", "guia", "básico"]
categorias: ["inicio"]
weight: 1
---

## O que é isto?

O **Stremio** funciona como o Netflix — mas gratuito, sem limite de conteúdo, e sem subscrições. É uma app que agrega streams de filmes e séries de várias fontes e apresenta tudo numa interface limpa. Instalas "addons" (extensões) que encontram os conteúdos por ti.

O **Nuvio** é uma alternativa ao Stremio com a mesma ideia mas interface mais moderna, popular em Android TV. Os dois usam os mesmos addons.

---

## O que são addons e debrid?

**Addon** — uma extensão que o Stremio usa para encontrar streams de filmes e séries. Cada addon sabe procurar em sítios diferentes. Instalas vários e o Stremio apresenta-te todos os resultados numa lista.

**Debrid** — um serviço pago (~28€/ano) que guarda ficheiros em cache nos servidores deles. Em vez de fazeres download ou dependeres de outros utilizadores a partilhar, o ficheiro já está lá pronto. Resultado: qualidade 4K instantânea, sem buffering, como o Netflix. **Não é obrigatório** — o Stremio funciona sem ele, mas a experiência é melhor com.

---

## O que precisas para começar

| Situação | O que fazer |
|---|---|
| **Quero apenas experimentar** | Instala o Stremio + AIOStreams em modo P2P. Gratuito, funciona já. Qualidade variável. |
| **Quero a melhor experiência** | Stremio + [TorBox](/guias/torbox) (~28€/ano) + AIOStreams. Qualidade 4K instantânea, sem esperas. |
| **Quero dar à família também** | Stremio + TorBox (partilhável sem bloqueios) + [QuickStart PT](/tools/quickstart/) para instalar em todas as contas com um clique. |

---

## Caminho Recomendado

### Para quem quer a melhor experiência (tempo total: ~30 min, depois é só usar)

1. [Criar conta TorBox](/guias/torbox) — 10 min
2. [Criar TMDB API Key](/guias/tmdb) — 5 min
3. [Criar TVDB API Key](/guias/tvdb) — 5 min
4. [Configurar AIOStreams + Template SEL](/guias/aiostreams-tamtaro) — 15 min
5. [Configurar AIOMetadata](/guias/aiometadata) — 10 min
6. [Legendas em português](/guias/aiostreams-legendas-pt) — 2 min

---

### Para quem já usa Stremio e quer melhorar

1. [AIOStreams + Template SEL](/guias/aiostreams-tamtaro) — melhora os streams com filtros automáticos
2. [Legendas Embutidas PT](/guias/aiostreams-legendas-pt) — streams com legendas PT já incluídas
3. [AIOMetadata](/guias/aiometadata) — organiza o ecrã inicial por plataformas

---

### Para quem quer migrar para o Nuvio

1. [O que é o Nuvio e como instalar](/guias/nuvio)
2. [Migrar do Stremio para o Nuvio](/guias/migrar-para-nuvio) — move biblioteca, histórico e addons

---

## Glossário Rápido

| Termo | O que é |
|---|---|
| **Addon** | Extensão do Stremio que procura streams ou metadados (capas, sinopses, etc.) |
| **Debrid** | Serviço pago que guarda ficheiros em cache — streams instantâneos sem depender de seeders |
| **Cache** | Ficheiro já guardado num servidor — carrega instantaneamente quando pedido |
| **P2P** | Peer-to-peer — os ficheiros vêm directamente de outros utilizadores, sem cache |
| **Manifest URL** | Endereço único de um addon — é o que collas no Stremio para instalar um addon manualmente |
| **API Key** | Chave de acesso a um serviço externo (TMDB, TorBox, etc.) — como uma password de acesso à API |
| **TMDB** | TheMovieDB — base de dados de filmes e séries usada pelos addons para identificar conteúdo |
| **AIOStreams** | O addon principal de streams — agrega dezenas de fontes numa só lista organizada |
| **SEL** | Sistema de filtros do template Tam-Taro para o AIOStreams — ordena streams por qualidade automaticamente |
| **Stream** | O link de vídeo que o Stremio usa para reproduzir o conteúdo |

---

## Quando algo não funciona

90% dos problemas estão cobertos nestas duas páginas:

- [Problemas Comuns e Soluções](/guias/problemas-comuns) — buffering, streams em falta, addons com erro
- [FAQ](/guias/faq) — perguntas frequentes sobre debrid, VPN e segurança
