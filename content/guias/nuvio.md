---
title: "Nuvio — Guia de Início"
date: 2025-01-01
description: "Tudo o que precisas para começar com o Nuvio: instalar a app, adicionar addons, configurar autoplay e otimizar para Android TV."
tags: ["nuvio", "android-tv", "addons", "autoplay", "stremio"]
categorias: ["setup", "nuvio"]
weight: 10
---

> **Créditos:** Guia baseado no post original de **u/WildRabbitz** no r/PiratariaTuga, com adições e formatação pela comunidade.

---

## O que é o Nuvio?

O **Nuvio** é uma alternativa ao Stremio compatível com o ecossistema de addons Stremio. Tem interface mais moderna, suporte a autoplay, e é especialmente popular em Android TV/Google TV.

<!-- SCREENSHOT: Ecrã inicial do Nuvio após login, mostrando a interface com catálogos -->

> O Nuvio está atualmente em **beta**. Funciona melhor com um serviço de Debrid ativo — ver [guia TorBox](/guias/torbox).

**Site oficial:** [nuvioapp.space](https://nuvioapp.space)  
**GitHub:** [github.com/tapframe](https://github.com/tapframe)  
**Suporte ao desenvolvimento:** [Ko-fi do Tapframe](https://ko-fi.com/tapframe)

---

## Instalar no Android TV / Google TV

1. Instala a app **Downloader by AFTVNEWS** pela Play Store.

<!-- SCREENSHOT: App "Downloader by AFTVNEWS" na Play Store da Android TV -->

2. Ativa **Instalar apps desconhecidas** para o Downloader: Definições → Segurança e Restrições.

<!-- SCREENSHOT: Definições da Android TV com a opção "Instalar apps desconhecidas" ativa para o Downloader -->

3. Abre o Downloader e introduz o código **`3298577`** na caixa de pesquisa.

<!-- SCREENSHOT: App Downloader aberta com o código 3298577 inserido na caixa de pesquisa -->

4. Transfere o ficheiro e seleciona **Instalar**.
5. Abre o Nuvio a partir da lista de apps.

---

## Adicionar Addons (via Stremio Web)

A forma mais fácil de obter o URL de um addon é através do Stremio web:

1. No Stremio, vai à página de **Addons** (ícone de puzzle).
2. Seleciona o addon pretendido e clica no ícone de **Definições (Settings)** (⚙️).

<!-- SCREENSHOT: Página de Addons do Stremio Web com o ícone de Settings visível num addon -->

3. Desce até ao botão **Install** e escolhe **Copy Link** ou **Share Manifest URL**.

<!-- SCREENSHOT: Modal de settings de um addon com o botão "Share Manifest URL" ou "Copy Link" visível -->

4. Abre o Nuvio → **Settings → Content & Discovery → Addons**.
5. Cola o URL no campo **Add Addon** e confirma.

<!-- SCREENSHOT: Ecrã de Addons no Nuvio com o campo "Add Addon" visível e preenchido -->

> **Dica:** Se apenas aparecer o botão "Install" sem opção de copiar link, clica com o botão **direito** sobre ele e seleciona **"Copiar endereço do link"**. Depois substitui `stremio://` por `https://` no início do URL.

---

## Ativar o Autoplay (Reprodução Automática)

Para que o próximo episódio comece automaticamente sem erros, vai a **Settings → Playback** e configura:

| Opção | Valor |
|---|---|
| **Player (internal) → Reuse last Link** | `ON` |
| **Stream Selection → Auto-Play regex match → Autoplay Next Eps** | `ON` |
| **Regex pattern** | `2160p\|4K\|1080P` |

<!-- SCREENSHOT: Ecrã de Settings do Nuvio com as opções de Autoplay configuradas como indicado na tabela acima -->

### O que é o Regex Sorting?

O *Regex* funciona como um filtro de pesquisa inteligente. Este padrão diz ao Nuvio para escolher automaticamente apenas ficheiros que contenham `4K`, `2160p` ou `1080P` no nome — garantindo sempre a melhor qualidade disponível.

---

## Links Úteis

- [Lista de Addons Stremio](https://stremio-addons.net/)
- [GitHub do Nuvio (tapframe)](https://github.com/tapframe)
- [Doações (Ko-fi)](https://ko-fi.com/tapframe)
- [TorBox — Serviço Debrid recomendado](/guias/torbox)
- [Migrar do Stremio para o Nuvio (NuvioSync)](/guias/migrar-para-nuvio)
- [Clonar perfil Nuvio para familiar](/guias/clonar-perfil-nuvio)
