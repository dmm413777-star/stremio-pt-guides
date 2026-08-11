---
title: "TVDB API Key — Como Criar"
date: 2025-01-01
description: "Como criar gratuitamente a tua API Key do TheTVDB, necessária para o AIOStreams e o AIOMetadata identificarem séries correctamente."
tags: ["tvdb", "api-key", "metadata", "stremio"]
categorias: ["api-keys"]
weight: 61
tempo: "5 min"
---

> **Créditos:** Baseado nos guias de [Viren070](https://guides.viren070.me/stremio).

O TheTVDB é a base de dados de séries de televisão. O AIOStreams e o AIOMetadata usam esta chave para identificar correctamente séries, temporadas e episódios — especialmente útil para séries com nomes ambíguos ou animação.

**Tempo estimado: 5 min**

> **Antes de começares:** Precisas de criar uma conta gratuita no TheTVDB. O e-mail de confirmação pode demorar alguns minutos.

---

## Passo a Passo

1. Abre [thetvdb.com](https://thetvdb.com) e cria uma conta (botão **Register** no canto superior direito).
2. Confirma o e-mail de activação.
3. Faz login e clica no teu nome de utilizador (canto superior direito) → **API Access**.
4. Em **Project Keys**, clica em **Generate API Key**.
5. Preenche o formulário:

| Campo | O que preencher |
|---|---|
| **Name** | Qualquer nome, ex: `Stremio Personal` |
| **Description** | `Using for Stremio addon metadata` |

6. Clica **Save** e copia a chave gerada.

---

## Onde Usar

- **AIOStreams:** Cola no campo **TVDB API Key** durante o passo "Enter Credentials" do assistente — ver [guia AIOStreams](/guias/aiostreams-tamtaro).
- **AIOMetadata:** Cola no campo **TheTVDB** no separador Integrations — ver [guia AIOMetadata](/guias/aiometadata).

---

## Próximo passo

→ [AIOStreams + Template SEL](/guias/aiostreams-tamtaro) — instala e configura o addon principal de streams

---

## Links

- [TheTVDB](https://thetvdb.com)
- [Página de API do TVDB (após login)](https://thetvdb.com/api-information)
