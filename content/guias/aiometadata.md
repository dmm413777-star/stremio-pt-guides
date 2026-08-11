---
title: "AIOMetadata — Catálogos Organizados no Stremio"
date: 2025-01-01
description: "Configura o AIOMetadata com os templates do Tam-Taro para ter catálogos organizados (Tendências, Netflix, Disney+, Anime) no ecrã inicial do Stremio."
tags: ["aiometadata", "catálogos", "tamtaro", "stremio", "cinemeta"]
categorias: ["catálogos", "setup"]
weight: 30
tempo: "10 min"
---

> **Créditos:** Configs AIOMetadata por **[Tam-Taro](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)** ([Ko-fi](https://ko-fi.com/tamtaro)). Guia adaptado em português pela comunidade.

**Tempo estimado: 10 min**

---

## O que é o AIOMetadata?

O **AIOMetadata** é um addon **separado** do AIOStreams — enquanto o AIOStreams gere os streams (links de vídeo), o AIOMetadata gere os **catálogos** que aparecem no ecrã inicial do Stremio: Tendências globais, tops da Netflix, Disney+, Prime Video, listas sazonais e pesquisa por IA.

> **Antes de começares:** Precisas de ter criado as tuas API Keys do [TMDB](/guias/tmdb), [TVDB](/guias/tvdb) e [MDBList](/guias/mdblist). Sem elas não consegues completar a configuração.

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

{{< img src="/images/aiometadata-configure-integrations.png" alt="Separador Integrations do AIOMetadata com campos de API Key" >}}

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

{{< img src="/images/aiometadata-import-config.png" alt="Modal Import Configuration do AIOMetadata com o URL do template colado" >}}

> **No telemóvel:** Guarda o ficheiro JSON e usa a opção Upload.  
> **No PC:** Cola o URL diretamente no campo de importação.

---

## Passo 4 — Resolver o Erro "Max descriptor size reached"

O Stremio tem um limite de tamanho para addons. Como estes templates são muito completos, podem dar erro ao instalar diretamente.

**Solução — StremThru Sidekick:**

1. Copia o teu **Install URL** do AIOMetadata.
2. Abre o [StremThru Sidekick](https://stremthru.13377001.xyz/stremio/sidekick/).
3. Faz login com a tua conta Stremio.
4. Cola o URL e instala por lá.

{{< img src="/images/stremthru-sidekick.png" alt="StremThru Sidekick com o Install URL do AIOMetadata pronto a instalar" >}}

---

## Passo 5 — Desativar o Cinemeta (Cinebye)

O Cinemeta é o catálogo padrão do Stremio — com o AIOMetadata instalado, fica redundante e causa duplicados. Para o desativar:

1. Abre [cinebye.dinsden.top](https://cinebye.dinsden.top).
2. Faz login com a tua conta Stremio.
3. Desativa as **3 opções do Cinemeta** (Search, Catalogs, Meta).
4. Arrasta o **AIOMetadata para o topo** da lista de addons.
5. Clica em **Sync to Stremio**.

---

## Atualizar Configurações no Futuro

Se alterares algo no AIOMetadata mais tarde, não precisas de desinstalar e reinstalar. Usa a função **"Reload"** no StremThru Sidekick para propagar as alterações à tua conta.

---

## Se algo correr mal

**"Max descriptor size reached" no Stremio** — instala via StremThru Sidekick em vez de clicar em Install diretamente no AIOMetadata (ver Passo 4).

**Catálogos não aparecem no ecrã inicial** — verifica se o separador Integrations tem as 3 chaves obrigatórias preenchidas (TMDB, TVDB, MDBList). Uma chave em falta bloqueia os catálogos correspondentes.

**Resultados duplicados** — o Cinemeta ainda está ativo. Desativa-o via Cinebye (ver Passo 5).

---

## Próximo passo

Agora que tens os catálogos organizados, configura as legendas em português:
- [SubMaker — Legendas por IA](/guias/submaker) — traduz legendas automaticamente
- [Toast Translator — Sinopses em PT](/guias/toast-translator) — títulos e sinopses em português

---

## Links

- [GitHub Tam-Taro (AIOMetadata configs)](https://github.com/Tam-Taro/SEL-Filtering-and-Sorting)
- [Ko-fi do Tam-Taro](https://ko-fi.com/tamtaro)
- [StremThru Sidekick](https://stremthru.13377001.xyz/stremio/sidekick/)
- [Cinebye](https://cinebye.dinsden.top)
