---
title: "TVDB API Key — Como Criar"
date: 2025-01-01
description: "Como criar gratuitamente a tua API Key do TheTVDB, necessária para o AIOStreams e o AIOMetadata identificarem séries correctamente."
tags: ["tvdb", "api-key", "metadata", "stremio"]
categorias: ["api-keys"]
weight: 61
---

> **Créditos:** Baseado nos guias de [Viren070](https://guides.viren070.me/stremio).

A **API Key do TheTVDB** é gratuita e necessária para o AIOStreams e o AIOMetadata identificarem séries, temporadas e episódios correctamente — especialmente útil para séries com nomes ambíguos ou animação.

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

## Links

- [TheTVDB](https://thetvdb.com)
- [Página de API do TVDB (após login)](https://thetvdb.com/api-information)
