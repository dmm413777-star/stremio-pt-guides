---
title: "AIOMetadata — Catálogos Organizados no Stremio"
date: 2025-01-01
description: "Configura o AIOMetadata com os templates do Tam-Taro para ter catálogos organizados (Tendências, Netflix, Disney+, Anime) no ecrã inicial do Stremio."
tags: ["aiometadata", "catálogos", "tamtaro", "stremio", "cinemeta"]
categorias: ["catálogos", "setup"]
weight: 30
---

> **Créditos:** Configs AIOMetadata por **[Tam-Taro](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)** ([Ko-fi](https://ko-fi.com/tamtaro)). Guia adaptado em português pela comunidade.

---

## O que é o AIOMetadata?

O **AIOMetadata** é um addon **separado** do AIOStreams — enquanto o AIOStreams gere os streams (links de vídeo), o AIOMetadata gere os **catálogos** que aparecem no ecrã inicial do Stremio:

- Tendências globais
- Tops da Netflix, Disney+, Prime Video, Apple TV+
- Anime (opcional)
- Listas sazonais e personalizadas
- Pesquisa por IA com Gemini (opcional)

<!-- SCREENSHOT: Ecrã inicial do Stremio após instalar o AIOMetadata, mostrando os catálogos organizados por plataforma -->

---

## Passo 1 — Escolher a Instância

- [ElfHosted AIOMetadata](https://aiometadata.elfhosted.com/configure/) *(instância pública recomendada)*
- [Lista completa de instâncias ativas](https://status.dinsden.top/status/stremio-addons)

---

## Passo 2 — Configurar as Integrações

Antes de importar qualquer template, vai ao separador **Integrations** e insere as tuas API keys:

| Serviço | Obrigatório? | Notas |
|---|---|---|
| **TMDB** | ✅ Sim | Ver [guia TMDB](/guias/tmdb) |
| **TheTVDB** | ✅ Sim | Ver [guia TVDB](/guias/tvdb) |
| **MDBList** | ✅ Sim | Ver [guia MDBList](/guias/mdblist) |
| **Fanart.tv** | Recomendado | Conta gratuita em [fanart.tv](https://fanart.tv) |
| **RPDB** | Opcional | Key gratuita: `t0-free-rpdb` |
| **Gemini** | Opcional | Pesquisa por IA — [aistudio.google.com](https://aistudio.google.com) |

<!-- SCREENSHOT: Separador "Integrations" do AIOMetadata com os campos de API Key visíveis (TMDB, TVDB, MDBList, etc.) -->

> O **RPDB** adiciona as notas do IMDb/Rotten Tomatoes diretamente nas capas. A key `t0-free-rpdb` é pública e não requer registo.

> O **Gemini** permite pesquisa por IA no Stremio — ex: *"filmes parecidos com Interstellar mas passados no fundo do mar"*.

---

## Passo 3 — Importar o Template do Tam-Taro

No separador **Configuration**, clica em **Import Configuration** e usa um destes links:

**Com Anime:**
```
https://raw.githubusercontent.com/Tam-Taro/SEL-Filtering-and-Sorting/refs/heads/main/AIOMetadata%20Configs/Tamtaro-aiometadata-config-with-anime.json
```

**Sem Anime:**
```
https://raw.githubusercontent.com/Tam-Taro/SEL-Filtering-and-Sorting/refs/heads/main/AIOMetadata%20Configs/Tamtaro-aiometadata-config-without-anime.json
```

<!-- SCREENSHOT: Modal "Import Configuration" do AIOMetadata com o URL do template colado -->

> **No telemóvel:** Guarda o ficheiro JSON e usa a opção Upload.  
> **No PC:** Cola o URL diretamente no campo de importação.

---

## Passo 4 — Resolver o Erro "Max descriptor size reached"

O Stremio tem um limite de tamanho para addons. Como estes templates são muito completos, podem dar erro ao instalar diretamente.

<!-- SCREENSHOT: Erro "Max descriptor size reached" no Stremio ao tentar instalar o AIOMetadata diretamente -->

**Solução — StremThru Sidekick:**

1. Copia o teu **Install URL** do AIOMetadata.
2. Abre o [StremThru Sidekick](https://stremthru.13377001.xyz/stremio/sidekick/).
3. Faz login com a tua conta Stremio.
4. Cola o URL e instala por lá.

<!-- SCREENSHOT: StremThru Sidekick com o Install URL colado e pronto a instalar -->

---

## Passo 5 — Desativar o Cinemeta (Cinebye)

O Cinemeta é o catálogo padrão do Stremio — com o AIOMetadata instalado, fica redundante e causa duplicados. Para o desativar:

1. Abre [cinebye.dinsden.top](https://cinebye.dinsden.top).
2. Faz login com a tua conta Stremio.
3. Desativa as **3 opções do Cinemeta** (Search, Catalogs, Meta).

<!-- SCREENSHOT: Interface do Cinebye com as 3 opções do Cinemeta desativadas -->

4. Arrasta o **AIOMetadata para o topo** da lista de addons.
5. Clica em **Sync to Stremio**.

<!-- SCREENSHOT: Lista de addons no Cinebye reordenada com AIOMetadata no topo, antes de clicar Sync -->

---

## Atualizar Configurações no Futuro

Se alterares algo no AIOMetadata mais tarde, não precisas de desinstalar e reinstalar. Usa a função **"Reload"** no StremThru Sidekick para propagar as alterações à tua conta.

---

## Links

- [GitHub Tam-Taro (AIOMetadata configs)](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)
- [Ko-fi do Tam-Taro](https://ko-fi.com/tamtaro)
- [StremThru Sidekick](https://stremthru.13377001.xyz/stremio/sidekick/)
- [Cinebye](https://cinebye.dinsden.top)
