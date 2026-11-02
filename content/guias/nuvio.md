---
title: "Nuvio: Guia de Início"
date: 2025-01-01
description: "Tudo o que precisas para começar com o Nuvio: instalar a app, adicionar addons, configurar autoplay e otimizar para Android TV."
tags: ["nuvio", "android-tv", "addons", "autoplay", "stremio"]
categorias: ["setup", "nuvio"]
weight: 4
tempo: "15 min"
---

{{< callout type="info" >}}
**Créditos:** Guia baseado no post original de **u/WildRabbitz** no r/PiratariaTuga, com adições e formatação pela comunidade.
{{< /callout >}}

O Nuvio é uma alternativa ao Stremio compatível com o ecossistema de addons Stremio, com interface mais moderna, suporte a autoplay e especialmente popular em Android TV/Google TV.

**Tempo estimado: 15 min**

{{< callout type="warning" >}}
**Antes de começares:** O Nuvio funciona melhor com um serviço de Debrid activo. Ver [guia TorBox](/guias/torbox). Sem Debrid funciona em P2P, mas a experiência é muito melhor com ele.
{{< /callout >}}

---

## O que é o Nuvio?

O **Nuvio** é uma alternativa ao Stremio compatível com o ecossistema de addons Stremio. Tem interface mais moderna, suporte a autoplay, e é especialmente popular em Android TV/Google TV.

{{< callout type="info" >}}
O Nuvio está atualmente em **beta**. Funciona melhor com um serviço de Debrid ativo. Ver [guia TorBox](/guias/torbox).
{{< /callout >}}

**Site oficial:** [nuvioapp.space](https://nuvioapp.space)  
**GitHub:** [github.com/tapframe](https://github.com/tapframe)  
**Suporte ao desenvolvimento:** [Ko-fi do Tapframe](https://ko-fi.com/tapframe)

---

## Instalar no Android TV / Google TV

1. Instala a app **Downloader by AFTVNEWS** pela Play Store.
2. Ativa **Instalar apps desconhecidas** para o Downloader: Definições → Segurança e Restrições.
3. Abre o Downloader e introduz o código **`3298577`** na caixa de pesquisa.
4. Transfere o ficheiro e seleciona **Instalar**.
5. Abre o Nuvio a partir da lista de apps.

---

## Adicionar Addons — a forma mais rápida

O [QuickStart PT](/#qs-widget) instala directamente numa conta Nuvio: no passo de login, activa o toggle **Nuvio** em vez de Stremio, e o pack de addons PT (AIOStreams, AIOMetadata PT, SubMaker, Toast Translator e os restantes) fica instalado em 3 cliques, sem precisares de passar pelo Stremio.

## Adicionar outros addons manualmente

Para um addon que não está no pack do QuickStart:

1. Copia o URL do manifest do addon (começa por `https://...manifest.json`).
2. Abre o Nuvio → **Settings → Content & Discovery → Addons**.
3. Cola o URL no campo **Add Addon** e confirma.

Se preferires fazer isto fora da app, a ferramenta [Instalar Addon por URL](/instalar-addon/) faz o mesmo a partir do telemóvel ou computador — útil sobretudo em Android TV, onde abrir links `stremio://` nem sempre funciona.

{{< callout type="info" >}}
**Dica:** Se só tiveres um link `stremio://` (por exemplo copiado do Stremio Web), substitui `stremio://` por `https://` no início do URL antes de colar.
{{< /callout >}}

---

## Ativar o Autoplay (Reprodução Automática)

Para que o próximo episódio comece automaticamente sem erros, vai a **Settings → Playback** e configura:

| Opção | Valor |
|---|---|
| **Player (internal) → Reuse last Link** | `ON` |
| **Stream Selection → Auto-Play regex match → Autoplay Next Eps** | `ON` |
| **Regex pattern** | `2160p\|4K\|1080P` |

### O que é o Regex Sorting?

O *Regex* funciona como um filtro de pesquisa inteligente. Este padrão diz ao Nuvio para escolher automaticamente apenas ficheiros que contenham `4K`, `2160p` ou `1080P` no nome, garantindo sempre a melhor qualidade disponível.

---

## Se algo correr mal

**O Nuvio não instala no Android TV**. Verifica se activaste "Instalar apps desconhecidas" especificamente para o Downloader (não apenas em geral). O passo é em Definições → Segurança e Restrições → Instalar apps desconhecidas → Downloader.

**Addon não aparece depois de adicionado**. Confirma que o URL começa por `https://` e não `stremio://`. Se copiaste da app Stremio, substitui o prefixo.

**Autoplay não funciona**. Confirma que activaste a opção "Reuse last Link" em Settings → Playback. Sem esta opção, o autoplay abre o ecrã de selecção de stream em vez de reproduzir automaticamente.

---

## Links Úteis

- [Lista de Addons Stremio](https://stremio-addons.net/)
- [GitHub do Nuvio (tapframe)](https://github.com/tapframe)
- [Doações (Ko-fi)](https://ko-fi.com/tapframe)
- [TorBox: serviço Debrid recomendado](/guias/torbox)
- [Migrar uma conta Stremio já existente para o Nuvio (NuvioSync)](/guias/migrar-para-nuvio)
- [Clonar perfil Nuvio para familiar](/guias/clonar-perfil-nuvio)
